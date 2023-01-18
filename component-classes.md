# Obtaining a component

We're currently grouping our features using [Constructor functions][javascript-constructor-functions] and assigning methods on [their prototype][javascript-function-prototype]. 

[javascript-constructor-functions]: https://javascript.info/constructor-new
[javascript-function-prototype]: https://javascript.info/function-prototype

```js
function HelloComponent(module, config) {
  this.module = module;
  this.config = config;
}

Component.prototype.init = function() {
  this.module.innerText = "Hello " + this.config.name;
}
```

It works, but it's not really state of the art. EcmaScript now offer proper classes which would let us create a component in a more idiomatic way. 

```js
class Component {
  constructor(module, config) {
    this.module = module;
    this.config = config;
  }

  init() {
    this.module.innerText = "Hello " + this.config.name;
  }
}
```

It's a lot of syntactic sugar, there's still a prototype behind the scenes. But not just. Actual classes have some [notable differences from constructor functions][javascript-classes-difference-constructor-fn].

[javascript-classes-difference-constructor-fn]: https://javascript.info/class#not-just-a-syntactic-sugar

One thing they enable is a tidy, native, way of doing inheritance. It was somewhat achievable with constructor functions, but needed a lot of care in its implementation (especially to keep the prototype chain neat and have some help to call methods from parent classes).

Our components share some common behaviours. Most obvious are those receiving a configuration. We could share these behaviours in a common "BaseComponent" class.

```js
class BaseComponent {
  constructor(module, config) {
    this.module = module;
    this.config = config;
  }
}

class HelloComponent extends BaseComponent {
  init() {
    this.module.innerText = "Hello " + this.config.name
  }
}
```

## Sometimes we need to not initialise

If some parts of the components are missing, we tend to abort initialisation early. This sounds a perfect candidate for the base class. However it requires a little caution in its implementation.

The following example may feel like it has the issue sorted at first glance with its `if` in the `BaseComponent` constructor. It's not quite there though

```js
class BaseComponent {
  constructor(module, config = {}) {
    if (!module) {
      return;
    }
    this.module = module;
    this.config = config;
  } 
}

class Component extends BaseComponent {
  constructor(module, config = {}) {
    super(module, config);
    // THAT WILL RUN WHETHER A MODULE IS PASSED OR NOT
  }
}
```

Instead we can make that possibility to not initialise explicit. For that we could have the component's `constructor` marked as a private API for our own use to encapsulate a lifecycle for initialisation where:

1. We check if we should initialise in a `getReasonNotToInitialise(module, config)` method
2. Log whatever reason not to initialise we'd have
3. If we didn't get reasons not to initialise, call the component's `initialise(module, config)` method.

```js
class BaseComponent {
  /**
   * A private constructor that encapsulate the initialisation
   * lifecycle
   * @private
   */
  constructor(module, config = {}) {
    const reason = this.getReasonNotToInitialise(module, config)

    if (reason) {
      // Q: Should we throw here rather than log and continue?
      console.error(reason)
      return;
    }

    this.initialise(module, config)
  }

  // Defaults to a no-op
  getReasonNotToInitialise(module, config){}

  // Defaults to storing the module and config
  initialise(module, config) {
    this.module = module
    this.config = config
  }
}

class HelloComponent {
  shouldNotInitialise(module, config) {
    if (!config.name) {
      return new Error('The component requires a name')
    }
  }

  initialise() {
    // Q: Should this be run automatically by the BaseComponent? Would that chain if we have SubComponent < Component < BaseComponent 
    super.initialise();
    this.module.innerText = "Hello " + this.config.name
  }
}
```

## Classes are all or nothing

As time will pass, the `BaseComponent` will likely collect more and more shared features. Not all components share all behaviours though. This means that importing individual components may lead to them loading lots of unnecessary code.

It's possible to define classes dynamically through functions. This allows to merge multiple behaviours, in a defined order, while allowing parent calls using `super`. It's [a practice described by TypeScript for mixins][typescript-mixin] as well as implemented under the hood by [the `mixwith` library][mixwith] 

[typescript-mixin]: https://www.typescriptlang.org/docs/handbook/mixins.html
[mixwith]: https://github.com/justinfagnani/mixwith.js

```js
class BaseComponent {
  // Same as in previous example
}

function withMergedConfiguration(BaseClass = class {}) {
  return class extends BaseClass {
    initialise(module, config) {
      super.initialise(module, config);

      this.config = this.mergeConfigs();
    }

    mergeConfigs() {
      // Reads the configuration from the module, the JS config provided, maybe even some component static configuration...
    }
  }
}

class ComponentA extends withMergedConfiguration(BaseComponent) {
}
```

Each component gets only the feature they need. `super` can be used to access parent methods in the order of the chain. 🎉

The downside is that each component will have its own parent class now. Not necessarily bad. What's more troublesome is that we won't be able to use `instanceof` to check if a class implements a specific mixin.

We'd also need a little helper to merge multiple mixins at once, which is quite likely to happen.

> **Warning**
> One thing to check is whether TypeScript would be able to follow the trail of types through such mixins and what would happen on the JSDoc side as well, as we consider rendering it properly at some point.

> **Note**
> Another approach would be instance mixins, ran in the constructor to update methods and run extra initialisation. Something akin to [stimulus-use]. However that approach has several drawbacks on using class mixin:
>
>- calling a method you're overriding is more complex (need to save the method in a variable and then `.apply`)
>- methods are set on each instance, rather than shared among the instances of the class
>- it runs at every instantiation, rather than once when defining the class

[stimulus-use]:https://github.com/stimulus-use/stimulus-use

## Tangential thoughts

### Static methods & fields

ES6 brought static methods and ES2022 brings in static class fields. This allows to declare fields and methods that can be accessed on the class itself rather than only inside the instance:

```js
class Song {
  static hey = 'I just met you'

  static callMe() {
    return "maybe"
  }
}
```

#### Avoiding setting too much stuff on the class

They seem handy for grouping code related to the class with it. However, they can quickly lead to unspotted unused code. The compiler/linter doesn't have enough info to tell if the static field or method is there because it needs to be accessed by the class itself or be part of its public API. That means it can't tell if the call is meant to be used or not and flag if nothing uses it anymore.

ESModule and their `export` still allow to group code with the class, allowing to distinguish whether the method or variable should be used.

I'd offer this guideline as how to pick whether this should end in the class or not: “no `this`/`<name of the class>` in the function or not a ‘hook/lifecycle method’ of the class, then out in the module, potentially exported if it needs use in other places”. Note that this would also apply to regular fields and methods.

It's also worth thinking about the class responsibilities before adding something to its static method to check whether the method actually is the responsibility of the class or should be in its own module. This also applies more generally to what goes into which module.

#### Transpilation

Static methods are part of ES6 so won't need transpilation.
Static fields are transpiled by Babel with:

1. A bit of boilerplate:

```js
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
```

2. One `_defineProperty` call per field

```js
_defineProperty(Component, "field", 'value');
_defineProperty(Component, "field2", 'value2');
```

### Private methods & fields

ES2022 also brings in the ability to have private fields and methods in classes (prefixed by `#`). This makes fields and methods only accessible to instances of that classes and not:

1. from the outside of the class
2. from descendants of the class.

This sounds tempting for separating our public and private API clearly. However
this draws a hard line between what can and cannot be accessed. I'd favour a looser approach of only using public methods and documenting that they're not part of our public API using JSDoc's `@private`. This will let people reach to internals to unblock themselves, which they wouldn't be able to do if we were using proper private variables.





