# Component configuration

Configuration options allow developers to pass additional information into a component's JavaScript. This allows them to change how the component might work or appear without needing to create their own fork.

Configuration options can be configured using Nunjucks, HTML or JavaScript, but only JavaScript will use the options.

## Preparing the component's JavaScript

First, make sure the component class has a constructor parameter for passing in a configuration object.

```mjs
export class Accordion {
  constructor($root, config = {}) {
    // ...
  }
}
```

Within the entry class, you'll then create an object with the default configuration for the component. These are the options the component will use if no other options are provided.

```mjs
export class Accordion {
  static defaults = Object.freeze({
    rememberExpanded: true
  })
}
```

Next, use the `mergeConfigs` helper to combine the default config and the configuration object. The result of the merge is assigned globally (using `this`) so that it's accessible anywhere within the component's JavaScript.

The order in which variables are written defines their priority, with objects passed sooner being overwritten by those passed later. As we want the user's configuration to take precedence over our defaults, we list our default configuration object first.

There is no guarantee `config` will have any value at all, so we set the default to an empty object (`{}`) in the constructor parameters.

```mjs
import { mergeConfigs } from '../../common/index.mjs'

export class Accordion {
  constructor($root, config = {}) {
    this.config = mergeConfigs(
      Accordion.defaults,
      config
    )
  }
}
```

We can now reference the configuration option anywhere we need to in the component's JavaScript:

```js
this.config.rememberExpanded
// => true
```

It's now possible to individually initialise the component with configuration options.

```html
<script type="module">
  import { Accordion } from '{path-to-javascript}/govuk-frontend.min.js'

  const $element = document.getElementById('accordion')

  new Accordion($element, {
    rememberExpanded: false
  })
</script>
```

## Allowing options to be passed through the `initAll` function

Often, teams will not be individually initialising components. Instead, GOV.UK Frontend ships with an `initAll` function, which searches the page for instances of components and automatically initialises them.

In `packages/govuk-frontend/src/govuk/init.mjs`, update the component's `new` class to pass through a nested configuration object. The nested object should use the component's name converted to camelCase (for example, the 'Character Count' component becomes `characterCount`).

```js
new Accordion($accordion, config.accordion)
```

It's now possible to pass configuration options for your component, as well as multiple other components, using the `initAll` function.

```html
<script type="module">
  import { initAll } from '{path-to-javascript}/govuk-frontend.min.js'

  initAll({
    accordion: {
      rememberExpanded: false
    },
    characterCount: {
      threshold: 90
    }
  })
</script>
```

## Adding support for HTML `data-*` attributes

For convenience, we also allow for configuration options to be passed through HTML `data-*` attributes.

You can find `data-*` attributes in JavaScript by looking at an element's `dataset` property. Browsers will convert the attribute names from HTML's kebab-case to more JavaScript-friendly camelCase when working with `dataset`.

