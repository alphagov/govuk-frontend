# How we provide support for different browsers

Users can access government services through a wide range of new to older browsers. Our components provide a baseline experience through HTML and CSS, allowing all users to complete their tasks even if JavaScript is not working. Some components have JavaScript enhancements which add extra features or fix accessibility issues.

The Design System team needs to balance how we support older browsers using JavaScript enhancements due to:

- engineering - for example, if a browser has an outdated APIs
- end-users (larger file sizes to download and run due to extra code for using the old APIs, or replicating features from newer APIs)

## Browsers grades

You can view [a summary of the grades and the support we provide on the GOV.UK Frontend site](https://release-5-0--govuk-frontend-docs-preview.netlify.app/browser-support/). To help manage the ever-growing number of browser versions, we group browsers into 4 grades:

- **grade A** - Most recent stable versions of Chrome, Firefox, Edge, Samsung Internet and Safari
- **grade B** - All stable versions of Chrome, Firefox and Edge released in the last 6 months and the last 4 major stable releases of Safari which are not supported in Grade A
- **grade C** - [All browsers that support <script type="module">](https://caniuse.com/es6-module) (Chrome 61+, Edge 16-18, Edge 79+, Safari 10.1+ (mac), Firefox 60+, Opera 48+, Safari 10.3+ (iOS), Samsung Internet 8.2+)
- **grade X** - All other browsers (including IE11 and older)

> **Note: Only browsers in grades A, B and C will run our JavaScript enhancements. We will not support our JavaScript enhancements for older browsers in grade X.**

## Levels of support

We distinguish between two kinds of enhancements provided by our JavaScript components:

- Necessary enhancements - which users require to complete their task once JavaScript is running. For example, accessibility fixes such as the handling of keyboard events for role=”button”
- Optional enhancements - which do not prevent users from using the component if they’re absent or working more simply. For example, the ability to search within sections of an Accordion without opening them

## Necessary enhancements

We will make sure necessary enhancements are available in all browsers running our JavaScript enhancements (Grades A, B and C). Wherever possible, we aim to provide the same baseline experience across these browsers.

## Optional enhancements

For all grade A and grade B browsers, we aim to provide the same baseline experience. One exception is enhancements that require vendor specific features. For example, `hidden="until-found"` which is only implemented in Chrome at the time of writing.

For grade C browsers, we aim to support optional enhancements as much as possible. However, we might sometimes need to adjust the component’s behaviour, while still allowing the users to complete their task. This might include:

- falling back to the no-JavaScript experience
- disabling parts of the enhancement
- doing a simpler alternative

When deciding how much support we provide to grade C browsers using Javascript enhancements, we will take into account:

- what impact removing the enhancement will have on users and service teams
- whether there is wide usage of browser features used by our Javascript enhancements - for example, we'll provide support if a large number of grade C browsers have features for specific enhancements
- whether the enhancement is important for certain types of user, for example, if the feature is an accessibility enhancement that benefits screen reader users
- the overhead of polyfilling and/or transpiling, in terms of the amount of extra JavaScript users need to download, or the effect it has on loading and runtime performance
- the engineering effort required, for the initial work and to maintain and support the enhancement or polyfill over time
- our confidence in our understanding of all of the previous points in this list

Where behaviour might differ in older browsers, we will document those differences in the Design System. We will also communicate any changes in our release notes.

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

This table shows the level of support for the 3 grades of browsers (A, B and C) which run our JavaScript.

We’ve excluded Grade X browsers from this table as we’re not supporting enhancements for them and the prioritisation for bugs is ‘will not fix’.

<table>
  <tbody>
    <tr>
      <td></td>
      <td>
        <p>grade A</p>
      </td>
      <td>
        <p>grade B</p>
      </td>
      <td>
        <p>grade C</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>Browsers</p>
      </td>
      <td valign="top">
        <p>Most recent stable versions of Chrome, Firefox, Edge, Samsung Internet and Safari</p>
      </td>
      <td valign="top">
        <p>All stable versions of Chrome, Firefox and Edge released in the last 6 months</p>
        <p></p>
        <p>Versions of Safari listed in the Service Manual</p>
      </td>
      <td valign="top">
        <p><a href="https://www.google.com/url?q=https://caniuse.com/es6-module&sa=D&source=editors&ust=1698171017326021&usg=AOvVaw1Q_pKufv4pMgLmqabJEoLX" >All browsers that support &lt;script nomodule&gt;</a></p>
        <ul>
          <li>Chrome 61+</li>
          <li>Edge 16-18</li>
          <li>Edge 79+</li>
          <li>Safari 11+ (mac)</li>
          <li>Firefox 60+</li>
          <li>Opera 48+</li>
        </ul>
        <ul>
          <li>Safari 10.3+ (iOS)</li>
          <li>Samsung Internet 8.2+</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <p>Manual testing</p>
      </td>
      <td>
        <p>Regular</p>
      </td>
      <td>
        <p>If needed (old feature workaround or fallback, specific bugs)</p>
      </td>
      <td>
        <p>No</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>Automated testing</p>
      </td>
      <td>
        <p><span>W<span>here possible</p>
      </td>
      <td>
        <p>Oldest version – where possible</p>
      </td>
      <td>
        <p>No</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>JavaScript downloads and parses</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
      <td>
        <p>Yes</p>
      </td>
      <td>
        <p>Yes (also includes Safari 10.x)</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>Necessary enhancements</p>
      </td>
      <td>
        <p>Work</p>
      </td>
      <td>
        <p>Work</p>
      </td>
      <td>
        <p>Work</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>Optional enhancements</p>
      </td>
      <td>
        <p>Disabled only if needing a browser specific API</p>
      </td>
      <td>
        <p>Disabled only if needing a browser specific API</p>
      </td>
      <td>
        <p>Disabled based on impact of support</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>Relative priority of reported bugs</p>
      </td>
      <td>
        <p>High</p>
      </td>
      <td>
        <p>Low</p>
      </td>
      <td>
        <p>Will not fix</p>
      </td>
    </tr>
  </tbody>
</table>

## How we rely on browser features

As browsers evolve, we’ll use our browser support guidelines to decide whether or not to use a new browser feature.

We’ll wait until all grade A and B browsers support a new feature before adopting it and consider if:

- it allows us to do something we can only do with this feature
- we include a polyfill or other fallback mechanism to provide equivalent features in at least grade A and B browsers

We’ll also consider adopting a new feature if:

- all grade A browsers have shown an 'intent to ship' the feature
- the feature is included as part of the relevant specification

Where a feature is supported by all grade A and B browsers, we might also consider transpiling, including a polyfill or a fallback mechanism for grade C browsers.

Once a feature is supported by all grade A and B browsers, we might decide to remove or simplify any transpilation, polyfills or fallback mechanisms, polyfills or fallback mechanisms for grade C browsers as and when it becomes appropriate.
