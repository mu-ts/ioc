import { ServiceRegistry } from '../service/ServiceRegistry';
import { ServiceRegistryImpl } from '../service/impl/ServiceRegistryImpl';

export function inject<T>(value: T | string | number | boolean) {
  const serviceRegistry: ServiceRegistry = ServiceRegistryImpl.instance;
  return function(target: any, propertyKey: string | symbol, index: number) {
    serviceRegistry.describe(target, index, value);
  };
}
