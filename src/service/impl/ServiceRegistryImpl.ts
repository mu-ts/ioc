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

  protected constructor() {
    this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 'ioc' } });
    this.registry = {};
    this.logger.debug('init()');
  }

  /**
   *
   * @param constructor to create new instances with.
   * @param name to register this instance with.
   */
  public register(template: FunctionConstructor): void {
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
    if (!this.registry[template.name]) this.registry[template.name] = { constructorArgs: [] };
    if (typeof type === 'function') this.registry[template.name].constructorArgs[index] = { type: 'reference', value: type };
    else this.registry[template.name].constructorArgs[index] = { type: 'static', value: type };
  }

  /**
   *
   * @param template
   */
  public wrap<T>(template: any): T {
    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
     */
    return new Proxy(template, {
      /**
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct
       *
       * @param target  The target object.
       * @param args The list of arguments for the constructor.
       * @param newTarget The constructor that was originally called, p above.
       */
      construct(target: FunctionConstructor, args: any[], newTarget: FunctionConstructor) {
        const newArgs: any = args.map((arg: any) => {
          if (typeof arg === 'function') {
            if (this.registry[arg.constructor.name]) return this.instance(this.registry[arg.constructor.name]);
            if (this.registry[arg.name]) return this.instance(this.registry[arg.name]);
          }
          return arg;
        });

        return new target(...newArgs);
      },
    });
  }

  /**
   *
   * @param t
   */
  public instance<T>(constructor: FunctionConstructor): T {
    if (constructor.length === 0) return (new constructor() as any) as T;
    const argz: any[] = this.registry[constructor.name].constructorArgs.map((arg: { type: 'static' | 'reference'; value: any }) => {
      if ('static' === arg.type) {
        return arg.value;
      } else {
        return this.instance(arg.value);
      }
    });
    return (new constructor(...argz) as any) as T;
  }

  /**
   * Returns an instance of this registry.
   */
  public static get instance() {
    if (!this._i) this._i = new ServiceRegistryImpl();
    return this._i;
  }
}