See ['Naming configuration options'](#naming-configuration-options) for exceptions to how names are transformed.

As we expect configuration-related `data-*` attributes to always be on the component's root element (the same element with the `data-module` attribute), we can access them all using `$root.dataset`.

Using the `mergeConfigs` call discussed earlier in this document, update it to include `$root.dataset` as the highest priority.

```mjs
import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

export class Accordion {
  constructor($root, config = {}) {
    this.config = mergeConfigs(
      Accordion.defaults,
      config,
      normaliseDataset(Accordion, $root.dataset)
    )
  }
}
```

Here, we pass the value of `$root.dataset` through our `normaliseDataset` function. This is because attribute values in dataset are always interpreted as strings. `normaliseDataset` looks at the component's configuration schema and converts values into numbers or booleans where needed.

Now, in our HTML, we could pass configuration options by using the kebab-case version of the option's name.

```html
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  data-remember-expanded="false">
  ...
</div>
```

However, this only works for developers who are writing raw HTML. We include Nunjucks macros for each component with GOV.UK Frontend to make development easier and faster, but this also makes it harder for developers to manually alter the raw HTML. We'll add a new parameter to Nunjucks to help them out.

### Adding a configuration schema

Components that accept configuration using `data-*` attributes also require a schema. This schema documents what parameters a configuration object may contain and what types of value they're expected to be.

Having a schema is required for the `normaliseDataset` function to work. A schema is also needed to use the `validateConfig` and `extractConfigByNamespace` functions we'll cover later on.

```mjs
export class Accordion {
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' },
      rememberExpanded: { type: 'boolean' }
    }
  })
}
```

### Validating a provided configuration against the schema

You can use the `validateConfig` function to ensure that a configuration object matches the schema format.

If it doesn't, you can return a `ConfigError`.

```mjs
import { mergeConfigs, validateConfig } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ConfigError } from '../../errors/index.mjs'

export class Accordion {
  constructor($root, config = {}) {
    this.config = mergeConfigs(
      Accordion.defaults,
      config,
      normaliseDataset(Accordion, $root.dataset)
    )

    // Check that the configuration provided is valid
    const errors = validateConfig(Accordion.schema, this.config)
    if (errors[0]) {
      throw new ConfigError(`Accordion: ${errors[0]}`)
    }
  }
}
```

## Adding a Nunjucks parameter

Most, but not all, components support adding arbitrary attributes and values through the `attributes` parameter. This method is also more verbose compared to having a dedicated Nunjucks parameter.

Using the previous bit of HTML, update it to make the `data-*` attribute changeable.

```nunjucks
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  {%- if params.rememberExpanded %} data-remember-expanded="{{ params.rememberExpanded | escape }}"{% endif %}>
  ...
</div>
```

The above code checks for the existence of the `rememberExpanded` parameter. If the parameter is present it adds the `data-remember-expanded` attribute. It then passes in the developer's defined value, running it through [Nunjucks' native `escape` filter](https://mozilla.github.io/nunjucks/templating.html#escape-aliased-as-e) to make sure that values can't break our HTML.

We can now call the Accordion's Nunjucks macro with our new `rememberExpanded` parameter:

```nunjucks
{% from "govuk/components/accordion/macro.njk" import govukAccordion %}

{{ govukAccordion({
  id: "accordion",
  rememberExpanded: false,
  items: [...]
}) }}
```

## Naming configuration options

### In JavaScript

Use camelCase to write the option in JavaScript.

If the option is a boolean option that accepts `true` or `false` as values, favour affirmative language when naming the option. This avoids the use of double-negatives to enable something. For example, `rememberExpanded: true` is easier to understand than `forgetExpanded: false`.

### In HTML

`data-*` attributes in HTML should use the same name as JavaScript, converted into kebab-case. This is because the `dataset` property in JavaScript automatically converts between these two formats.

> **Warning**: This automatic conversion does not happen for numbers, punctuation, or other non-Latin alphabet characters. For this reason, when you're naming configuration options, avoid using numbers or spell them out as words.

In our example, `rememberExpanded` becomes `data-remember-expanded`.

### In Nunjucks

Unlike the `data-*` attribute in HTML and our use of `dataset` in JavaScript, there is no intrinsic link between the Nunjucks parameter name and the names used elsewhere. The Nunjucks parameter can therefore be named differently, if convenient.

A common case is specifying whether a parameter accepts HTML or only plain text. For example, if a configuration option's value is inserted into the page using `innerText`, you might want to name the Nunjucks parameter something like `sectionLabelText` to indicate that HTML will not be parsed if provided.

There is more guidance on naming Nunjucks parameters in [the Nunjucks API documentation](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/nunjucks-api.md#naming-options).

## Namespacing configuration options

You can group configuration options in JavaScript and HTML together by using namespaces; period-separated strings that prefix the configuration option name. Namespaces follow the same formats as other option names, being camelCase in JavaScript and kebab-case in HTML.

These are most commonly used for translation strings, which are usually namespaced under `i18n` (short for 'internationalisation').

For example, we could namespace our `rememberExpanded` option under the `stateInfo` namespace. Our `data-*` attribute would now be named `data-state-info.remember-expanded` and accessed in the component's JavaScript using `this.config.stateInfo.rememberExpanded`.

The `extractConfigByNamespace` JavaScript helper can be used to create an object containing _only_ the configuration options that belong to a certain namespace.

```mjs
import { mergeConfigs, extractConfigByNamespace } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

export class Accordion {
  constructor($root, config = {}) {
    this.config = mergeConfigs(
      Accordion.defaults,
      config,
      normaliseDataset(Accordion, $root.dataset)
    )

    this.stateInfo = extractConfigByNamespace(Accordion, this.config, 'stateInfo');
  }
}
```
