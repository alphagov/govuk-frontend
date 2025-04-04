# The 'rebrand' feature flag

While we work on the rebrand of GOV.UK Frontend, you can use the feature flag toggling system to help with sharing and visualising changes and testing rebranded components.

## How to use the UI

You can see the feature flag toggling UI at the top of most pages in the review app as a details element. It does not appear on component previews. When you open it, you'll see a form with a checkbox labelled 'rebrand feature flag on'. By checking this box and clicking 'submit', you'll reload the page. If you're looking at a page on the review app with components impacted by the rebrand eg: the header, you'll see the rebranded version of that component. Unchecking it and resubmitting the form will turn the feature flag off.

Additionally, when on a component landing page eg: '/components/header', you can click the link just under the feature flag form labelled 'show all flag states'. Clicking this will show two example iframes for each component example, one with the new brand and one with the old brand. Clicking the link again or navigating to a new page will turn this feature off.

## How it works

### Feature flags middleware

This feature is controlled by the app's feature flag middleware which does two things:

1. Upon making a post request to `/set-rebrand`, which the feature flag form does, the middleware sets a `use_rebrand` cookie and redirects back to the page the user was just on
2. Sets 3 local variables:

- `useRebrand` which is set based on the presence of either a `rebrandOverride` query parameter or the state of the `use_rebrand` cookie if the override param isn't present
- `ShowAllFlagStates` which is set based on the presence of a `showAllFlagStates` query parameter. The link under the feature flag form sets this parameter
- `exampleStates` which is either `[true, false]` if `showAllFlagStates` is `true`, else an array containing `useRebrand` as one item

These local variables are passed to the app views where they're used to display or not display rebranded states of things. `useRebrand` is also used by the main express app to automatically set the context of component examples so that if a given component has a `rebrand` param, its state is automatically set.

### How views are updated

The primary thing that `useRebrand` controls is adding the rebrand class (`govuk-template--rebranded`) to the review app's `htmlClasses` page template variable, added in `_generic.njk`.

Additionally, the examples macro uses `exampleStates` to control how many example iframes it shows and if they're rebranded or not. It does this by iterating over the array provided by `exampleStates`. If `showAllFlagStates` is `false`, then `exampleStates` is a single item which adheres to the state of `useRebrand`. If `showAllFlagStates` is `true`, then `exampleStates` is an array with two items, `true` and `false`, which will show both the old and new brand.

The iframes are controlled by passing `rebrandOverride={state}` to them where the override param takes precedence in setting `useRebrand` over the cookie.
