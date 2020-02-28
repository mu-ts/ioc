export interface ServiceRegistry {
  register(template: FunctionConstructor, name?: string): void;
  instance<T>(template: any): T;
  describe<T>(template: FunctionConstructor, index: number, type: T | string | number | boolean): void;
}
