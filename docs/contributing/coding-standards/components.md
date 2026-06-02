# Components

You can find components in `packages/govuk-frontend/src/govuk/components`.

## Name your components

Generally, folder and file names should be singular, for example ‘accordion’, ‘backlink’, ‘button’. Only use plural names when the component is usually used in groups, for example ‘breadcrumbs’, ‘checkboxes’, ‘radios’.

## Structure your component folder

When creating your component, you should create the following files in the component’s folder:

- `README.md` - Summary documentation with links to the installation instructions and component documentation on <https://design-system.service.gov.uk/>
- `_index.scss` - The main Sass entry point for the component. Generates the styles by including the mixin from the `_mixin.scss` file. You can include `_index.scss` [on its own](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-specific-parts-of-the-css), or [alongside other components in `components/_index.scss`](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-specific-parts-of-the-css)
- `_mixin.scss` - The actual styles for the component, contained within a mixin. The `_index.scss` file includes the mixin. You should not include the `_mixin.scss` file directly.
- `[component-name].yaml` - Lists the component's Nunjucks macro options and includes examples using these options. Both the options and examples are used to generate component documentation in the review app. The examples are also used to test component behaviour, and to generate [fixtures for testing alternative implementations of the design system](https://frontend.design-system.service.gov.uk/testing-your-html/).
- `macro.njk` - The main entry point for rendering the component. It provides a `govuk[ComponentName](params)` macro, delegating render to the `template.njk` file
- `template.njk` - The template used for rendering the component using any `params` provided to the macro
- `template.test.js` - Tests to ensure the component renders as intended with its various options

If your component uses JavaScript, you must also create the following files in the component’s folder:

- `[component-name].mjs` - A JavaScript module with the implementation of any behaviour needed by the component. See the [JavaScript documentation]('./js.md#skeleton) for a skeleton and more details on that file's structure
- `[component-name].unit.test.mjs` - Unit tests to verify any component-specific lower-level logic.
- `[component-name].test.js` - Functional tests to verify the behaviour of the whole component

In version 7 of GOV.UK Frontend, we'll remove support for `@import` in Sass. Before then, you must include the following files to continue supporting `@import`:

- `_[component-name].import.scss` - An import-only SCSS file to generate the styles for just this component. It delegates the CSS generation to the `_index.import.scss` file, and emits a warning that this usage is deprecated.
- `_index.import.scss` - An import-only SCSS file which generates the styles by including the mixin from the `_mixin.scss` file.

## Building your components

To help you build and initialise your own JavaScript components, GOV.UK Frontend provides some of its internal features for you to reuse. Follow our guidance on [building JavaScript components](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#building-your-own-javascript-components) to use these features.

Learn more about styling components in our [CSS style guide](./css.md). Our [JavaScript style guide](./js.md) has more information on coding components.

If you need help building a component, [contact the Design System team](https://design-system.service.gov.uk/contact/) and we'll support you.
