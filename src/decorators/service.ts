/**
 * 
 */
export function service<T extends any>(): any {
  // const collectionRegistry: CollectionRegistry = new CollectionRegistryImpl();
  return (target: typeof Function): typeof Function | void => {
    /** 
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
     */
    return new Proxy(target, {
      /**
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct
       * 
       * @param target  The target object.
       * @param args The list of arguments for the constructor.
       * @param newTarget The constructor that was originally called, p above.
       */
      // @ts-ignore
      construct(target: FunctionConstructor, args: any[], newTarget: FunctionConstructor) {
        console.log('cosntruing with arguments', args)
        // TODO Check if argument has a match in teh service registry, return it if it does.

        // expected output: "monster1 constructor called"

        return new target(...args);
      },
      /**
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       * 
       * @param target 
       * @param prop 
       * @param receiver 
       */
      // @ts-ignore
      get: function (target: T, propertyName: string, receiver: any) {
        console.log('getting property', `${target.class.name}.${propertyName}`);
        return target[propertyName]
      }
    });
  };
}

@service()
class MyOtherServiceX {
  constructor() { }
}


@service()
class MyServiceX {
  public other: MyOtherServiceX;
  public name: string;

  constructor(name: string, other: MyOtherServiceX) {
    this.name = name;
    this.other = other;
  }
}


console.log('this name', new MyServiceX('test', MyOtherServiceX).name);