# Components

You can find components in `src/govuk/components`.

## Name your components

Generally, folder and file names should be singular, for example ‘accordion’, ‘backlink’, ‘button’. Only use plural names when the component is usually used in groups, for example ‘breadcrumbs’, ‘checkboxes’, ‘radios’.

## Structure your component folder

When creating your component, you should create the following files in the component’s folder:

- `README.md` - Summary documentation with links to the installation instructions and component documentation on <https://design-system.service.gov.uk/>
- `_[component-name].scss` - An SCSS file to generate the styles just for the component, importing the variables, functions and mixins from `../../base` and the styles of the component (`./index.scss`).
- `_index.scss` - The actual styles for the component, that can be imported either on their own by `[component-name].scss` or alongside other components in `components/_all.scss` (or by the consuming application)
- `[component-name].yaml` - Lists the options expected by the component, used for display in the documentation. It also contains the option samples used to generate the examples in the documentation, as well as the [fixtures for testing alternative implementations of the design system](https://frontend.design-system.service.gov.uk/testing-your-html/).
- `macro.njk` - The main entry point for rendering the component. It provides a `govuk[ComponentName](params)` macro, delegating render to the `template.njk` file
- `template.njk` - The template used for rendering the component using any `params` provided to the macro
- `template.test.js` - Tests to ensure the component renders as intended with its various options

If your component uses JavaScript, you must also create the following files in the component’s folder:

- `[component-name].mjs` - A JavaScript module with the implementation of any behaviour needed by the component. See the [JavaScript documentation]('./js.md#skeleton) for a skeleton and more details on that file's structure
- `[component-name].unit.test.mjs` - Unit tests to verify any lower-level logic used by the component individually
- `[component-name].test.js` - Functional tests to verify the behaviour of the whole component

## Building your components

If you need help building a component, [contact the Design System team](https://design-system.service.gov.uk/get-in-touch/) and we'll support you.

Learn more about styling components in our [CSS style guide](./css.md). Our [JavaScript style guide](./js.md) has more information on coding components.
