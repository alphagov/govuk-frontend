# Component configuration

Configuration options allow developers to pass additional information into a component's JavaScript. This allows them to change how the component might work or appear without needing to create their own fork.

Configuration options can be configured using Nunjucks, HTML or JavaScript, but only JavaScript will use the options.

For more information, see our [guidance on building configurable components](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#building-configurable-components).

## Preparing the component's JavaScript

If a component class needs configuration, [extend the `ConfigurableComponent` class](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/) that GOV.UK Frontend provides. This class accepts configuration from the following sources:

- [defaults defined as a `defaults` static property](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#setting-a-default-configuration-for-your-component) on the component’s class
- [configuration passed as second argument](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#receiving-configuration-during-initialisation) to the component’s constructor or [`createAll`](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#using-createall-with-your-components)
- [data attributes on the root element](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#receiving-configuration-from-data-attributes) of the component

Configuration options from these sources are merged into a single configuration object by the `ConfigurableComponent` class. Note that:

- configuration options passed to the constructor will override any defaults
- data attribute values have highest precedence and will override any configuration set elsewhere

Your component will then be able to:

[access the merged configuration](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#accessing-the-component-s-configuration) using `this.config`
use [the`Component` class](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#using-the-component-class) features

## Adding a Nunjucks parameter

Most, but not all, components support adding arbitrary attributes and values through the `attributes` parameter. This method is also more verbose compared to having a dedicated Nunjucks parameter to set data attributes on the root element. For example, this is how the Accordion does it for its `rememberExpanded` option:

```nunjucks
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  {%- if params.rememberExpanded %} data-remember-expanded="{{ params.rememberExpanded | escape }}"{% endif %}>
  ...
</div>
```

The above code checks for the existence of the `rememberExpanded` parameter. If the parameter is present it adds the `data-remember-expanded` attribute. It then passes in the developer's defined value, running it through [Nunjucks' native `escape` filter](https://mozilla.github.io/nunjucks/templating.html#escape-aliased-as-e) to make sure that values can't break our HTML.

With the previous code in the Accordion's template, this is how a page may set a specific value for the `rememberExpanded` option:

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

Unlike the `data-*` attribute in HTML, there is no intrinsic link between the Nunjucks parameter name and the names used elsewhere. The Nunjucks parameter can therefore be named differently, if convenient.

A common case is specifying whether a parameter accepts HTML or only plain text. For example, if a configuration option's value is inserted into the page using `innerText`, you might want to name the Nunjucks parameter something like `sectionLabelText` to indicate that HTML will not be parsed if provided.

There is more guidance on naming Nunjucks parameters in [the Nunjucks API documentation](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/nunjucks-api.md#naming-options).

## Namespacing configuration options

When passing configuration into your component's constructor, you can use nested objects to group options. For example, GOV.UK Frontend's translation strings are defined as an object named `i18n` (short for 'internationalisation'), as seen here with the Accordion:

```mjs
createAll(Accordion, {
  i18n: {
    hideAllSections: 'Hide all sections',
    hideSection: 'Hide',
    hideSectionAriaLabel: 'Hide this section',
    showAllSections: 'Show all sections',
    showSection: 'Show',
    showSectionAriaLabel: 'Show this section'
  },
  rememberExpanded: true
})
```

Data attributes only accept strings, but our [naming conventions for data attributes](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#receiving-configuration-from-data-attributes) allow you to set options in nested objects using a dot `.` separator for each level of nesting. For example `data-i18n.showSection="Show"` will set the same option as the following constructor argument:

```json
{
  i18n: {
    showSection: 'Show'
  }
}
```
