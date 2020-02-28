export * from './decorators/dependency';
export * from './decorators/describe';

import { ServiceRegistryImpl } from './service/impl/ServiceRegistryImpl';
import { dependency } from './decorators/dependency';
import { describe } from './decorators/describe';

process.env.LOG_LEVEL = 'debug;';

@dependency()
class UserService {
  public name: string = 'test';
  constructor() {}
}

@dependency()
class ServiceX {
  constructor(@describe(UserService) public userService: UserService, @describe('foo bar') public name: string) {}
}

const serviceX: ServiceX = ServiceRegistryImpl.instance.instance(ServiceX as any);

console.log('serviceX', serviceX);
