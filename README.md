# Summary

Simple and lightweight IoC to support mu-ts and lambda needs.

# Usage

Usage is simple, with two decorators you define services and inject them, or static values, in constructors to services.

First, decorate your dependency objects with `@dependency()` which results in a `Proxy` being returned. This proxy has a traps to ensure dependencies are looked up to be resolved when they are needed.

```
interface SomeService{}

@dependency()
class SomeServiceImpl implements SomeService{}
```

Next, decorate your dependencies constructor with `@describe(ClassName)` to have an instance of that dependency provided. Alternatively, you can provide a static string, boolean or number value as well `@describe('MyStatic Value')`. All arguments must be described or construction will fail.

```
class AnotherService {
  constructor(@describe(SomeServiceImpl) someService: SomeService, @describe('John Doe') staticValue:string){}
}
```

