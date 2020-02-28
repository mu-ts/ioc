import { ServiceRegistry } from '../service/ServiceRegistry';
import { ServiceRegistryImpl } from '../service/impl/ServiceRegistryImpl';

/**
 *
 * @param name that this service should be mapped to. Otherwise constructor.name will be used.
 */
// @ts-ignore
export function dependency(): any {
  const serviceRegistry: ServiceRegistry = ServiceRegistryImpl.instance;
  return (target: typeof Function): typeof Function | void => {
    serviceRegistry.register(target);
    return serviceRegistry.instance(target);
  };
}
