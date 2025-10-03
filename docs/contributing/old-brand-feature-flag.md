# The ' old brand' feature flag

While we continue to work on the rebrand of GOV.UK Frontend, you can use the feature flag toggling system to help with:

- sharing and visualising changes
- testing rebranded components

## How to use the UI

You can see the feature flag toggling UI at the top of most pages in the review app as a Details element. It does not appear on component previews. When you open the toggling UI, you'll see a form with a checkbox labelled 'Use the old brand'. By checking this box and clicking **Submit**, you'll reload the page. If you're looking at a page on the review app with components impacted by the rebrand, such as the header, you'll see the old brand version of that component. Unchecking the box and resubmitting the form will turn the feature flag off.

Additionally, when on a component landing page, such as '/components/header', you can select the link just under the feature flag form labelled 'show all flag states'. You will then see two example iframes for each component example, one with the new brand and one with the old brand. You can turn this feature off by selecting the link again or navigating to a new page.

## Things that change when the old brand feature flag is on

When the feature flag is turned on, the primary change is that the HTML class `govuk-template--rebranded` is removed from the HTML tag of templates. This impacts the styling of the following components:

- header
- footer
- service navigation
- cookie banner

This will also automatically update the logo in the header component and add the crown to the footer component.

## How it works

### Feature flags middleware

This feature is controlled by the app's feature flag middleware.

1. When the feature flag form makes a post request to `/unset-rebrand`, the middleware sets a `use_old_brand` cookie and redirects the user back to the page they were just on.
2. The middleware sets 3 local variables:

- `useRebrand`, which is set based on the presence of either a `rebrandOverride` query parameter or the state of the `use_old_brand` cookie if the override parameter is not present. It is `true` by default
- `ShowAllFlagStates`, which is set based on the presence of a `showAllFlagStates` query parameter - the link under the feature flag form sets this parameter
- `exampleStates` which is either `[true, false]` if `showAllFlagStates` is `true`, or an array containing `useRebrand` as one item

These local variables are passed to the app views, where they're used to display or not display rebranded states of things. `useRebrand` is also used by the main express app to automatically set the context of component examples so that if a given component has a `rebrand` param, its state is automatically set.

### How views are updated

The primary thing that `useRebrand` controls is adding the rebrand class (`govuk-template--rebranded`) to the review app's `htmlClasses` page template variable, added in `_generic.njk`.

Additionally, the examples macro uses `exampleStates` to control how many example iframes it shows and if they're rebranded or not. It does this by iterating over the array provided by `exampleStates`. If `showAllFlagStates` is `false`, then `exampleStates` is a single item which adheres to the state of `useRebrand`. If `showAllFlagStates` is `true`, then `exampleStates` is an array with two items, `true` and `false`, which will show both the old and new brand.

The iframes are controlled by passing `rebrandOverride={state}` to them, where the override parameter takes precedence in setting `useRebrand` over the cookie.
