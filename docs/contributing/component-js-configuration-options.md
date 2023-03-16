# Adding JavaScript configuration options to components

Configuration options permit developers to pass additional information into a component's JavaScript, allowing them to change how the component might work or appear without needing to create their own fork.

Configuration options straddle the line between Nunjucks, HTML and JavaScript.

## Preparing the component's JavaScript

First, ensure the entry function for component has a parameter for passing in a configuration object.

```javascript
function Accordion ($module, config) {
  ...
}
```

Within the entry function, you'll then create an object with the default configuration for the component. These are what options will be used if no other options have been provided.

```javascript
var defaultConfig = {
  rememberExpanded: true
}
```

Next, use the `mergeConfigs` helper to combine the default config and the configuration object. This is assigned globally (using `this`) so that it's accessible anywhere within the component's JavaScript.

The order that variables are written defines their priority, with objects passed sooner being overwritten by those passed later. As we want the user's configuration to take precedence over our defaults, we list our default configuration object first.

We also do a little safety check here. There is no guarantee that `config` will have any value at all, in which case it'll be `undefined`. We use an OR operator (`||`) to quickly check if this is the case and, if so, we use an empty object instead.

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

It's now possible to individually initialising the component with configuration options.

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

It's now possible to pass configuration options for your component, as well as multiple other components, via the `initAll` function.

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

For convenience, we allow for configuration options to be passed through HTML `data-*` attributes too.

`data-*` attributes can be found in JavaScript by looking at an element's `dataset` property. Browsers will helpfully convert the attribute names from HTML's kebab-case to more JavaScript-friendly camelCase when working with `dataset`. See ['Naming configuration options'](#naming-configuration-options) for caveats.

As we expect configuration-related `data-*` attributes to always be on the component's root element (the same element with the `data-module` attribute), we can access them all quickly using `$module.dataset`.

Let's update our `mergeConfigs` call from earlier to include `$module.dataset` as the highest priority.

```javascript
import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

this.config = mergeConfigs(
  defaultConfig,
  config || {},
  normaliseDataset($module.dataset)
)
```

Here, we pass it through our `normaliseDataset` function. This is because attribute values in dataset are always interpreted as being strings. `normaliseDataset` runs a few simple checks to convert values back to numbers or booleans where appropriate.

Now, in our HTML, we could pass configuration options by using the kebab-case version of the option's name.

```html
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  data-remember-expanded="false">
  ...
</div>
```

However, this only works for developers who are writing raw HTML. We include Nunjucks macros for each component with GOV.UK Frontend to make development easier and faster, but this also makes it harder for developers to manually alter the raw HTML. We'll need to add a new parameter to Nunjucks to help them out.

## Adding a Nunjucks parameter

Although most components support adding arbitrary attributes and values via the `attributes` parameter, not all of them do. This method is also more verbose compared to having a dedicated Nunjucks parameter.

Let's update our previous bit of HTML to make the `data-*` attribute changeable.

```nunjucks
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  {%- if params.rememberExpanded %} data-remember-expanded="{{ params.rememberExpanded | escape }}"{% endif %}>
  ...
</div>
```

The above checks for the existence of the `rememberExpanded` parameter and adds the `data-remember-expanded` attribute if it's present. It then passes in the developer's defined value, running it through [Nunjucks' native `escape` filter](https://mozilla.github.io/nunjucks/templating.html#escape-aliased-as-e) to ensure that values can't break our HTML.

We can now call the Accordion's Nunjucks macro with our new `rememberExpanded` parameter:

```nunjucks
{% from "govuk/components/accordion/macro.njk" import govukAccordion %}

{{ govukAccordion({
  id: "accordion",
  rememberExpanded: false,
  items: [...]
}) }}
```

And that's pretty much it!

## Naming configuration options

### In JavaScript

The option in JavaScript should be written in camelCase.

If the option is a boolean option that accepts `true` or `false` as values, favour affirmative language when naming the option. This avoids the use of double-negatives being used to enable something. For example, `rememberExpanded: true` is easier to understand than `forgetExpanded: false`.

### In HTML

`data-*` attributes in HTML should use the same name as JavaScript, converted into kebab-case. This is because the `dataset` property in JavaScript automatically converts between these two formats for us.

> **Warning**: This automatic conversion doesn't happen for numbers, punctuation, or other non-Latin alphabet characters. For this reason, avoid using numbers, or spell them out as words instead, when naming configuration options.

In our example, `rememberExpanded` becomes `data-remember-expanded`.

### In Nunjucks

Unlike the `data-*` attribute in HTML and our use of `dataset` in JavaScript, there is no intrinsic link between the Nunjucks parameter name and the names used elsewhere. The Nunjucks parameter can therefore be named different, if convenient.

A common case is specifying whether a parameter accepts HTML or only plain text. For example, if a configuration option's value is inserted into the page using `innerText`, you might want to name the Nunjucks parameter something like `sectionLabelText` to indicate that HTML won't be rendered.

There is more guidance on naming Nunjucks parameters in [the Nunjucks API documentation](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/nunjucks-api.md#naming-options).

## Namespacing configuration options

Configuration options in JavaScript and HTML can be grouped together by using namespaces; period-separated strings that prefix the configuration option name. Namespaces follow the same formats as other option names, being camelCase in JavaScript and kebab-case in HTML.

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
