# Test your GOV.UK Frontend contribution

Before you submit your contribution to GOV.UK Frontend, you should:

- fix any CSS or JavaScript style errors
- check your changes look right and behave correctly
- test your changes in supported browsers and assistive technology
- run the automated tests
- update the tests or add new tests if you need to

Let us know in your pull request or [contact us](https://design-system.service.gov.uk/#support) if:

- you cannot do some of the checks or tests
- your contribution might affect other parts of GOV.UK Frontend

## 1. Fix any CSS or JavaScript style errors

In your project folder, run `npm test`.

Fix any CSS or JavaScript style errors that the linting tests report.

## 2. Fix any invalid HTML

To make sure your HTML markup is valid, [check your page with W3C's markup validator](https://validator.w3.org/).

You should also check your HTML markup is valid after JavaScript has modified it. To make sure, [check your page with W3C's 'Check serialized DOM of current page’ bookmarklet](https://validator.w3.org/nu/about.html#extras).

You should use the bookmarklet if:

- your page has a lot of JavaScript
- you can only check your page when you've logged in to a site

If you can, fix any errors or warnings reported by either the validator or bookmarklet.

You do not need to fix any [known issues with our components](https://github.com/alphagov/govuk-frontend/issues/1280#issuecomment-509588851) reported by either the validator or bookmarklet.

If you need help with fixing an error or a warning, leave a note in your pull request or [contact the Design System team](https://design-system.service.gov.uk/#support).

## 3. Check your changes in the ‘review app’

In your project folder, run `npm start`, then go to [http://localhost:3000/]([http://localhost:3000/]) in your browser to open the 'review app'.

Check that:

- the examples in the review app look right and behave correctly with your changes
- your design is consistent with the rest of GOV.UK Frontend

### Add an example

You should add an example to the review app if the existing examples do not reflect the changes you've made.

1. Open `src/govuk/components/<COMPONENT>/<COMPONENT>.yaml`, where `<COMPONENT>` is the component you've changed.
2. Add or update examples in the `examples` list.

If you've created a new component, create a new `src/govuk/<COMPONENT>/<COMPONENT>.yaml` file instead, where `<COMPONENT>` is the name of the component you've created.

## 4. Test in supported browsers and assistive technology

You should test that your contribution works:

- in [Internet Explorer 8](https://frontend.design-system.service.gov.uk/supporting-ie8/), 9 and 10 - components do not need to look perfect
- in [recommended browsers](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices#browsers-to-test-in), including when you [resize text](/docs/contributing/resize-text-in-browsers.md)
- when your users [override colours in Windows, Firefox and Chrome](https://accessibility.blog.gov.uk/2018/08/01/supporting-users-who-change-colours-on-gov-uk/)
- with [recommended assistive technologies](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies#what-to-test)

## 5. Run the automated tests

In your project folder, run `npm test` to run the automated tests, including linting.

If a test fails, you should check your code for any errors, then update any tests you need to.

## 6. Write new tests

You should write new tests if you’ve created a new component, or changed the way a component works by:

- changing or adding to the component's JavaScript code
- changing or adding to the component's Nunjucks macro
- creating or updating a Sass mixin or function

Test files use examples from each component’s `.yaml` file, for example `src/govuk/components/button/button.yaml`. When you add or update tests, you can use the existing examples or add new ones.

Use `hidden: true` in a new example if you do not want to include the example in the review app. The example will still appear in our [test fixtures](http://frontend.design-system.service.gov.uk/testing-your-html/).

### If you created a component

Create the following files in the `src/govuk/components` folder:

- `<COMPONENT>/<COMPONENT>.test.js` - to test functionality if the component uses JavaScript
- `<COMPONENT>/template.test.js` - to test the Nunjucks macro

Where `<COMPONENT>` is the name of the component you created.

You can use the existing files in the `src/govuk/components` folder as templates for your new files.

### If you changed or added to a component

In the `src/govuk/components` folder, update or add tests to:

- `<COMPONENT>/<COMPONENT>.test.js` - if you updated functionality
- `<COMPONENT>/template.test.js` - if you updated the Nunjucks macro

Where `<COMPONENT>` is the name of the component you changed or added to.

### If you created or updated a Sass mixin or function

Update or add tests in the `.test.js` file that matches the name of the `.scss` file you created or updated. Create the `.test.js` file if it does not exist.

For example, if you updated a mixin in `src/govuk/helpers/_colour.scss`, update or add tests in `src/govuk/helpers/_colour.test.js`.

## 7. Update the snapshot tests

If your component uses another component, one of the [Jest snapshot tests](https://jestjs.io/docs/en/snapshot-testing) may fail. Snapshot tests compare a component's current markup with a previously stored version.

If a snapshot test fails, follow these steps.

1. Check that the component's new markup is correct.
2. Run `npm test -- -u src/govuk/components/<COMPONENT>` to update the snapshot test with the new markup.
3. Commit the updated file in the `/src/govuk/components/<COMPONENT>/__snapshots__/` folder.
4. In the commit message, tell us you're updating the snapshot file and why.

Where `<COMPONENT>` is the name of the component you've changed.

## 8. Test that your changes work in the GOV.UK Design System (optional)

To make sure your changes work in the Design System, use `npm link` to test before publishing, as follows:

```bash
cd ../govuk-design-system
git checkout main
git pull
npm install # note running `npm install` after `npm link` will destroy the link.
npm link ../govuk-frontend/package/
 ```

When you've finished testing, run this command to unlink the package:

```bash
npm unlink ../govuk-frontend/package/
```

## 9. Tell us what you’ve tested and checked

When you create the pull request for your contributions, list what you’ve tested and checked in the pull request description.

If your contribution changes how a component looks, include before and after screenshots if you can.

### If GitHub shows that some checks were not successful

At the bottom of your pull request in GitHub, find the checks marked as **Failing**.

For each failing check, select 'Details' and use the build log to find the problem and fix your code.
