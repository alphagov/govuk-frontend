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

## 2. Check your changes in the ‘review app’

In your project folder, run `npm start`, then go to [http://localhost:3000/]([http://localhost:3000/]) in your browser to open the 'review app'.

Check that:

- the examples in the review app look right and behave correctly with your changes
- your design is consistent with the rest of GOV.UK Frontend

### Add an example

You should add an example to the review app if the existing examples do not reflect the changes you've made.

1. Open `src/govuk/components/<COMPONENT>/<COMPONENT>.yaml`, where `<COMPONENT>` is the component you've changed.
2. Add or update examples in the `examples` list.

If you've created a new component, create a new `src/govuk/<COMPONENT>/<COMPONENT>.yaml` file instead, where `<COMPONENT>` is the name of the component you've created.

## 3. Test in supported browsers and assistive technology

You should test that your contribution works:

- in [recommended browsers](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices#browsers-to-test-in)
- with [recommended assistive technologies](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies#what-to-test)
- in [Internet Explorer 8](/docs/installation/supporting-internet-explorer-8.md), 9 and 10 - components do not need to look perfect
- when your users [override colours in Windows, Firefox and Chrome](https://accessibility.blog.gov.uk/2018/08/01/supporting-users-who-change-colours-on-gov-uk/)

## 4. Run the automated tests

In your project folder, run `npm test` to run the automated tests, including linting.

If a test fails, you should check your code for any errors, then update any tests you need to.

## 5. Write new tests

You should write new tests if you’ve created a new component, or changed the way a component works by:

- changing or adding to the component's JavaScript code
- changing or adding to the component's Nunjucks macro
- creating or updating a Sass mixin or function

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

## 6. Update the snapshot tests

If your component uses another component, one of the [Jest snapshot tests](https://jestjs.io/docs/en/snapshot-testing) may fail. Snapshot tests compare a component's current markup with a previously stored version.

If a snapshot test fails, follow these steps.

1. Check that the component's new markup is correct.
2. Run `npm test -- -u src/govuk/components/<COMPONENT>` to update the snapshot test with the new markup.
3. Commit the updated file in the `/src/govuk/components/<COMPONENT>/__snapshots__/` folder.
4. In the commit message, tell us you're updating the snapshot file and why.

Where `<COMPONENT>` is the name of the component you've changed.

## 7. Tell us what you’ve tested and checked

When you create the pull request for your contributions, list what you’ve tested and checked in the pull request description.

If your contribution changes how a component looks, include before and after screenshots if you can.

### If GitHub shows the build failed

1. At the bottom of your pull request in GitHub, find the line that says **Build Failed**.
2. Select **Details**.
3. Under **Build Failed**, select **The build**.
4. Wait for the build log to appear.
5. Use the information in the build log to find the problem and fix your code.
