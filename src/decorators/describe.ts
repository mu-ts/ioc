import { ServiceRegistry } from '../service/ServiceRegistry';
import { ServiceRegistryImpl } from '../service/impl/ServiceRegistryImpl';

export function describe<T>(value: T | string | number | boolean) {
  const serviceRegistry: ServiceRegistry = ServiceRegistryImpl.instance;
  // @ts-ignore
  return function(target: any, propertyKey: string | symbol, index: number) {
    serviceRegistry.describe(target, index, value);
  };
}
