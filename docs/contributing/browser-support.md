# How we provide support for different browsers

Users can access government services through a wide range of new to older browsers. Our components provide a baseline experience through HTML and CSS, allowing all users to complete their tasks even if JavaScript is not working. Some components have JavaScript enhancements which add extra features or fix accessibility issues.

The Design System team needs to balance how we support older browsers using JavaScript enhancements due to:

- engineering - for example, if a browser has an outdated APIs
- end-users (larger file sizes to download and run due to extra code for using the old APIs, or replicating features from newer APIs)

From GOV.UK Frontend v5.0.0 onwards, Internet Explorer 11 will no longer run GOV.UK Frontend JavaScript and support is completely removed for Internet Explorer 8 to 10. Our CSS are still compatible with Internet Explorer 11.

## Browsers grades

You can view a summary of [the grades and the support we provide](https://frontend.design-system.service.gov.uk/browser-support/) on the GOV.UK Frontend site. To help manage the ever-growing number of browser versions, we group browsers into 4 grades:

- **grade A** - Most recent stable versions of Chrome, Firefox, Edge, Samsung Internet and Safari
- **grade B** - All stable versions of Chrome, Firefox and Edge released in the last 6 months and all the major stable releases of Safari which are not supported in Grade A
- **grade C** - [All browsers that support `<script type="module">`](https://caniuse.com/es6-module) (Chrome 61+, Edge 16-18, Edge 79+, Safari 11+, Firefox 60+, Opera 48+, Samsung Internet 8.2+)
- **grade X** - All other browsers (including IE11 and older)

> **Note: Only browsers in grades A, B and C will run our JavaScript enhancements. We will not support our JavaScript enhancements for older browsers in grade X.**

## Levels of support

We distinguish between two kinds of enhancements provided by our JavaScript components:

- Necessary enhancements - which users require to complete their task once JavaScript is running. For example, accessibility fixes such as the handling of keyboard events for role="button"
- Optional enhancements - which do not prevent users from using the component if they're absent or working more simply. For example, the ability to search within sections of an Accordion without opening them

## Necessary enhancements

We'll make sure necessary enhancements are available in all browsers running our JavaScript enhancements (Grades A, B and C). Wherever possible, we aim to provide the same baseline experience across these browsers.

## Optional enhancements

For all grade A and grade B browsers, we aim to provide the same baseline experience. One exception is enhancements that require vendor specific features. For example, `hidden="until-found"` which is only implemented in Chrome at the time of writing.

For grade C browsers, we aim to support optional enhancements as much as possible. However, we might sometimes need to adjust the component's behaviour, while still allowing the users to complete their task. This might include:

- falling back to the no-JavaScript experience
- disabling parts of the enhancement
- doing a simpler alternative

When deciding how much support we provide to grade C browsers using JavaScript enhancements, we'll take into account:

- what impact removing the enhancement will have on users and service teams
- whether there is wide usage of browser features used by our JavaScript enhancements - for example, we'll provide support if a large number of grade C browsers have features for specific enhancements
- whether the enhancement is important for certain types of user, for example, if the feature is an accessibility enhancement that benefits screen reader users
- the overhead of polyfilling and/or transpiling, in terms of the amount of extra JavaScript users need to download, or the effect it has on loading and runtime performance
- the engineering effort required, for the initial work and to maintain and support the enhancement or polyfill over time
- our confidence in our understanding of all of the previous points in this list

In instances where behaviour might differ in older browsers, we'll document those differences in the Design System. We'll also communicate any changes in our release notes.

## How we support browsers

Supporting a browser involves more than considering whether JavaScript enhancements run in them. It includes:

- the level of testing browsers will receive, such as
- manual testing during development and prior to releases
- using our automated test suites
- the support for JavaScript
- browsers downloading and parsing the script without errors
- necessary enhancements being available to users
- optional enhancements being available to users
- bug prioritisation

The following shows the level of support for the 3 grades of browsers (A, B and C) which run our JavaScript.

We've excluded Grade X browsers from the following information as we're not supporting enhancements for them and the prioritisation for bugs is 'will not fix'.

## Grade A

These browsers include the most recent stable versions of Chrome, Firefox, Edge, Samsung Internet and Safari.

For support we will:

- do regular manual testing
- do automated testing where possible
- make sure our JavaScript downloads and parses correctly
- make sure the necessary enhancements work
- only disable optional enhancements if a service needs a browser specific API
- give a high priority to fixing reported bugs

## Grade B

These browsers include all stable versions of Chrome, Firefox and Edge released in the last 6 months and the last 4 releases of Safari which are not supported in Grade A.

For support we will:

- only do manual testing as needed (old feature workaround or fallback, specific bugs)
- where possible, do automated testing on the oldest version
- make sure our JavaScript downloads and parses correctly
- make sure the necessary enhancements work
- only disable optional enhancements if a service needs a browser specific API
- give a lower priority to fixing reported bugs

## Grade C

This grade covers browsers not in Grade A or B which support <script type="module">. These are:

- Chrome 61+
- Edge 16-18
- Edge 79+
- Safari 11+
- Firefox 60+
- Opera 48+
- Samsung Internet 8.2+

Safari 10.1 (macOS) and Safari 10.3 (iOS) support `<script type="module">` but will 'exit early' as they does not support `HTMLScriptElement.prototype.noModule`, which is how we test support for `<script type="module">` from within our JavaScript. GOV.UK Frontend component JavaScript will not run in these versions.

For support we will:

- not provide manual testing
- not provide automated testing
- make sure our JavaScript downloads and parses correctly (also includes Safari 10.x)
- make sure the necessary enhancements work
- only disable optional enhancements based on impact of support
- not fix reported bugs

## How we rely on browser features

As browsers evolve, we'll use our browser support guidelines to decide whether or not to use a new browser feature.

We'll wait until all grade A and B browsers support a new feature before adopting it and consider if:

- it allows us to do something we can only do with this feature
- we include a polyfill or other fallback mechanism to provide equivalent features in at least grade A and B browsers

We'll also consider adopting a new feature if:

- all grade A browsers have shown an 'intent to ship' the feature
- the feature is included as part of the relevant specification

Where a feature is supported by all grade A and B browsers, we might also consider ways to  accommodate grade C browsers such as:

- transpiling
- including a polyfill
- including a fallback mechanism

Once a feature is supported by all grade A and B browsers, we might decide to remove or simplify any transpilation, polyfills or fallback mechanisms, polyfills or fallback mechanisms for grade C browsers as and when it becomes appropriate.
