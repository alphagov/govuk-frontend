# Adding JavaScript configuration options to components

Configuration options allow developers to pass additional information into a component's JavaScript. This allows them to change how the component might work or appear without needing to create their own fork.

Configuration options can be configured using Nunjucks, HTML or JavaScript, but only JavaScript will use the options.

## Preparing the component's JavaScript

First, make sure the entry function for the component has a parameter for passing in a configuration object.

```javascript
function Accordion ($module, config) {
  ...
}
```

Within the entry function, you'll then create an object with the default configuration for the component. These are the options the component will use if no other options are provided.

```javascript
var defaultConfig = {
  rememberExpanded: true
}
```

Next, use the `mergeConfigs` helper to combine the default config and the configuration object. The result of the merge is assigned globally (using `this`) so that it's accessible anywhere within the component's JavaScript.

The order in which variables are written defines their priority, with objects passed sooner being overwritten by those passed later. As we want the user's configuration to take precedence over our defaults, we list our default configuration object first.

There is no guarantee `config` will have any value at all, so it'll be `undefined`. We use an OR operator (`||`) as a safety check. If the value is `undefined`, we use an empty object instead.

```javascript
import { mergeConfigs } from '../../common/index.mjs'

this.config = mergeConfigs(
  defaultConfig,
  config || {}
)
```

We can now reference the configuration option anywhere we need to in the component's JavaScript:

```javascript
this.config.rememberExpanded
// => true
```

It's now possible to individually initialise the component with configuration options.

```html
<script>
  var $accordion = document.getElementById("accordion")
  new window.GOVUKFrontend.Accordion($accordion, {
    rememberExpanded: false
  }).init()
</script>
```

## Allowing options to be passed through the `initAll` function

Usually, teams will not be individually initialising components. Instead, GOV.UK Frontend ships with an `initAll` function, which searches the page for instances of components and automatically initialises them.

In `src/govuk/all.mjs`, update the component's `new` function to pass through a nested configuration object. The nested object should use the component's name converted to camelCase (for example, the 'Character Count' component becomes `characterCount`).

```javascript
new Accordion($accordion, config.accordion).init()
```

It's now possible to pass configuration options for your component, as well as multiple other components, using the `initAll` function.

```html
<script>
  window.GOVUKFrontend.initAll({
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

You can find `data-*` attributes in JavaScript by looking at an element's `dataset` property. Browsers will convert the attribute names from HTML's kebab-case to more JavaScript-friendly camelCase when working with `dataset`. See ['Naming configuration options'](#naming-configuration-options) for exceptions.

As we expect configuration-related `data-*` attributes to always be on the component's root element (the same element with the `data-module` attribute), we can access them all using `$module.dataset`.

Using the `mergeConfigs` call discussed earlier in this document, update it to include `$module.dataset` as the highest priority.

```javascript
import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

this.config = mergeConfigs(
  defaultConfig,
  config || {},
  normaliseDataset($module.dataset)
)
```

Here, we pass the value of `$module.dataset` through our `normaliseDataset` function. This is because attribute values in dataset are always interpreted as strings. `normaliseDataset` runs a few simple checks to convert values back to numbers or booleans where appropriate.

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

A common case is specifying whether a parameter accepts HTML or only plain text. For example, if a configuration option's value is inserted into the page using `innerText`, you might want to name the Nunjucks parameter something like `sectionLabelText` to indicate that HTML will not be rendered.

There is more guidance on naming Nunjucks parameters in [the Nunjucks API documentation](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/nunjucks-api.md#naming-options).

## Namespacing configuration options

You can group configuration options in JavaScript and HTML together by using namespaces; period-separated strings that prefix the configuration option name. Namespaces follow the same formats as other option names, being camelCase in JavaScript and kebab-case in HTML.

These are most commonly used for translation strings, which are usually namespaced under `i18n` (for 'internationalisation').

For example, we could namespace our `rememberExpanded` option under the `stateInfo` namespace. Our `data-*` attribute would now be named `data-state-info.remember-expanded` and accessed in the component's JavaScript using `this.config.stateInfo.rememberExpanded`.

The `extractConfigByNamespace` JavaScript helper can be used to create an object containing _only_ the configuration options that belong to a certain namespace.

```javascript
this.config = mergeConfigs(
  defaultConfig,
  config || {},
  normaliseDataset($module.dataset)
)

this.stateInfo = extractConfigByNamespace(this.config, 'stateInfo');
```
