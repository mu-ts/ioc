export interface ServiceRegistry {
  register<T>(template: FunctionConstructor, name?: string): void;
  instance<T>(constructor: FunctionConstructor): T;
  describe<T>(template: FunctionConstructor, index: number, type: T | string | number | boolean): void;
  wrap<T>(template: T): T;
}
