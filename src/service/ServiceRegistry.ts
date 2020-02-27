export interface ServiceRegistry {
    register<T>(t: T | string, target: Function): void;
    instance<T>(t: T | string): T;
}