import { Logger, LoggerService } from '@mu-ts/logger';
import { ServiceRegistry } from "../ServiceRegistry";


export class ServiceRegistryImpl implements ServiceRegistry {

    private logger: Logger;
    private registry: { [type: string]: Function }

    constructor() {
        this.logger = LoggerService.named({ name: this.constructor.name, adornments: { '@mu-ts': 'ioc' } })
        this.registry = {};
        this.logger.debug('init()');
    }

    /**
     * 
     * @param t interface or name to associate to the class.
     * @param target instance to create.
     */
    public register<T>(t: T | string, target: Function): void {

    }

    public instance<T>(t: T | string): T {
        return undefined as T;
    }
}

console.log("ServiceRegistryImpl", ServiceRegistryImpl.constructor.arguments)