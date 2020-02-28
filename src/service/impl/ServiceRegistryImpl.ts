import { Logger, LoggerService } from '@mu-ts/logger';
import { ServiceRegistry } from '../ServiceRegistry';

export class ServiceRegistryImpl implements ServiceRegistry {
  private static _i: ServiceRegistryImpl;

  private logger: Logger;
  private registry: {
    [type: string]: {
      constructor?: Function;
      constructorArgs: { type: 'static' | 'reference'; value: any }[];
    };
  };
  private instances: { [type: string]: any };

  protected constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 'ioc' } });
    this.registry = {};
    this.instances = [];
    this.logger.debug('init()');
  }

  /**
   *
   * @param constructor to create new instances with.
   * @param name to register this instance with.
   */
  public register(template: FunctionConstructor): void {
    this.logger.debug('register()', 'Registering an object.', { name: template.name });
    if (!this.registry[template.name]) this.registry[template.name] = { constructorArgs: [] };
    this.registry[template.name].constructor = template;
  }

  /**
   *
   * @param template to further describe the constructor of.
   * @param index in the constructor for this value.
   * @param type for this attribute.
   * @param value static value to provide.
   */
  public describe<T>(template: FunctionConstructor, index: number, type: T | string | number | boolean): void {
    this.logger.debug('describe()', 'Descirbing a constructor.', { name: template.name, index, type });
    if (!this.registry[template.name]) this.registry[template.name] = { constructorArgs: [] };
    if (typeof type === 'function') this.registry[template.name].constructorArgs[index] = { type: 'reference', value: type };
    else this.registry[template.name].constructorArgs[index] = { type: 'static', value: type };
  }

  /**
   *
   * @param template
   */
  public instance<T>(template: any): T {
    this.logger.debug('wrap()', 'Wrapping an instance and returning a proxy.', { name: template.name });

    if (!this.registry[template.name]) {
      return template;
    }

    let instance: T = this.instances[template.name];

    if (!instance) {
      /**
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
       */
      const that: any = this;
      const proxy: any = new Proxy(template, {
        /**
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct
         *
         * @param target  The target object.
         * @param args The list of arguments for the constructor.
         */
        construct(target: FunctionConstructor, args: any[]) {
          const newArgs: any = args.map((arg: any) => {
            if (arg.type === 'reference') {
              if (that.registry[arg.value.constructor.name]) return that.instance(arg.constructor.name);
              if (that.registry[arg.value.name]) return that.instance(arg.name);
            } else {
              return arg.value;
            }
          });

          that.logger.debug('instance()', 'Arguments for proxy.', { newArgs });

          return new target(...newArgs);
        },
      });

      instance = (new proxy(...this.registry[template.name].constructorArgs) as any) as T;

      this.logger.debug('instance()', 'New instance created', { name: instance.constructor.name });
    }

    return instance;
  }

  /**
   * Returns an instance of this registry.
   */
  public static get instance() {
    if (!this._i) this._i = new ServiceRegistryImpl();
    return this._i;
  }
}
