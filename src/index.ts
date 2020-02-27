import { ServiceRegistryImpl } from './service/impl/ServiceRegistryImpl';
import { service } from './decorators/service';
import { inject } from './decorators/inject';

@service()
class UserService {
  public name: string = 'test';
  constructor() {}
}

@service()
class ServiceX {
  constructor(@inject(UserService) public userService: UserService, @inject('foo bar') public name: string) {}
}

const serviceX: ServiceX = ServiceRegistryImpl.instance.instance(ServiceX as any);

console.log('serviceX', serviceX);
