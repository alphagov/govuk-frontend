# Components

You can find components in `packages/govuk-frontend/src/govuk/components`.

## Naming convention

Generally, folder and file names should be singular, such as `accordion`, `backlink`, or `button`. Use plural names only when the component is typically used in groups, such as `breadcrumbs`, `checkboxes`, or `radios`.

## Structuring your component folder

When creating a component, you should include the following files in the component’s folder:

- **`README.md`**: Summary documentation with links to installation instructions and component documentation on [https://design-system.service.gov.uk/](https://design-system.service.gov.uk/).
- **`_[component-name].scss`**: An SCSS file to generate styles specific to this component. It delegates CSS generation to the `_index.scss` file.
- **`_index.scss`**: The actual styles for the component, which can be imported in two ways:
  - [Individually using `[component-name].scss`](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-specific-parts-of-the-css).
  - [Alongside other components in `components/_index.scss`](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-specific-parts-of-the-css).
- **`[component-name].yaml`**: Lists the component's Nunjucks macro options and includes examples demonstrating these options. Both the options and examples are used to generate component documentation in the review app. The examples are also used to test component behavior and to generate [fixtures for testing alternative implementations of the design system](https://frontend.design-system.service.gov.uk/testing-your-html/).
- **`macro.njk`**: The main entry point for rendering the component. It provides a `govuk[ComponentName](params)` macro, delegating rendering to the `template.njk` file.
- **`template.njk`**: The template used for rendering the component based on the `params` provided to the macro.
- **`template.test.js`**: Tests to ensure the component renders correctly with its various options.

If your component uses JavaScript, you must also include the following files in the component’s folder:

- **`[component-name].mjs`**: A JavaScript module containing the implementation of any behavior required by the component. Refer to the [JavaScript documentation](./js.md#skeleton) for a skeleton and more details on the file's structure.
- **`[component-name].unit.test.mjs`**: Unit tests to verify any component-specific, lower-level logic.
- **`[component-name].test.js`**: Functional tests to verify the behavior of the entire component.

> **Note:** For convenience, you can automatically generate the basic structure of a component, including all the necessary files, using the code generator. See the [Component code generation section](#component-code-generation) for details.

## Building your components

To assist you in building and initializing your own JavaScript components, GOV.UK Frontend provides some of its internal features for reuse. Follow our guidance on [building JavaScript components](https://frontend.design-system.service.gov.uk/building-your-own-javascript-components/#building-your-own-javascript-components) to utilize these features.

For more information on styling components, refer to our [CSS style guide](./css.md). Additionally, our [JavaScript style guide](./js.md) provides further details on coding components.

If you need assistance building a component, [contact the Design System team](https://design-system.service.gov.uk/get-in-touch/), and we’ll be happy to support you.

## Component code generation

Installing code generator dependencies:

```sh
npm run codegen:install
```

Generating a component:

```sh
npm run codegen:component
```
