# Changelog

## Unreleased

###  Inputmode

Adds the ability to pass an optional [inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) into the input component

```javascript
govukInput({
  inputmode: 'email'
})
```

- [Pull request #1527: Adding inputmode to input component](https://github.com/alphagov/govuk-frontend/pull/1527)


### Fixes

- [Pull request #1512: Update components to only output items when they are defined](https://github.com/alphagov/govuk-frontend/pull/1512).

## 3.0.0 (Breaking release)

### Breaking changes
You must make the following changes when you migrate to this release, or your service may break.

#### Update file paths, attributes and class names
To make sure GOV.UK Frontend's files do not conflict with your code, we've moved our package files into a directory called `govuk`.

##### If you’re using Sass

Add `govuk/` after `govuk-frontend/` to `@import` paths in your [Sass](https://sass-lang.com/) file.

For example:

```scss
@import "node_modules/govuk-frontend/govuk/all";
```
If you’ve [added `node_modules/govuk-frontend` as a Sass include path](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#optional-resolving-scss-import-paths), add `govuk/` to your `@import` paths:

```scss
@import "govuk/all";
```

#####  If you’re using Javascript

You must do the following.

1. Update file paths.
2. Update and add `data-module` attributes.
3. Update CSS class names.

###### Update file paths

You must add `govuk/` to your import paths.

If you're importing `node_modules/govuk-frontend/all.js`, change this import path to `node_modules/govuk-frontend/govuk/all.js`.

If you’re importing a specific path, add `govuk/` after `govuk-frontend/`. For example, if you're importing the button component:

```nunjucks
import Button from 'govuk-frontend/govuk/components/button/button'
```

###### Update and add data-module attributes

You do not need to do anything if you're using Nunjucks macros and the [`initAll`](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#option-1-include-javascript) function.

If you are not using Nunjucks macros, add a `govuk-` prefix to `data-module` attribute values. For example:

```html
<div class="govuk-accordion" data-module="govuk-accordion">
...
</div>
```

The [button](https://design-system.service.gov.uk/components/button/) and [details](https://design-system.service.gov.uk/components/details/) components now also use the `data-module` attribute for initialisation. If you are not using Nunjucks macros, add:

- `data-module="govuk-button"` to each `<button>` HTML tag
- `data-module="govuk-details"` to each `<details>` HTML tag

If you're using your own JavaScript code to initialise components, add a `govuk-` prefix to any selectors that find components using the `data-module` attribute.

[Pull request #1443: Ensure GOV.UK Frontend component selectors cannot conflict when initialised](https://github.com/alphagov/govuk-frontend/pull/1443)

###### Update CSS class names

You do not need to do anything if you're using Nunjucks.

If you're using HTML or custom JavaScript, change:

- `js-character-count` to `govuk-js-character-count`
- `js-header-toggle` in the GOV.UK Frontend header component to `govuk-js-header-toggle`

[Pull request #1444: Renames `js-` css prefix to `govuk-js-`](https://github.com/alphagov/govuk-frontend/pull/1444)

##### If you’re using Nunjucks

1. Change the list of paths in `nunjucks.configure` so that the only GOV.UK Frontend path is `node_modules/govuk-frontend/`:

```nunjucks
nunjucks.configure([
  "node_modules/govuk-frontend/"
])
```

2. If you've extended the [page template](https://design-system.service.gov.uk/styles/page-template/), add `govuk/` to the template path:

```nunjucks
{% extends "govuk/template.njk" %}
```

3. Change the import paths in your components so they include `govuk/components/`. For example:

```nunjucks
{% from "govuk/components/breadcrumbs/macro.njk" import govukBreadcrumbs %}
```

##### Update asset paths

In the assets path, add `govuk/` after `govuk-frontend/`:

`/node_modules/govuk-frontend/govuk/assets`

If your code uses Express.js, you must also use the following code in your configuration file:

```javascript
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')))
```
Pull requests:

- [#1458: Namespace nunjucks and components](https://github.com/alphagov/govuk-frontend/pull/1458)
- [#1467: Update the main entry point in package.json](https://github.com/alphagov/govuk-frontend/pull/1467)

#### Migrate to the new accessible focus states

The focus state of components now meets the new WCAG 2.1 level AA requirements.

You must [update your component’s focus state](https://design-system.service.gov.uk/get-started/focus-states/) to make your design consistent with our new focus styles.

If you've extended or created components, you can no longer use the `govuk-focusable` or `govuk-focusable-fill` Sass mixins.

If you're using `govuk-focusable`, you must remove it. There’s no direct replacement, so you must [use our Sass variables to make your components consistent](https://design-system.service.gov.uk/get-started/focus-states/#make-other-focusable-elements-accessible) with GOV.UK Frontend.

If you're using `govuk-focusable-fill`, include the `govuk-focused-text` mixin inside your component's `:focus` selector. For example:

```scss
.app-component:focus {
  @include govuk-focused-text;
}
```

Pull requests:

- [#1309: Update links (and things that look like links) to use the new focus style](https://github.com/alphagov/govuk-frontend/pull/1309)
- [#1312: Update form inputs focus to comply with WCAG 2.1](https://github.com/alphagov/govuk-frontend/pull/1312)
- [#1313: Add new focus style to buttons](https://github.com/alphagov/govuk-frontend/pull/1315)
- [#1321: Update footer links to use new focus style](https://github.com/alphagov/govuk-frontend/pull/1321)
- [#1324: Update accordion to use new WCAG 2.1 compliant focus style](https://github.com/alphagov/govuk-frontend/pull/1324)
- [#1326: Update tabs component to WCAG 2.1 compliant focus style](https://github.com/alphagov/govuk-frontend/pull/1326)
- [#1361: Remove `govuk-focusable`, `govuk-focusable-fill` mixins, introduce `govuk-focus-text` mixin](https://github.com/alphagov/govuk-frontend/pull/1361)


#### Update colours

You can now use the following new colour variables that we've added to the [colour palette](https://design-system.service.gov.uk/styles/colour#main-colours):

- dark-blue
- dark-grey
- mid-grey
- light-grey

5 Sass colour variables no longer exist. Replace the following colour variables if you're using Sass:

Colour variable removed|Suggested replacement
| --- | --- |
bright-red|red
grey-1|dark-grey
grey-2|mid-grey
grey-3|light-grey
grey-4|light-grey

You should check the [contrast ratio of your colours](https://design-system.service.gov.uk/styles/colour#colour-contrast).

If you're not using Sass, change the values of the following colours:

Colour name|Old value|Replace with
| --- | --- | --- |
purple|#2e358b|#4c2c92
red|#b10e1e|#d4351c
yellow|#ffbf47|#ffdd00
green|#006435|#00703c
grey-2|#bfc1c3|#b1b4b6
grey-3|#dee0e2|#f3f2f1
grey-4|#f8f8f8|#f3f2f1
light-blue|#2b8cc4|#5694ca
blue|#005ea5|#1d70b8
bright-red|#df3034|#d4351c

We've also changed the background of the following components:

- buttons - `green` instead of a custom green
- confirmation panels - `green` instead of `turquoise`
- links in their hover state - `dark-blue` instead of `light-blue`

If you're using legacy projects like GOV.UK Elements, you can keep your current colours by [turning on compatibility mode](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/compatibility.md).

Read our [blog post about why we changed the colour palette](https://designnotes.blog.gov.uk/2019/07/29/weve-updated-the-gov-uk-colours-and-font/)

[Pull request #1288: Update colour palette](https://github.com/alphagov/govuk-frontend/pull/1288).

#### Check the new version of the font

The size and baseline of the Design System's font are now more consistent with other fonts. Text now aligns vertically in text boxes without you needing to adjust it.

If you've extended or created components, you should check that your text is still vertically aligned correctly.

If you're using GOV.UK Frontend and [GOV.UK Template](https://github.com/alphagov/govuk_template), you can [turn on compatibility mode](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/compatibility.md) to keep using the font from GOV.UK Template.

Pull requests:

- [#1434: Update font to use v2 of GOV.UK Transport font](https://github.com/alphagov/govuk-frontend/pull/1434)
- [#1441: Removing font style adjustments](https://github.com/alphagov/govuk-frontend/pull/1441)

#### Update links from error summary components to radios and checkboxes

If you've linked from an error summary component to the first input in a [radios](https://design-system.service.gov.uk/components/radios/) or [checkboxes](https://design-system.service.gov.uk/components/checkboxes/) component, the link will no longer work.

This is because the `id` of the first input no longer has the suffix `-1`.

If there are links back to radios or checkboxes components in your error summary component, remove `-1` from the end of the `href` attribute.

[Pull request #1426: Make radios and checkboxes components easier to link to from error summary](https://github.com/alphagov/govuk-frontend/pull/1426)

#### Update the markup for tabs

You do not need to do anything if you're using Nunjucks macros.

If you are not using Nunjucks macros, remove the `govuk-tabs__tab--selected` class from the first tab's link, then add the `govuk-tabs__list-item--selected` class to that link's parent list item.

For example:

```html
<li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
  <a class="govuk-tabs__tab" href="#tab1">
    Tab 1
  </a>
</li>
```

[Pull request #1496: Update the focus state for tabs](https://github.com/alphagov/govuk-frontend/pull/1443)

#### Update start button icon

[Start buttons](https://design-system.service.gov.uk/components/button/#start-buttons) have a new icon. Your start buttons will lose their current icons unless you replace the old icon with the new one.

If you're using Nunjucks:

- set the `isStartButton` option to `true`
- remove the `.govuk-button--start` class

For example:

```javascript
govukButton({
  text: "Start now",
  href: "#",
  isStartButton: true
})
```

If you're using HTML, add the SVG code from the [start button example in the Design System](https://design-system.service.gov.uk/components/button/#start-buttons).

[Pull request #1341: Add new start button icon](https://github.com/alphagov/govuk-frontend/pull/1341)

#### Adjust text alignment in tables

Text now aligns to the top of table cells. If you've used a different alignment in a table, you should use your own CSS styles to keep the alignment the same.

For example, to align text in the centre:

```scss
.app-table--vertical-align-middle .govuk-table__header,
.app-table--vertical-align-middle .govuk-table__cell {
  vertical-align: middle;
  ...
}
```

[Pull request #1345: Set 'vertical-align:top' positioning on table headers and cells](https://github.com/alphagov/govuk-frontend/pull/1345)

#### Replace Sass mixins in grids

If you're using the `@govuk-grid-column` Sass mixin to create custom grid classes, you must remove the `$class` parameter.

If you're passing a class name, put the mixin inside your selector. For example:

```scss
.your-class-name {
  @include govuk-grid-column(...)
}
```

You can no longer use the `govuk-grid-row` mixin. You can replace it with the `.govuk-grid-row` class in your HTML.

You must also replace calls to the `grid-width` mixin with calls to the `govuk-grid-width` mixin.

Pull requests:

- [#1376: Remove $class param from @govuk-grid-column mixin](https://github.com/alphagov/govuk-frontend/pull/1376)
- [#1342: Remove grid-width mixin](https://github.com/alphagov/govuk-frontend/pull/1342)
- [#1343: Removes govuk-grid-row mixin](https://github.com/alphagov/govuk-frontend/pull/1343)

#### Rename the border width variable

If you use Sass and you’ve extended or created components that use the border width variable, rename `$govuk-border-width-mobile` to `$govuk-border-width-narrow`.

[Pull request #1287: Rename border-width-mobile to reflect how it's used](https://github.com/alphagov/govuk-frontend/pull/1287)

### New features

#### Add attributes to table headings

You can now add attributes like classes, rowspan and colspan to table row headers.

[Pull request #1367: Allow for classes, rowspan, colspan and attributes on row headers](https://github.com/alphagov/govuk-frontend/pull/1367). Thanks to [edwardhorsford](https://github.com/edwardhorsford).


#### Use page wrapper auto spacing

You can now add the `.govuk-main-wrapper--auto-spacing` modifier class to your `<main>` element to add responsive padding to the top and bottom of the page.

This will add the correct amount of padding depending on if there are elements above the `<main>` element inside the `govuk-width-container` wrapper. Elements above the `<main>` element could include a back link or breadcrumb component.

If you need to control the spacing manually, use the `.govuk-main-wrapper--l` modifier instead.

The `govuk-main-wrapper` and `govuk-main-wrapper--l` Sass mixins are now deprecated. [Contact us](https://design-system.service.gov.uk/get-in-touch/) if you need to continue using these mixins.

[Pull request #1493: Add automatic vertical spacing modifier for main wrapper](https://github.com/alphagov/govuk-frontend/pull/1493)

#### GDS Transport now falls back to Arial in Internet Explorer 8 (IE8)

IE8 will now use Arial instead of GDS Transport.

This is because IE8 requires a very large Embedded Open Type (.eot) font file for external fonts. Arial will take less time to render for IE8 users, who are likely to be on older computers.

[Pull request #1434: Update font to use v2 of GOV.UK Transport font](https://github.com/alphagov/govuk-frontend/pull/1434). Thanks to [@Nooshu](https://github.com/Nooshu).

### Fixes

- [Pull request #1310: The border on error summaries is now the correct width on mobile.
GOV.UK Template's focused link colour no longer overrides GOV.UK Frontend](https://github.com/alphagov/govuk-frontend/pull/1310).
- [Pull request #1316: Checkboxes and radios no longer have a transparent outline - because it's no longer needed to fix custom focus state colours](https://github.com/alphagov/govuk-frontend/pull/1316).
- [Pull request #1324: There’s no longer an outline when a user focuses an accordion element in Firefox](https://github.com/alphagov/govuk-frontend/pull/1324).
- [Pull request #1330: We've changed the spacing around lists in tabs on mobile and with JavasScript disabled, so they're consistent with other lists](https://github.com/alphagov/govuk-frontend/pull/1330).
- [Pull request #1351: You can now use HTML elements in the labels for tabs](https://github.com/alphagov/govuk-frontend/pull/1351).
- [Pull request #1353: Example HTML code in the Design System now has correct indenting](https://github.com/alphagov/govuk-frontend/pull/1353).
- [Pull request #1368: We’ve clarified how you should use `productName` and `serviceName` in the header component](https://github.com/alphagov/govuk-frontend/pull/1368) - thanks to [@edwardhorsford](https://github.com/edwardhorsford).
- [Pull request #1359: Users can now use the Tab key to highlight tabs in IE8](https://github.com/alphagov/govuk-frontend/pull/1359).
- [Pull request #1370: Each submit button on a page now has its own double-click timer, so clicking one button will not disable the other buttons](https://github.com/alphagov/govuk-frontend/pull/1370).
- [Pull request #1381: You can now import the Sass settings files without needing to import the other settings first](https://github.com/alphagov/govuk-frontend/pull/1381).
- [Pull request #1442: Character count components are now hidden to assistive technologies when they're not visible](https://github.com/alphagov/govuk-frontend/pull/1442).
- [Pull request #1434: The underline below links no longer sits too far down in Firefox](https://github.com/alphagov/govuk-frontend/pull/1434).
- [Pull request #1435: When a user resubmits a form, the error summary is now correctly focused instead of the form](https://github.com/alphagov/govuk-frontend/pull/1435).
- [Pull request #1473: We’ve removed icon-arrow-left.png and icon-important.png, because they were not used in GOV.UK Frontend](https://github.com/alphagov/govuk-frontend/pull/1473)
- [Pull request #1497: Users can now conditionally reveal content on pages with multiple grouped radios](https://github.com/alphagov/govuk-frontend/pull/1497) - thanks to [@colinrotherham](https://github.com/colinrotherham) and [@frankieroberto](https://github.com/frankieroberto) for their help.

## 2.13.0

🆕 New features

- You can now override the visually hidden 'Support links' text in the footer by
setting `meta.visuallyHiddenTitle`.

  ([Pull request #1387](https://github.com/alphagov/govuk-frontend/pull/1387))

🔧 Fixes

- Secondary buttons and warning buttons now have the correct background colour
when they're disabled.

  ([Pull request #1392](https://github.com/alphagov/govuk-frontend/pull/1392))

- The crown logo image in the header now:
  - has height and width attributes set
  - aligns better with 'GOV.UK' in IE8

  ([Pull request #1419](https://github.com/alphagov/govuk-frontend/pull/1419))

## 2.12.0

🆕 New features:

- Support custom attributes on summary list action links

  You can now use the `attributes` macro option to add additional HTML attributes to summary list action links.

  ([PR #1372](https://github.com/alphagov/govuk-frontend/pull/1372))

- Support aria-describedby on all form fields

  All form fields now support an initial `aria-describedby` value, populated before the optional hint and error message IDs are appended.

  Useful when fields are described by errors or hints on parent fieldsets.

  ([PR #1347](https://github.com/alphagov/govuk-frontend/pull/1347))

🔧 Fixes:

- Update colour for MHCLG

  Fixes the brand colour for MHCLG to their correct corporate "green" brand.

  ([PR #1319](https://github.com/alphagov/govuk-frontend/pull/1319))

- Remove deprecated `@else-if` statement, replace with `@else if`

  ([PR #1333](https://github.com/alphagov/govuk-frontend/pull/1333))

- Prevent the fallback PNG image for the crown in the header from being
  downloaded unnecessarily in Internet Explorer and Edge.

  ([PR #1337](https://github.com/alphagov/govuk-frontend/pull/1337))

## 2.11.0 (Feature release)

🆕 New features:

- Add new secondary and warning button variants

  ([PR #1207](https://github.com/alphagov/govuk-frontend/pull/1207))

- Add new govuk-shade and govuk-tint functions for creating shades and tints of
  colours.

  ([PR #1207](https://github.com/alphagov/govuk-frontend/pull/1207))

- Add support for custom row classes on the summary list component (including support for some rows without action links)

  ([PR #1259](https://github.com/alphagov/govuk-frontend/pull/1259))

- Ensure fieldset never exceeds max-width

  This fix ensures that both WebKit/Blink and Firefox are prevented from expanding their fieldset widths to the content's minimum size.

  This was preventing `max-width: 100%` from being applied to select menus inside a fieldset.

  See discussion in ["Reset your fieldset"](https://thatemil.com/blog/2015/01/03/reset-your-fieldset/) and raised by [issue #1264](https://github.com/alphagov/govuk-frontend/issues/1264)

  ([PR #1269](https://github.com/alphagov/govuk-frontend/pull/1269))

🔧 Fixes:

- Add various fixes to the summary list component:

  1. Fixes the 1px row height change when borders are removed
  Padding is now adjusted by 1px instead

  2. Fixes the text alignment when the actions column isn't added
  So the key column always stays at 30% width

  ([PR #1259](https://github.com/alphagov/govuk-frontend/pull/1259))

## 2.10.0 (Feature release)

🆕 New features:

- Add smaller versions of radio buttons and checkboxes

  Thanks to [@owenm6](https://github.com/owenm6) for their help and support on this one.

  ([PR #1125](https://github.com/alphagov/govuk-frontend/pull/1125))

🔧 Fixes:

- Prevent duplicate checkbox aria-describedby

  Addresses an edge case where a checkbox with a hint (but without a fieldset) is output with duplicate `aria-describeby` attributes. Fixes issue [#1248](https://github.com/alphagov/govuk-frontend/pull/1248).

  Thanks to [@colinrotherham](https://github.com/colinrotherham) for fixing this issue.

  ([PR #1265](https://github.com/alphagov/govuk-frontend/pull/1265))

## 2.9.0 (Feature release)

🆕 New features:

- Add classes to action items in the summary list component

  ([PR #1233](https://github.com/alphagov/govuk-frontend/pull/1233))

- Allow initAll to be scoped to a specific part of a page

  See ["Initialise GOV.UK Frontend in only certain sections of a page"](docs/installation/installing-with-npm.md#initialise-govuk-frontend-in-only-certain-sections-of-a-page) for more information.

  ([PR #1216](https://github.com/alphagov/govuk-frontend/pull/1216))

🔧 Fixes:

- Fix tabs bullet point character encoding issue when not enhanced

  Thanks [Ed Horsford](https://github.com/edwardhorsford) and [Steve Sims](https://github.com/stevesims) for their help on this one.

  ([PR #1247](https://github.com/alphagov/govuk-frontend/pull/1247))

- Update padding of govuk-main-wrapper

  This increases the padding of `govuk-main-wrapper` (on tablet and above) to be more inline with GOV.UK. When updating, your pages will have 10px more white space above and below the 'main' content area.

  ([PR #1073](https://github.com/alphagov/govuk-frontend/pull/1073))

- Remove error-summary dependence on document.onload

  ([PR #1215](https://github.com/alphagov/govuk-frontend/pull/1215))

- Ensure font is not loaded twice on slow networks

  This is only an issue for users that are using alphagov/govuk_template alongside GOV.UK Frontend.

  ([PR #1242](https://github.com/alphagov/govuk-frontend/pull/1242))

## 2.8.0 (Feature release)

### Considerations for fixed components such as modals

We have been made aware that the [change to force scroll bars to appear at all times](https://github.com/alphagov/govuk-frontend/pull/1230) can change the behaviour of some components such as modals.

If you're using your own components that rely on the overflow state of the document (such as modals) you should make sure you test those components when updating to this version.

🆕 New features:

- Enable `pattern` attribute for input

  You can now set the `pattern` attribute on input fields using the component
  macros:

  ```js
  {{ govukInput({
    name: "example",
    pattern: "[0-9]*"
  }) }}
  ```

  As well as `pattern`, custom attributes can also be added on day/month/year
  inputs (e.g. `data-example`) shown below:

  ```js
  {{ govukDateInput({
    items: [
      {
        pattern: "[0-9]*",
        attributes: {
          "data-example": "value"
        }
      }
    ]
  }) }}
  ```

  ([PR #1172](https://github.com/alphagov/govuk-frontend/pull/1172))

- Prevent horizontal jump as scrollbars appear

  As content vertical height grows (e.g. autocomplete results appear), browsers
  may add scroll bars causing the page to jump horizontally in position.

  To avoid this, re-introduce fix from GOV.UK Template:
  https://github.com/alphagov/govuk-frontend/issues/1204

  ([PR #1230](https://github.com/alphagov/govuk-frontend/pull/1230))


- Accommodate camera notches on new devices (iPhone X, Google Pixel 3 etc)

  On newer devices with "camera notches", browsers reserve a safe area in
  landscape orientation (known as pillarboxing) so content isn't obscured.

  To avoid this, support has been added for `viewport-fit=cover` as shown here:
  https://webkit.org/blog/7929/designing-websites-for-iphone-x/

  ([PR #1176](https://github.com/alphagov/govuk-frontend/pull/1176))


- Prefix error messages with a visually hidden "Error:", to make it clearer to
  users of assistive technologies

  ([PR #1221](https://github.com/alphagov/govuk-frontend/pull/1221))


- Prevent accidental multiple submissions of forms

  If a user double clicks a submit button in a form, we debounce this event and
  ignore the second click.

  HTML data attribute:

  ```html
  <button class="govuk-button" data-prevent-double-click="true">
    Submit
  </button>
  ```

  Nunjucks macro:

  ```js
  {{ govukButton({
    text: "Submit",
    preventDoubleClick: true
  }) }}
  ```

  ([PR #1018](https://github.com/alphagov/govuk-frontend/pull/1018))


🔧 Fixes:

- Ensure that files within the core, objects and overrides layers can be
  imported individually

  Unlike components, the files within these layers did not previously import
  their dependencies (for example, most of them require the govuk-exports mixin
  but did not import it).

  We've also added tests to ensure that files within these layers can be
  imported and rendered to CSS without erroring, which should catch this in the
  future.

  Thanks to [Alasdair McLeay](https://github.com/penx) for originally raising a
  PR to fix this.

  ([PR #1235](https://github.com/alphagov/govuk-frontend/pull/1235))


- Ensure inset component does not misalign nested components

  Thanks to [Paul Hayes](https://github.com/fofr) for raising this issue.

  ([PR #1232](https://github.com/alphagov/govuk-frontend/pull/1232))


- Improve word wrapping in summary list component

  Thanks to [Edward Horsford](https://github.com/edwardhorsford) and [Lee Kowalkowski](https://github.com/leekowalkowski-hmrc) for their help on this one.

  Also thanks to [Malcolm Butler](https://github.com/MoJ-Longbeard) for exploring a [previous version of this fix](https://github.com/alphagov/govuk-frontend/pull/1185).

  ([PR #1220](https://github.com/alphagov/govuk-frontend/pull/1220))


## 2.7.0 (Feature release)

🆕 New features:

- Added config file for prototype kit.

  Added a configuration file for an experimental feature in Prototype kit to allow departments to use their own frontend alongside govuk-frontend

  Thanks @matcarey (HMRC) for this contribution

  ([PR #1102](https://github.com/alphagov/govuk-frontend/pull/1102))

- Disable incorrect iOS/Edge text size adjustments

  To cater for non-responsive websites, iOS and Edge automatically increase font sizes (iOS in landscape, Edge in portrait on HiDPI displays).

  Since we have already considered typography at these device sizes, this feature is now turned off.

  ([PR #1178](https://github.com/alphagov/govuk-frontend/pull/1178))

🔧 Fixes:

- Fix wrapping of long lines of text in summary list

  Thanks to [@MoJ-Longbeard](https://github.com/MoJ-Longbeard) for raising the issue.

  ([PR #1169](https://github.com/alphagov/govuk-frontend/pull/1169))

## 2.6.0 (Feature release)

🆕 New features:

- Enable `autocomplete` attributes for input components.

  You can now set the `autocomplete` attribute on input, date input and textarea components using the component macros.

  This was already possible to do with the `attributes` option but this change highlights the new WCAG 2.1 success criteria [Identify Input Purpose](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html) which "is to ensure that the purpose of a form input collecting information about the user can be programmatically determined, so that user agents can extract and present this purpose to users using different modalities".

  See [autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill) for the full list of attributes that can be used.

  ([PR #1146](https://github.com/alphagov/govuk-frontend/pull/1146))

🔧 Fixes:

- Include Accordion component in global namespace

  Accordion component was not exported and was therefore unavailable in global namespace

  ([PR #1157](https://github.com/alphagov/govuk-frontend/pull/1157))

- Fix Checkboxes and Radios targeting selectors outside it's scope

  Thanks to [@andysellick](https://github.com/andysellick) and [@bilbof](https://github.com/bilbof) for helping us with this issue.

  ([PR #1156](https://github.com/alphagov/govuk-frontend/pull/1156))

- Fixes styling of the accordion component when there is no JavaScript or it has been turned off

  Thanks @dankmitchell for reporting this issue ([#1130](https://github.com/alphagov/govuk-frontend/issues/1130))

  ([PR #1149](https://github.com/alphagov/govuk-frontend/pull/1149))

- Remove hover state for accordion sections on mobile

  ([PR #1148](https://github.com/alphagov/govuk-frontend/pull/1148))

- Fix container not being centered in IE8

  Since the header and the footer component use this container it also fixes centering for these components.

  ([PR #1147](https://github.com/alphagov/govuk-frontend/pull/1147))

- Make gutters in the header consistent with the grid

  This means that the header will now line up with the grid.

  Thanks to @edwardhorsford for raising this issue.

  ([PR #1144](https://github.com/alphagov/govuk-frontend/pull/1144))

## 2.5.1 (Fix release)

🔧 Fixes:

- Update summary list to simplify actions

  Only output actions in a list when there's multiple actions.

  ([PR #1131](https://github.com/alphagov/govuk-frontend/pull/1131))

## 2.5.0 (Feature release)

🆕 New features:

- Accordion component 🎉

  Contributed by @frankieroberto, as well as @injms, @hannalaakso, @joelanman and others.

  The accordion component lets users show and hide sections of related content on a page.

  For more information see [guidance](https://design-system.service.gov.uk/components/accordion/).

  ([PR #958](https://github.com/alphagov/govuk-frontend/pull/958))

- Add desktop specific grid column widths

  This allow you to define different grid behaviour for the tablet and desktop
  breakpoints. For example, you can make a column two-thirds on desktop but
  expand to full-width on smaller tablet sized screens.

  ([PR #1094](https://github.com/alphagov/govuk-frontend/pull/1094))

- Add summary list component

  This component was initially developed to allow us to build the
  'check your answers' pattern.

  It is mostly the same as in the original pattern with some notable differences:

  - On smaller screens it wraps by default
  - It's possible to have multiple actions

  ([PR #1065](https://github.com/alphagov/govuk-frontend/pull/1065))

🔧 Fixes:

- Update visually hidden class to fix ordering issue in VoiceOver OSX

  We have fixed an issue in VoiceOver OSX where using the `govuk-visually-hidden` class in links would result in the text being announced out of order.

  We also now recommend to use aria-label or aria-labelledby where appropriate.

  Thanks to @stevenaproctor and the accessibility team at HMRC for letting us know about this issue.

  ([PR #1109](https://github.com/alphagov/govuk-frontend/pull/1109))

- Improve rendering in older Internet Explorer

  Added a meta tag to ensure that older IE versions always render with the correct rendering engine

  ([PR #1119](https://github.com/alphagov/govuk-frontend/pull/1119))

## 2.4.1 (fix release)

🔧 Fixes:

- Remove unused hint, error message and label imports from the Character Count
  component

  ([PR #1087](https://github.com/alphagov/govuk-frontend/pull/1087))

- Warning text component, remove negative margin left and reduce padding left to match.

  ([PR #1084](https://github.com/alphagov/govuk-frontend/pull/1084))

- Add 5px bottom margin to list items within lists that do not have bullets or
  numbers on mobile breakpoints to make each item visually distinct.

  ([PR #1078](https://github.com/alphagov/govuk-frontend/pull/1078))

- Add error message attributes to all components

  ([PR #1086](https://github.com/alphagov/govuk-frontend/pull/1086))

## 2.4.0 (Feature release)

🆕 New features:

- Scroll to label or legend when linked from error summary

  When users click links in the error summary, the corresponding label or legend
  will now be moved to the top of the viewport, rather than the input. This
  means that the context for the input remains on-screen.

  ([PR #1056](https://github.com/alphagov/govuk-frontend/pull/1056))

- Label or legend are announced for NVDA users when navigating to an input from
  the error summary

  ([PR #1056](https://github.com/alphagov/govuk-frontend/pull/1056))

- Allow form group classes on date, file upload, input, select and textarea

  All remaining form groups should allow additional classes, like with radios and checkboxes

  ([PR #1059](https://github.com/alphagov/govuk-frontend/pull/1059))

🔧 Fixes:

- Remove implicit dependency on Element for classList

  ([PR #1063](https://github.com/alphagov/govuk-frontend/pull/1063))

- Single field with error should have 'aria-describeby' attribute

  Although we discourage using checkboxes without fieldsets, this fix
  ensures that if there are no fieldset then the aria-describeby will
  still be usable by screenreaders by adding the element ids to the checkbox
  input elements 'aria-describeby' attribute.

  ([PR #1054](https://github.com/alphagov/govuk-frontend/pull/1054))

## 2.3.0 (Feature release)

🆕 New features:

- Add important parameter to visually hidden sass mixins

  Optional parameter added to `govuk-visually-hidden` and `govuk-visually-hidden-focusable` mixins (defaults to true)

  ([PR #1037](https://github.com/alphagov/govuk-frontend/pull/1037))

- Add support for attributes on table cells

  Can now use the familiar `attrubutes: {}` pattern to add various
  attributes such as `id` or `data-attr` to cells within tables

  ([PR #1045](https://github.com/alphagov/govuk-frontend/pull/1045))

- Allow form group classes on radios and checkboxes

  We now provide a way to add classes to the radio and checkbox form-group wrapper

  ([PR #1043](https://github.com/alphagov/govuk-frontend/pull/1043))

🔧 Fixes:

- Fix anchor links in tabs component panels

  ([PR #1031](https://github.com/alphagov/govuk-frontend/pull/1031))

- Fix IE8 support in builds in the `dist/` folder

  ([PR #1035](https://github.com/alphagov/govuk-frontend/pull/1035))

## 2.2.0 (Feature release)

🆕 New features:

- Allow classes on table header and row cells

  Optional classes attribute can now be used on table header and row cell item
  in the Nunjucks macro

  ([PR #1015](https://github.com/alphagov/govuk-frontend/pull/1015))

- Add character count component

  ([PR #959](https://github.com/alphagov/govuk-frontend/pull/959))


🔧 Fixes:

- Apply max-width to the `<select>` element

  The `<select>` element's width is governed by the widths of its `<option>`'s.

  When the text in the options grows large, the element can grow to > 100% of the width of its container and break the layout.

  ([PR #1013](https://github.com/alphagov/govuk-frontend/pull/1013))

- Prevent product name in header from wrapping

  Currently the product name in the header wraps when the space shrinks which doesn't look great.

  Adding `display: inline-table` prevents that so that the product name as a whole drops to a new line when space is shrunk.

  ([PR #1007](https://github.com/alphagov/govuk-frontend/pull/1007))

- Set text colour for radios divider

  ([PR 1023](https://github.com/alphagov/govuk-frontend/pull/1023))

- Stop links styled as button from being dragged

  Moving the mouse over a link while its button is depressed causes the
  browser’s dragging behaviour to trigger (and prevents the `click`
  event from firing). This is contrary to how actual `<button>` elements
  work. This pull request makes the behaviour of links styled as buttons
  consistent with that of buttons.

  ([PR #1020](https://github.com/alphagov/govuk-frontend/pull/1020))

## 2.1.0 (Feature release)

🆕 New features:

- Allow additional 'meta' content in the footer

  You can now pass additional 'meta' content (as `meta.html` or `meta.text`)
  which will appear below any meta links, above the OGL license. This is ideal
  for, for example, the 'Built by Department Name' colophon.

  ([PR #990](https://github.com/alphagov/govuk-frontend/pull/990))

- Allow attributes to be added to some child items in header, footer, breadcrumbs, tabs and error-summary components

  You can now pass additional attributes to links in header, footer, breadcrumbs, tabs and error-summary components

  ([PR #993](https://github.com/alphagov/govuk-frontend/pull/993))

- Fix issue with conditional form content and inline form controls

  When inline variant of form controls is used with conditional content, we force
  it to display block. This is to avoid breaking and confusing styling as it is
  a combination we don't recommend.

  ([PR #970](https://github.com/alphagov/govuk-frontend/pull/970))

- Add component options (arguments) as `macro-options.json` to `package`

  We want to be able to expose these options to GOV.UK Design System. This change includes them as `yaml` in `src/components` and adds a build step to transform them to `JSON` and copy them to `package/components`. It also adds a test to check if the copied files are valid JSON and contain expected attributes.

  ([PR #998](https://github.com/alphagov/govuk-frontend/pull/998))

🔧 Fixes:

- Fix mobile menu button submitting parent forms

  The menu `<button>` didn’t have an explicit `type` set, which meant that it
  defaulted to `type=“submit”`.

  This meant that if the header was inside a form (as it is in the Design System
  examples, but we can imagine other scenarios where this would be the case)
  clicking the menu button would submit the form.

  In most cases this would also cause the page to reload, which closes the menu.

  ([PR #994](https://github.com/alphagov/govuk-frontend/pull/994))

- Fix flash of unstyled content in tabs component

  ([PR #1000](https://github.com/alphagov/govuk-frontend/pull/1000))

- Add 48px favicon

  Microsoft recommends including at least a 48x48px favicon.

  ([PR #986](https://github.com/alphagov/govuk-frontend/pull/986))

- Update `browsersList` in `package.json` to reflect our supported browsers

  `browsersList` is used by PostCSS in our current build to determine which browser prefixes or rules to generate for the built CSS files. This PR adds rules to specify that the browsers in our [browser matrix](https://github.com/alphagov/govuk-frontend#browser-support) should always be prefixed for. Additionally, any browser with more than 0.1% of the global market share is prefixed for.

  In terms of changes to our built CSS, this means that `-webkit-box-sizing` and `-webkit-box-shadow` prefixes will be removed - neither of these prefixes are required by desktop Safari 5.1 or later so this seems a fairly safe change to make.

  ([PR #1002](https://github.com/alphagov/govuk-frontend/pull/1002))

## 2.0.0 (Breaking change)

💥 Breaking changes:

- Set panel component's title heading level to 1 as default

  We think the panel title should be the h1 in the majority of cases, so we made
  it the default.

  If you have need to change the Panel component heading to something other than
  h1, you can do so by specifying `headingLevel: <number>` in the Nunjucks
  macro.

  ([PR #967](https://github.com/alphagov/govuk-frontend/pull/967))

- Remove deprecated `govuk-visually-hidden-focussable` class name

  In 1.1 release we added a new, correctly spelt
  `govuk-visually-hidden-focusable` CSS class and marked the old one as
  deprecated.

  To migrate you need to change `govuk-visually-hidden-focussable` to
  `govuk-visually-hidden-focusable` in your codebase.

  ([PR #968](https://github.com/alphagov/govuk-frontend/pull/968))

- Remove name-based width logic from date-input component

  In [1.1 release](https://github.com/alphagov/govuk-frontend/pull/857/files#diff-e94394b2ac1d4f73991af98e4fa34fa3L32)
  we removed styling which made the year field 4 characters wide, but was
  coupled to the field's name.

  However, to avoid making this a breaking release, we added logic to
  automatically add the width classes based on the name.

  We are now removing this behaviour. Instead, users need pass explicit classes
  for each field in the `items` object for the desired width of the input field.

  If you are not passing items at all, you will get the default items which include these classes.

  If you are using the Nunjucks macro, you need to provide a width class for
  each item, for example:

  ```
  {{ govukDateInput({
    "id": "dob",
    "name": "dob",
    "fieldset": {
      "legend": {
        "text": "What is your date of birth?"
      }
    },
    "items": [
      {
        "name": "day",
        "classes": "govuk-input--width-2"
      },
      {
        "name": "month",
        "classes": "govuk-input--width-2"
      },
      {
        "name": "year",
        "classes": "govuk-input--width-4"
      }
    ]
  }) }}
  ```

  If you are using plain HTML, you need to manually add a width-based class, such
  as  `govuk-input--width-2` or `govuk-input--width-4` to the input fields.

  ([PR #969](https://github.com/alphagov/govuk-frontend/pull/969))

- Rename `name` argument of date-input component to `namePrefix`.

  This is better reflective of the purpose of the argument, which is to prefix the `name` attribute of `items`. This is consistent with other components which use the name `idPrefix` to explain similar functionality.

  If your project currently uses this optional argument with the date-input macro, you need to rename all instances of it to `namePrefix` (NB: this argument shouldn't be confused with the `items.{}.name` attribute which hasn't changed.)

  ([PR #984](https://github.com/alphagov/govuk-frontend/pull/984))

- Turn off [compatibility mode](./docs/installation/installing-with-npm.md#compatibility-mode) by default for [GOV.UK Elements](https://github.com/alphagov/govuk_elements), [GOV.UK Template](https://github.com/alphagov/govuk_template), [GOV.UK Frontend Toolkit](https://github.com/alphagov/govuk_frontend_toolkit)

  You do not need to make any changes if you do not use these projects alongside GOV.UK Frontend.

  To migrate include the SCSS variables that correspond with the projects you depend on before importing GOV.UK Frontend styles into your app:

  ```SCSS
  // application.scss
  $govuk-compatibility-govukfrontendtoolkit: true;
  $govuk-compatibility-govuktemplate: true;
  $govuk-compatibility-govukelements: true;
  @import "govuk-frontend/all";
  ```
  ([PR #981](https://github.com/alphagov/govuk-frontend/pull/981))

- Turn on relative typography (rem) by default

  This allows for end-users to adjust GOV.UK Frontend components by setting their font size in their browser.

  If you are using GOV.UK Frontend on with no other frameworks this should not break your project.

  If you need to change this setting for compatibility with [GOV.UK Elements](https://github.com/alphagov/govuk_elements), [GOV.UK Template](https://github.com/alphagov/govuk_template), [GOV.UK Frontend Toolkit](https://github.com/alphagov/govuk_frontend_toolkit) consider enabling [compatibility mode](./docs/installation/installing-with-npm.md#compatibility-mode).

  Otherwise, set `$govuk-typography-use-rem` to `false` before importing GOV.UK Frontend styles into your app:
  ```SCSS
  // application.scss
  $govuk-typography-use-rem: false;
  @import "govuk-frontend/all";
  ```
  ([PR #981](https://github.com/alphagov/govuk-frontend/pull/981))

- Remove anchor styling in govuk-lists

  This was an undocumented feature of lists.

  To migrate we recommend using adding `.govuk-link` class to any anchors within a govuk-list.

  If you would like to replicate this functionality without adding a class you can also enable [global styles](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#global-styles) (Note: global styles are enabled by default in the GOV.UK Prototype Kit)

  ([PR #985](https://github.com/alphagov/govuk-frontend/pull/985))

- Remove the width declaration from the `<select>` component

  The `<select>` component’s width will now be defined by it’s content. This addresses some accessibility issues with the select being 100% wide by default. If you want to style your select to be 100% wide we have added a new override class `.govuk-!-width-full` to allow this.

  ([PR #960](https://github.com/alphagov/govuk-frontend/pull/960))

- Use text colour on focus for better contrast

  Updates the focus styles of links in GOV.UK Frontend so they pass WCAG contrast requirements.

  ([PR #982](https://github.com/alphagov/govuk-frontend/pull/982))

🆕 New features:

- Add a new width override class `.govuk-!-width-full`

  You can now override elements that have an undefined or smaller percentage  width to be 100% width of their container.

  ([PR #960](https://github.com/alphagov/govuk-frontend/pull/960))

- Allow attributes on select items

  You can now provide attributes on select items
  `attributes: { 'data-attribute': 'value' }`

  ([PR #977](https://github.com/alphagov/govuk-frontend/pull/977))

🔧 Fixes:

- Textareas can now only be resized vertically, to prevent them being resized
  outside of their container bounds. Additionally, they now have a minimum
  height to prevent them being resized smaller than a text input.

  ([PR #976](https://github.com/alphagov/govuk-frontend/pull/976))

- Defend tables against GOV.UK Elements code
  ([PR #983](https://github.com/alphagov/govuk-frontend/pull/983))

## 1.3.0 (feature release)

🆕 New features:

- Allow attributes on checkboxes/radios

  You can now provide attributes on checkbox and radio items
  `attributes: { 'data-attribute': 'value' }`

  ([PR #942](https://github.com/alphagov/govuk-frontend/pull/942))

🔧 Fixes:

- Fix incorrect panel title bottom margin with optional text

  Margin is only added when panel text is provided

  ([PR #936](https://github.com/alphagov/govuk-frontend/pull/936))

- Remove template whitespace

  Remove leading whitespace before the doctype in the page template.
  Some older browser will be forced into 'quirks mode' if there is whitespace before the doctype.

  ([PR #949](https://github.com/alphagov/govuk-frontend/pull/949))

- Remove additional dotted outline from focussed buttons in Firefox

  This was already the intended behaviour, but a minor typo (: rather than ::)
  meant that it wasn't being applied.

  ([PR #951](https://github.com/alphagov/govuk-frontend/pull/951))

- Update date input component to use `display: inline-block`
  ([PR #938](https://github.com/alphagov/govuk-frontend/pull/938))

- Change spacing relationship on default and small legends and hints
  ([PR #940](https://github.com/alphagov/govuk-frontend/pull/940))

- Adjust tag component padding to compensate for font spacing
  ([PR #955](https://github.com/alphagov/govuk-frontend/pull/955))

## 1.2.0 (feature release)

🆕 New features:

- Allow for optional divider between radio items

  You can now provide a divider item (e.g "or") to separate items
  ([PR #849](https://github.com/alphagov/govuk-frontend/pull/849))

- Allow og:image meta tag url to be set independantly
  Image url for the opengraph image needs to be absolute and
  can now be overwritten by setting the `assetUrl` variable.
  ([PR #847](https://github.com/alphagov/govuk-frontend/pull/847))

- Only underline the logo in the header on underline when users have overridden
  colours in their browser, rather than it appearing underlined all the time
  ([PR #926](https://github.com/alphagov/govuk-frontend/pull/926))

- Allow for optional hint for each radio and checkbox item

  You can now pass a hint object (or add in html) to each radio
  and checkbox item to display the hint
  ([PR #846](https://github.com/alphagov/govuk-frontend/pull/846))

- Allow additional classes to be added to the radio and checkbox items

  You can now provide `label: { classes: 'extra-class' }` to each item.

  ([PR #880](https://github.com/alphagov/govuk-frontend/pull/880))

🔧 Fixes:

- Replace conflicting `js-hidden` class used within the tabs component with a new modifier class.
  Because this class is defined and used within the JavaScript, no markup changes are required.
  ([PR #916](https://github.com/alphagov/govuk-frontend/pull/916))
- Use `get-function` when calling a Sass function as passing a string to `call()``
  is deprecated and will be illegal in Sass 4.0
  ([PR #919](https://github.com/alphagov/govuk-frontend/pull/919))

- Fix flash of unstyled content with conditional reveals (Radios and Checkboxes)

  If the conditional reveal JavaScript is slow to execute it can result in showing the user their contents briefly which can be jarring.

  ([PR #885](https://github.com/alphagov/govuk-frontend/pull/885))

## 1.1.1 (fix release)

🔧 Fixes:

- Update details behaviour to remove margin-bottom for all elements
  ([PR #900](https://github.com/alphagov/govuk-frontend/pull/900))

- Update internal padding of tab content in the tabs component
  ([PR #886](https://github.com/alphagov/govuk-frontend/pull/886))

- Fixes an issue where clicking the revealed content in browsers that do not
  support the native details element causes the details element to collapse.
  ([PR #912](https://github.com/alphagov/govuk-frontend/pull/912))

- Fixes an issue where clicking the revealed content within a details element
  toggles the aria-expanded attribute on the summary element and the aria-hidden
  attribute on the content element, causing them to get out of sync with the
  visible state of the component.
  ([PR #912](https://github.com/alphagov/govuk-frontend/pull/912))

- Fixes an issue where it's not possible to make any field that does not have
  the name ‘year’ use any other width than 2 characters
  ([PR #908](https://github.com/alphagov/govuk-frontend/pull/908))

- Fix undefined class displaying in date input
  ([PR #913](https://github.com/alphagov/govuk-frontend/pull/913))

## 1.1.0 (feature release)

🆕 New features:

- Add `govuk-visually-hidden-focusable` class

  Adds `.govuk-visually-hidden-focusable` and deprecates `.govuk-visually-hidden-focussable` in order to fix the typo in the class name. Please consider updating your code as the next major release will remove the deprecated class.

  ([PR #859](https://github.com/alphagov/govuk-frontend/pull/859))

- Allow panel component title heading to be customisable.

  You can now specify a heading level by providing
  `headingLevel: <number>` parameter. Default is `2`.
  ([PR #853](https://github.com/alphagov/govuk-frontend/pull/853))

- Update date input component

  Allow the `name` and `id` attributes to be passed individually for each input item.

  Rely on `classes` instead of item names to set the width of input items.

  Add default (day, month, year) date input items if no items are being specified

  ([PR #857](https://github.com/alphagov/govuk-frontend/pull/857))

- The typography scale can now be converted from pixels to rem automatically,
  with pixels also being provided as a fallback for older browsers.

  This feature is disabled by default - in order to use it you will need to set
  `$govuk-typography-use-rem: true` and ensure that `$govuk-root-font-size` is
  set to the effective size of your root (html) element. For new projects, this
  should be the default of 16px so you don't have to do anything. For projects
  that use alphagov/govuk_template this should be 10px.

  The intention is to enable this by default in the next major version:
  https://github.com/alphagov/govuk-frontend/issues/868

  ([PR #858](https://github.com/alphagov/govuk-frontend/pull/858))


🔧 Fixes:

- Remove mistakenly applied 5px bottom margin from radio and checkbox
  labels.
  ([PR #883](https://github.com/alphagov/govuk-frontend/pull/883))

- Apply `display:block` to `.govuk-main-wrapper`

  In IE11 `main` element is set to `display:inline` so padding
  and margins aren't applied.
  ([PR #863](https://github.com/alphagov/govuk-frontend/pull/863)))

- Line-heights are now converted from pixels to relative 'unit-less' values
  in order to prevent issues when resizing text in the browser.
  ([PR #837](https://github.com/alphagov/govuk-frontend/pull/837) and
   [PR #848](https://github.com/alphagov/govuk-frontend/pull/848))

- Add bottom margin to Tabs component
  All components (or outer layer components) have a bottom margin
  applied to them so spacing feels automatic.
  ([PR #841](https://github.com/alphagov/govuk-frontend/pull/841))

- Update Crown copyright link
  Update the Crown copyright link on the National Archives so
  we don't send users on an unnecessary redirect.
  ([PR #824](https://github.com/alphagov/govuk-frontend/pull/824))

- Fixes radio and checkbox labels extending full width of page
  ([PR #821](https://github.com/alphagov/govuk-frontend/pull/821))

- Prevent the exclamation mark in the warning text component from being
  selectable, which also excludes it when it is copied as part of a wider body
  of text
  ([PR #856](https://github.com/alphagov/govuk-frontend/pull/856))

- Add customised colours handling for warning text

  By adding a border to this component, when a user customises their colour settings
  they will still see a circle even if the background is removed.
  ([PR #852](https://github.com/alphagov/govuk-frontend/pull/852))

- Fixes a bug where the phase banner incorrectly uses a font-size of 19px when
  global styles are enabled
  ([PR #877](https://github.com/alphagov/govuk-frontend/pull/877))

- Add outlines to Radios and Checkboxes for customised colour users

  Now when a [user customises their colours](https://accessibility.blog.gov.uk/2017/03/27/how-users-change-colours-on-websites/),
  they should see a focus state on both Radios and Checkboxes.
  ([PR #854](https://github.com/alphagov/govuk-frontend/pull/854))

- Add outline to tag for customised colour users

  Now when a [user customises their colours](https://accessibility.blog.gov.uk/2017/03/27/how-users-change-colours-on-websites/),
  the tag component still keeps it's meaning.
  ([PR #855](https://github.com/alphagov/govuk-frontend/pull/855))

- Define size of table in `px` rather than `em`

  This brings the styling of tables inline with rest of GOV.UK Frontend which no longer uses `em` for measurements.

  This change very slightly increases the padding of table cells on mobile viewport as the use of `em` meant the font size set in the table was used to calculate padding. `padding-top` and `padding-bottom` of cells increase by 1.5px respectively which very slightly increases the height of the table on mobile.

  In the unlikely case that your UI has a dependency on tables being a certain fixed height of mobile viewport, this change might affect you.

  ([PR #845](https://github.com/alphagov/govuk-frontend/pull/845))

- Fix header component's reliance on markup whitespace

  We have had issues where the header component can render incorrectly if the markup contains whitespace,
  for example if it has been pretty printed.

  This changes the header component to use float based columns similar to how the grid system works.

  ([PR #884](httqps://github.com/alphagov/govuk-frontend/pull/884))

🏠 Internal:

- Fix Design System url in package READMEs and review app
  ([PR #812](https://github.com/alphagov/govuk-frontend/pull/812))

- Update back-link example to show default usage doesn't need
  `text` parameter
  ([PR #819](https://github.com/alphagov/govuk-frontend/pull/819))

- Lowercase component names
  ([PR #822](https://github.com/alphagov/govuk-frontend/pull/822))

- Tidy up some package.json fields to help contributors and users
  ([PR #827](https://github.com/alphagov/govuk-frontend/pull/827))

- Fix failing Heroku app with Node 10.5.0
  Revert to pinning node version in package json
  ([PR #833](https://github.com/alphagov/govuk-frontend/pull/833))

- Format YAML and Nunjucks consistently
  ([PR #830](https://github.com/alphagov/govuk-frontend/pull/830))

## 1.0.0 (Major release)

🆕 New features:

- Add default text for back-link component
  ([PR #793](https://github.com/alphagov/govuk-frontend/pull/793))

- Add default container class to the header component
  ([PR #807](https://github.com/alphagov/govuk-frontend/pull/807))

- Add tabs component – thanks to [@adamsilver](https://github.com/adamsilver) and [@trevorsaint](https://github.com/trevorsaint) for contributing
  ([PR #776](https://github.com/alphagov/govuk-frontend/pull/776))

🔧 Fixes:

- Reduce margin-bottom on the hint when following a default or small labe
  This reduces the margin-bottom of the hint by 5px after a default
  `<label>` or `<label class="govuk-label--s">`.
  ([PR #806](https://github.com/alphagov/govuk-frontend/pull/806))


🏠 Internal:

- Remove instructions to login with npm, which is no longer required
  ([PR #795](https://github.com/alphagov/govuk-frontend/pull/795))

- Update docs with the assistive technology we support ([PR #800](https://github.com/alphagov/govuk-frontend/pull/800))

- Update docs about installing fonts ([PR #802](https://github.com/alphagov/govuk-frontend/pull/802))

- Update browser support matrix
  Remove Windows Phone
  Update IE 8-10 to functional and IE 11 to compliant
  ([PR #803](https://github.com/alphagov/govuk-frontend/pull/803)

- Add notice about the use of `html` arguments in Nunjucks macros for production
  ([PR #785](https://github.com/alphagov/govuk-frontend/pull/785))

- Add CHANGELOG_TEMPLATE to make changelogs easier for new contributors
  ([PR #798](https://github.com/alphagov/govuk-frontend/pull/798))

- Update package `README`
  ([PR #804](https://github.com/alphagov/govuk-frontend/pull/804))

- Update JavaScript installation instructions
  ([PR #808](https://github.com/alphagov/govuk-frontend/pull/808))

## 0.0.32 (Breaking release)

**This release changes the name of package.** It's now published as `govuk-frontend` on `npm`.

💥 Breaking changes:

- The default build of the GOV.UK Frontend JavaScript now does not initialize all components automatically.

  This allows you to initialize only the components you need, and gives you finer control over when the JavaScript for GOV.UK Frontend runs.

  To migrate your project you need to change
  ```html
    <script src="{path-to-govuk-frontend}/all.js"></script>
  ```
  to
  ```html
    <script src="{path-to-govuk-frontend}/all.js"></script>
    <script>window.GOVUKFrontend.initAll()</script>
  ```

  Now, if you only want to initialize a specific component you can now do so by:
  ```html
    <script src="{path-to-govuk-frontend}/all.js"></script>
    <script>
      var Button = window.GOVUKFrontend.Button
      new Button(document).init()
    </script>
  ```

  Note: If you are importing JavaScript with a bundler, this is not likely to change anything for you.
  ([PR #759](https://github.com/alphagov/govuk-frontend/pull/759))

- Consistently structure the Details and Button component, so that they can be instantiated the same as the other components.

  If you're using `GOVUKFrontend.initAll()` you do not need to make any changes, otherwise you need to change
  ```html
    <script>
      new Button().init()
      new Details().init()
    </script>
  ```
  to
  ```html
    <script>
      new Button(document).init()

      var $details = document.querySelectorAll('details')
      nodeListForEach($details, function ($detail) {
        new Details($detail).init()
      })
    </script>
  ```
  ([PR #761](https://github.com/alphagov/govuk-frontend/pull/761))

- All sass-mq settings have now been made private. We are now exposing new
  settings to allow you to customise breakpoints and responsive behaviour:

  - `$govuk-breakpoints` - Map of breakpoint definitions
  - `$govuk-show-breakpoints` - Whether to show the current breakpoint in the
    top right corner
  - `$govuk-ie8-breakpoint` - Breakpoint to rasterize to for IE8

  If you are overriding any settings prefixed with `$mq-` in your application
  you will need to update to the use the new `$govuk-` prefixed settings.

  ([PR #748](https://github.com/alphagov/govuk-frontend/pull/748))

- Font settings have been renamed:

  - `$govuk-font-stack` has been renamed to `$govuk-font-family`
  - `$govuk-font-stack-tabular` has been renamed to `$govuk-font-family-tabular`
  - `$govuk-font-stack-print` has been renamed to `$govuk-font-family-print`

  ([PR #748](https://github.com/alphagov/govuk-frontend/pull/748))

- Spacing has been refactored. You will need to update Sass that currently uses GOV.UK Frontend spacing:

  - Instead of
  ``` css
  $govuk-spacing-scale-*
  ```
  use
  ``` css
  govuk-spacing(*)
  ```
  where `*` is the number on the spacing scale. The scale itself has remained the same so that `$govuk-spacing-scale-3` corresponds to `govuk-spacing(3)`. This change allows us to control the error messaging when incorrect values are used and to deprecate variables. The values of spacing variables can also be overridden by consumers.

  - Instead of:
  ``` css
  @include govuk-responsive-margin($govuk-spacing-responsive-2, "bottom");
  @include govuk-responsive-padding($govuk-spacing-responsive-2, "bottom");
  ```
  use
  ``` css
  @include govuk-responsive-margin(2, "bottom");
  @include govuk-responsive-padding(2, "bottom");
  ```
  This change, again, allows us to control the error messaging since spacing variables are not exposed directly. Also, the spacing scale itself has not changed so that `$govuk-spacing-responsive-2` corresponds to `2` when passed to the padding and margin mixins.

  This PR also updates tests and sass-docs of spacing variables and helpers.

  Additionally, this PR hardcodes the value of `$govuk-gutter`, see PR for more details.

  ([PR #779](https://github.com/alphagov/govuk-frontend/pull/779))

- Remove `pageStart` block from template, as could result in rendering issues in older IE.
  ([PR #765](https://github.com/alphagov/govuk-frontend/pull/765))

- You should no longer call the `mq` mixin directly - you should replace any
  calls to it from your own code with `govuk-media-query` which accepts the same
  arguments. All mixins and settings that start with `mq-` should be considered
  private – they could be removed in the future without notice.
  ([PR #763](https://github.com/alphagov/govuk-frontend/pull/763))

- All of the shorthand 'font' mixins (e.g. `govuk-font-bold-80`,
  `govuk-font-regular-tabular-19`), have been removed and replaced with calls to
  a new mixin `govuk-font`. If you are using these mixins in your application
  you will need to update your code to call `govuk-font` instead.

  ([PR #772](https://github.com/alphagov/govuk-frontend/pull/772))

- The font maps are no longer as individual variables (e.g. `$govuk-font-80`) -
  they are all now part of one single `$govuk-typography-scale` map. Instead of
  passing font maps to `govuk-typography-responsive` you should now pass the
  desktop font size (e.g. `govuk-typography-responsive(80)` or
  `govuk-typography-responsive($size: 80)`.

  ([PR #772](https://github.com/alphagov/govuk-frontend/pull/772))

- All organisation variables (e.g. `$govuk-cabinet-office`) have been moved into
  a single `$govuk-colours-organisations` map. If you need to use an
  organisation colour in your own code, you should use the new
  `govuk-organisation-colour` function:

  ```scss
  .element {
    color: govuk-organisation-colour(cabinet-office);
  }
  ```

  Note that this function will return 'web-safe' colours by default. You can
  pass $websafe: false to get the non-websafe colour.

- The colour palette variables (e.g. `$govuk-green`) have been moved into a
  new single `$govuk-colours` map. If you need to reference a colour within your
  application you should use the new `govuk-colour` function:

  ```scss
  .element {
    color: govuk-colour("green");
  }
  ```

  Tints (`$govuk-green-50`, `$govuk-green-25`) have been removed from the colour
  palette.

- A number of the colours have been renamed to use more neutral names:

  - `mauve` → `light-purple`
  - `fuchsia` → `bright-purple`
  - `baby-pink` → `light-pink`
  - `mellow-red` → `bright-red`
  - `grass-green` → `light-green`

- The 'circle shape' object (`.govuk-circle`) which was used by the warning text
  component's '!' icon has been removed and the `govuk-warning-text__icon` class
  has been updated to make it circular without the need for another class.

  ([PR #782](https://github.com/alphagov/govuk-frontend/pull/782))
- Removal of `govuk-prose-scope`
  We don't have confidence that the prose scope is well understood –
  without further research / better documentation it's safer to remove it for now.

  If you are currently using prose-scope, you should revert to applying classes to
  individual headings, lists and hr elements.
  In version [0.0.29-alpha](https://github.com/alphagov/govuk-frontend/releases/tag/v0.0.29-alpha)
  release we have added the option to enable global link and paragraph styles.

  If you're using a recent version of the Private Beta Prototype kit,
  this is enabled by default.

  ([PR #778](https://github.com/alphagov/govuk-frontend/pull/778))

- Make override classes consistently verbose
  Based on [feedback from the community](https://gist.github.com/nickcolley/f135e89ed4b679355b0ab47135b38ee8)
  we have made the override classes consistent where previously some where verbose and some where shorthand.

  We've made the decision to remove the 'r' for responsive, this was hard to remember and users found this confusing.

  To migrate you will need to replace any instances of:

  - `.govuk-!-f-{size}` with `.govuk-!-font-size-{size}`
  - `.govuk-!-w-{weight}` with `.govuk-!-font-weight-{weight}`
  - `.govuk-!-m{direction}-r{scale}` with `.govuk-!-margin-{direction}-{scale}`
  - `.govuk-!-p{direction}-r{scale}` with `.govuk-!-padding-{direction}-{scale}`

  For example if you were using:
  - `.govuk-!-mb-r5` you would need to change this to `.govuk-!-margin-bottom-5`
  - `.govuk-!-f-24` you would need to change this to `.govuk-!-font-size-24`

  See the original Pull Request for the full list of classes before and after.

  ([PR #786](https://github.com/alphagov/govuk-frontend/pull/786))

🔧 Fixes:

- Fix govuk-equilateral-height function usage in shape-arrow helper
  ([PR ##766](https://github.com/alphagov/govuk-frontend/pull/766))

- The `<label>` element will now be omitted for form controls where no label
  text or html is provided. If you call the label component directly whilst
  passing neither text nor html, no HTML will be outputted.
  ([PR #740](https://github.com/alphagov/govuk-frontend/pull/740))

- Add `govuk-main-wrapper` to `<main>` element by default.
  ([PR #742](https://github.com/alphagov/govuk-frontend/pull/742))

- Use relative imports whenever a component imports another component, to allow
  for cases where users don't want to add the components folder itself to their
  nunjucks paths.
  ([PR #743](https://github.com/alphagov/govuk-frontend/pull/743))

- Update JavaScript global namespace from 'all' to 'GOVUKFrontend',
  we intend to allow users to initialize components from this namespace.
  ([PR #747](https://github.com/alphagov/govuk-frontend/pull/747))

- Tabular numbers will now correctly use the `$govuk-font-family-tabular`
  setting rather than being hardcoded to use NTA tabular.
  ([PR #748](https://github.com/alphagov/govuk-frontend/pull/748))

- Prevents focus from being lost to the inline SVGs in the header (the crown)
  and footer (the OGL logo) by marking them as non-focusable elements
  ([PR #774](https://github.com/alphagov/govuk-frontend/pull/774))

- Use the correct class name in bold label example
  (govuk-label--s rather than govuk-label--bold)
  ([PR #784](https://github.com/alphagov/govuk-frontend/pull/784))

- Update table of arguments for each component to ensure they're accurate.
  ([PR #769](https://github.com/alphagov/govuk-frontend/pull/769))

- Add explicit dependency on colour maps
  ([PR #790](https://github.com/alphagov/govuk-frontend/pull/790))


🆕 New features:

- Components are now available to use from the `GOVUKFrontend` global.
You can now initialize individual components like so:
```html
  <script>
    var Radios = window.GOVUKFrontend.Radios
    new Radios(document).init()
  </script>
```
([PR #759](https://github.com/alphagov/govuk-frontend/pull/759))

- Add `beforeContent` block to the template, for content that does not belong inside `<main>` element.
  For example: Back links.
  ([PR #742](https://github.com/alphagov/govuk-frontend/pull/742))

- Most of the settings, helpers and tools layers is now documented using
  Sassdoc, with variables, functions and mixins being marked as private or
  public.
  ([PR #748](https://github.com/alphagov/govuk-frontend/pull/748))
  ([PR #762](https://github.com/alphagov/govuk-frontend/pull/762))

- Most of the settings can now be overridden in your application (they are now
  marked as !default)
  ([PR #748](https://github.com/alphagov/govuk-frontend/pull/748))


🏠 Internal:

- Fix review application templates to give them the correct HTML structure.
  ([PR #742](https://github.com/alphagov/govuk-frontend/pull/742))

- Improve release steps
  ([PR #745](https://github.com/alphagov/govuk-frontend/pull/745))

- Reintroduce mistakenly deleted HTML5Shiv required for IE8
  ([PR #749](https://github.com/alphagov/govuk-frontend/pull/749))

- Fix issues with canvas colour bleeding into main review page
  ([PR #741](https://github.com/alphagov/govuk-frontend/pull/741))

- Add header with service name and navigation variant to header README ([PR #781](https://github.com/alphagov/govuk-frontend/pull/781))

## 0.0.31-alpha (Breaking release)

💥 Breaking changes:

- The `govuk-file-url` helper has been renamed to to `govuk-image-url`. If you
  are using this function in your own styles you will need to update calls to
  it. ([PR #726](https://github.com/alphagov/govuk-frontend/pull/726))

- The `$govuk-global-images` variable has been renamed to to
  `$govuk-images-path`. If you are overriding this variable or using it in your
  own styles you will need to update your code to use the new variable name.
  ([PR #726](https://github.com/alphagov/govuk-frontend/pull/726))


🔧 Fixes:

- Namespacing SCSS exports with 'govuk' prefix to avoid clashes with
  exports in applications consuming GOV.UK Frontend
  ([PR #732](https://github.com/alphagov/govuk-frontend/pull/732))

- Fixes a bug whereby print styles were being 'rasterized' into the screen
  styles when generating the IE8 stylesheet (this is a bug in sass-mq, and has
  also been raised upstream – https://github.com/sass-mq/sass-mq/pull/111).
  ([PR #726](https://github.com/alphagov/govuk-frontend/pull/726))

- Removed some duplicated CSS rules from the outputted CSS
  ([PR #727](https://github.com/alphagov/govuk-frontend/pull/727))

- Fixes a bug in IE8 where the button component did not have a shadow, by
  rendering the shadow using a border for IE8 specifically – IE8 does not
  support box-shadow
  ([PR #737](https://github.com/alphagov/govuk-frontend/pull/737))


🆕 New features:

- Change font delivery method from Base64 encoded strings to serving WOFF2, WOFF
  and EOT files as separate HTTP requests. You will need to ensure that you are
  serving the fonts from the assets folder as part of your application.
  ([PR #726](https://github.com/alphagov/govuk-frontend/pull/726))

- The font-face is now using `font-display: fallback`. This means that the
  fallback font (Arial) will be used if NTA doesn't download within 100ms. The
  browser will then swap to NTA as long as it loads within the short swap period.
  ([PR #726](https://github.com/alphagov/govuk-frontend/pull/726))

- You can now override the helpers used to generate image and font urls, for
  example if you are using sass-rails' asset-pipeline functionality.
  You can do this by setting `$govuk-image-url-function` and
  `$govuk-font-url-function` to the name of the function(s) you wish to use.
  See `src/settings/_assets.scss` for more information and examples.
  ([PR #733](https://github.com/alphagov/govuk-frontend/pull/733))

- Add boilerplate template, which is a Nunjucks replacement for [GOV.UK Template](https://github.com/alphagov/govuk_template).
  ([PR #731](https://github.com/alphagov/govuk-frontend/pull/731))

🏠 Internal:

- Improve release steps, based on doing a release
  ([PR #725](https://github.com/alphagov/govuk-frontend/pull/725))

- Fix majority of vulnerabilities flagged by `npm audit`
  ([PR #712](https://github.com/alphagov/govuk-frontend/pull/712))

## 0.0.30-alpha (Minor release)

🔧 Fixes:

- Update component readme files content
  ([PR #704](https://github.com/alphagov/govuk-frontend/pull/704))

- Fix panel body element rendering with no text
  ([PR #707](https://github.com/alphagov/govuk-frontend/pull/707))

🆕 New features:

- Add override classes to set `display` property to `block`, `inline` and `inline-block` (PR [#694](https://github.com/alphagov/govuk-frontend/pull/654))

- Add option to set CSS display property for govuk-shape-arrow mixin
  ([PR #701](https://github.com/alphagov/govuk-frontend/pull/701))

- Add header component (PR [#695](https://github.com/alphagov/govuk-frontend/pull/695))

- Add inset text component (PR [#709](https://github.com/alphagov/govuk-frontend/pull/709))

- Add ability to pass explicit name value to checkbox items (PR [#719](https://github.com/alphagov/govuk-frontend/pull/719))

🏠 Internal:

- Run tests in pre-release
  ([PR #706](https://github.com/alphagov/govuk-frontend/pull/706))

- Fix CI timeouts: run Jest single thread in TravisCI
  ([PR #712](https://github.com/alphagov/govuk-frontend/pull/712))

- Ensure 'after' tests are not ignored
  ([PR #720](https://github.com/alphagov/govuk-frontend/pull/720))

## 0.0.29-alpha (Breaking release)

💥 Breaking changes:

- Restructure project to enable it to be published as a single package

  The [new project structure]((./src/README.md)) matches our ITCSS inspired layers and is published as a single package as `@govuk-frontend/frontend`.

  You will need to:

  - Update your npm dependencies to use `@govuk-frontend/frontend`
  - Update your SCSS import paths to match the new package name and folder structure.

  If you're importing everything at once:

  ```CSS
  @import "node_modules/@govuk-frontend/frontend/all";
  ```

  If you're importing individual components:

  ```CSS
  @import "node_modules/@govuk-frontend/frontend/components/button/button";
  ```

  See the [main README](./README.md) for up-to-date installation instructions.

  ([PR #680](https://github.com/alphagov/govuk-frontend/pull/680))

- Error Messages and Hints have been moved out Label and Fieldset components.

  They are no longer nested within the label or legend.
  They are associated with the input or with the fieldset using aria-describedby.

  Hint has been made into a new component similar to Error Message.

  If you're using markup, you will need to update the old markup:

  ```HTML
  <label class="govuk-c-label" for="national-insurance-number">
    National Insurance number
    <span class="govuk-c-label__hint">
      It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.
    </span>
    <span class="govuk-c-error-message">
      Error message goes here
    </span>
  </label>
  <input class="govuk-c-input govuk-c-input--error" id="national-insurance-number" name="national-insurance-number" type="text">
  ```

  With the new markup:

  ```HTML
  <label class="govuk-label" for="national-insurance-number">
    National Insurance number
  </label>
  <span id="national-insurance-number-hint" class="govuk-hint">
    It’s on your <i>National Insurance card</i>, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.
  </span>
  <span id="national-insurance-number-error" class="govuk-error-message">
    Error message goes here
  </span>
  <input class="govuk-input govuk-input--error" id="national-insurance-number" name="test-name-3" type="text" aria-describedby="national-insurance-number-hint national-insurance-number-error">
  ```

  If you're using macros:

  The fieldset macro no longer accepts `legendHintText` or `legendHintHtml` -
  these parameters are now passed to the hint component which accepts `text` or
  `html`. The date-input, checkboxes and radios components have been updated to
  use the new Hint component.

  The label macro no longer accepts `hintText` or `hintHtml` - these parameters
  are now passed to the hint component which accepts `text` or `html`. The
  file-upload, input, select and textarea components have been updated to use the
  new Hint component.

  For example, this example macro call for a File Upload component:

  ```njk
  {{ govukFileUpload({
    "id": "file-upload",
    "name": "photo",
    "label": {
      "text": "Upload your photo",
      "hintText": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder."
    }
  }) }}
  ```

  would now be:

  ```njk
  {{ govukFileUpload({
    "id": "file-upload",
    "name": "photo",
    "label": {
      "text": "Upload your photo"
    },
    "hint": {
      "text": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder."
    }
  }) }}
  ```

  For more examples of the new markup and Nunjucks macros see the GOV.UK Design System [Question Pages pattern](https://govuk-design-system-production.cloudapps.digital/patterns/question-pages/)

  ([PR #681](https://github.com/alphagov/govuk-frontend/pull/681))

- The date-input component now sets an explicit `group` role on the fieldset
  to force JAWS 18 to announce the error message and hint.
  ([PR #681](https://github.com/alphagov/govuk-frontend/pull/681))

- The label component macro now accepts an `isPageHeading` argument which determines
  whether the label itself should be wrapped in an h1:

  ```html
  <h1 class="govuk-label-wrapper">
    <label class="govuk-label">What is your National Insurance number?</label>
  </h1>
  ```

  The `.govuk-label-wrapper` removes the margins from the heading so that the
  presence of the `h1` has no effect on the styling of the label.

  ([PR #684](https://github.com/alphagov/govuk-frontend/pull/684))


- Added new modifier classes for labels to allow you to create a label that
  visually corresponds to the equivalent heading class (for example, a
  `.govuk-label--xl` will have the same font size and weight as a
  `.govuk-heading-xl`)

  ([PR #684](https://github.com/alphagov/govuk-frontend/pull/684))


- The arguments for a fieldset's legend have been rolled up into an object. For
  example, the following macro call:

  ```
  {{ govukFieldset({
    legendText: "What is your date of birth?"
  }) }}
  ```

  would now be:

  ```
  {{ govukFieldset({
    legend: {
      text: "What is your date of birth?"
    }
  }) }}
  ```

  The `legend` object can also accept new `classes` and `arguments`

  Components that use the fieldset component have been updated to reflect these
  changes.

  ([PR #684](https://github.com/alphagov/govuk-frontend/pull/684))


- The fieldset component has a new parameter legend.isPageHeading, which defines
  whether the legend text should be wrapped in an h1:

  ```html
  <legend class="govuk-fieldset__legend">
    <h1 class="govuk-fieldset__heading">Have you changed your name?</h1>
  </legend>
  ```

  The `.govuk-fieldset__heading` class ensures that the `<h1>` inherits its
  properties from the legend, so that the presence of the `h1` has no effect on
  its styling.

  ([PR #684](https://github.com/alphagov/govuk-frontend/pull/684))


- Added new modifier classes for legends to allow you to create a legend that
  visually corresponds to the equivalent heading class (for example, a
  `.govuk-fieldset__legend--xl` will have the same font size and weight as a
  `.govuk-heading-xl`)

  ([PR #684](https://github.com/alphagov/govuk-frontend/pull/684))

- Remove -c -o -h layer prefixes
  ([PR #644](https://github.com/alphagov/govuk-frontend/pull/644))
  In user research and in feedback from Private Beta partners we
  learned that users didn't really understand what -o, -c and -h prefixes
  stand for or why they're useful.

  They also introduced additional cognitive load when composing classes,
  having to remember which suffix the classname contains.

  If you're using markup, you will need to:
  - Remove -o, -c and -h prefixes from class names in your markup

  For example, change:
  ```HTML
  <button class="govuk-c-button">Save and continue</button>
  ```

  Into:

  ```HTML
  <button class="govuk-button">Save and continue</button>
  ```

- Simplify grid syntax and introduce grid-row and column mixins.

  Based on user research feedback we have simplified the grid classes
  to a more concise naming structure.

  You will need to:
  - Change grid class names in your markup

  For example, change:
  ```HTML
  <div class="govuk-o-grid">
    <div class="govuk-o-grid__item govuk-o-grid__item--two-thirds">
      <!-- content -->
    </div>
    <div class="govuk-o-grid__item govuk-o-grid__item--one-third">
      <!-- content -->
    </div>
  </div>
  ```

  Into:

  ```HTML
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <!-- content -->
    </div>
    <div class="govuk-grid-column-one-third">
      <!-- content -->
    </div>
  </div>
  ```

  We have also introduced two mixins
  to help generate additional or custom grid styles and widths,
  see original pull request for usage.

  ([PR #665](https://github.com/alphagov/govuk-frontend/pull/665))


🔧 Fixes:

- Remove redundant font-family declaration from the button component – this will
  also fix an issue where the button uses New Transport when printed instead of
  falling back to the print stack as expected.
  (PR [#650](https://github.com/alphagov/govuk-frontend/pull/650))

- Reinstate focus outline for radios and checkboxes on IE8
  (PR [#670](https://github.com/alphagov/govuk-frontend/pull/670))

- Fix section break styles when used with GOV.UK Elements
  ([PR #682](https://github.com/alphagov/govuk-frontend/pull/682))

- Remove `-webkit-tap-highlight-color` from links (PR [#692](https://github.com/alphagov/govuk-frontend/pull/692))

- Remove normalize from /dist builds
(PR [#699](https://github.com/alphagov/govuk-frontend/pull/699))

🆕 New features:

- We're now using ES6 Modules and [rollup](https://rollupjs.org/guide/en) to distribute our JavaScript. (PR [#652](https://github.com/alphagov/govuk-frontend/pull/652))
- Checkboxes and Radios conditional reveal
(PR [#616](https://github.com/alphagov/govuk-frontend/pull/616))

- Vendor-in SassMQ functionality, write tests and remove external dependency
  (PR [#657](https://github.com/alphagov/govuk-frontend/pull/657))

- Focus Error Summary on window load
    (PR [#671](https://github.com/alphagov/govuk-frontend/pull/671))

- Opt-in Global `<a>` and `<p>` styles
  (PR [#658](https://github.com/alphagov/govuk-frontend/pull/658))

  Global styles are not included by default.

  This is to avoid the risk of these globals conflicting with any pre-existing globals, for example in GOV.UK Elements or GOV.UK Template.

  Hovever, we do include them in the [GOV.UK Prototype Kit](https://github.com/alphagov/govuk-prototype-kit-private-beta) to speed up prototyping.

  To include global styles, you can set `$govuk-global-styles` variable to `true`.

🏠 Internal:

- Remove unused step in travis.yml file
  (PR [#690](https://github.com/alphagov/govuk-frontend/pull/690))
- Update publishing docs (PR [#651](https://github.com/alphagov/govuk-frontend/pull/651))
- Wrap `app.css` in conditional comments in review app layout (PR [#653](https://github.com/alphagov/govuk-frontend/pull/653))
- Fix missing code highlight and remove duplicate layout
(PR [#663](https://github.com/alphagov/govuk-frontend/pull/663))
- Exclude test related files from `dist/` and `packages/` copy task
(PR [#662](https://github.com/alphagov/govuk-frontend/pull/662))
- Add test to check if Sass in packages compiles correctly after the `build:packages` task
(PR [#669](https://github.com/alphagov/govuk-frontend/pull/669))
- Disable code syntax highlighting in IE8
(PR [#675](https://github.com/alphagov/govuk-frontend/pull/675))
- Simplify contents of the `dist/` folder
  (PR [#673](https://github.com/alphagov/govuk-frontend/pull/673))
- Added tests to ensure that the settings, helpers and tools layers do not
  output CSS.

## 0.0.28-alpha (Breaking release)

Fixes incomplete release from `packages/` and `dist/` in 0.0.27-alpha release.
Missing files were:
- `globals/tools/_compatibility.scss`
- `globals/tools/_ie8.scss`
- `globals/settings/_compatibility.scss`
- `globals/settings/_ie8.scss`

## 0.0.27-alpha (Breaking release)

💥 Breaking changes:

- Removed an (undocumented) modifier `govuk-c-radio__item--inline` which made
  radio buttons inline, in favour of a new block-level modifier
  `govuk-c-radios--inline` which will automatically make all the radio buttons
  within that block inline.
  (PR [#607](https://github.com/alphagov/govuk-frontend/pull/607))
- Prefix `$global-images` variable
  (PR [#615](https://github.com/alphagov/govuk-frontend/pull/615))
- Simplified how we build stylesheets that target old versions of IE:
  - Removed styles that target IE6 and IE7
  - Replaced IE mixins with a simpler version for targeting IE8 specifically
    without having to specify versions
  - Add a new tool mixin to easily exclude styles when targeting IE8
  - Automatically set $mq-responsive based on the value of the $govuk-is-ie8
    variable.

  If you are building an IE8 stylesheet for your application you'll need to
  update it to reference the new variable $govuk-is-ie8 – see the README for
  details.
  (PR [#631](https://github.com/alphagov/govuk-frontend/pull/631))
- Rename captionSize table argument to captionClasses ([PR #643](https://github.com/alphagov/govuk-frontend/pull/643))

🔧 Fixes:
- Link styles, as well as links within the  back-link, breadcrumbs, button,
  error summary, footer and skip link components defend against the
  `a:link:focus` selector in GOV.UK Template, which was overriding focussed
  links to always use the dark blue link colour for text.
  (PR [#609](https://github.com/alphagov/govuk-frontend/pull/609))
- Fix table captions to allow heading classes
  (PR [#633](https://github.com/alphagov/govuk-frontend/pull/633))

🆕 New features:
- Add `govuk-main-wrapper--l` a variant of the main page wrapper to use when a
  design does not include back links, breadcrumbs or phase banners
  (PR [#602](https://github.com/alphagov/govuk-frontend/pull/602))
- Added a new `.govuk-link--text-colour` modifier to make links use the same
  colour as the text.
  (PR [#609](https://github.com/alphagov/govuk-frontend/pull/609))
- Introduce new mixins for link styles (muted links, text links) and update
  the existing link classes to use them
  (PR [#609](https://github.com/alphagov/govuk-frontend/pull/609))
- Introduce a new 'compatibility' mixin and settings to allow us to selectively
  include styles that 'counter' styles from the existing products
  (e.g. GOV.UK Template)
  (PR [#609](https://github.com/alphagov/govuk-frontend/pull/609))
- The back link, breadcrumbs and skip link have been updated to use the
  text style link mixin
  (PR [#609](https://github.com/alphagov/govuk-frontend/pull/609))
- Add limited width inputs
  (PR [#626](https://github.com/alphagov/govuk-frontend/pull/626))
- Add details polyfill. This is automatically initialised in the main JS. (PR [#610](https://github.com/alphagov/govuk-frontend/pull/610))
- Add button polyfill. This is automatically initialised in the main JS. [#572](https://github.com/alphagov/govuk-frontend/pull/572))

 Note: Our JavaScript work is ongoing. In the next release of GOV.UK Frontend both of our script will be modularised and split into common functions. This will allow you to use the polyfills in your bundler/build pipeline. For this reason, you might want to wait until the next release before adding these polyfill scripts into your project.

🏠 Internal:
- Update check script for new components and tweak docs
  (PR [#589](https://github.com/alphagov/govuk-frontend/pull/589))
- Listen for development server on different port for tests
  (PR [#622](https://github.com/alphagov/govuk-frontend/pull/622))

- Fix date-input default example
(PR [#623](https://github.com/alphagov/govuk-frontend/pull/623))
- Ensure we're testing error-messages in date-input
(PR [#625](https://github.com/alphagov/govuk-frontend/pull/625))

- Explain npm link
(PR [#624](https://github.com/alphagov/govuk-frontend/pull/624))

- Make Sass imports less broad
  (PR [#617](https://github.com/alphagov/govuk-frontend/pull/617))

- Update project README with user research findings (PR [#617](https://github.com/alphagov/govuk-frontend/pull/615))

- Update component READMEs to use `import` statement (PR [#615](https://github.com/alphagov/govuk-frontend/pull/615))

- Use promisify util instead of manual method (PR [#639](https://github.com/alphagov/govuk-frontend/pull/639))

## 0.0.26-alpha (Breaking release)

💥 Breaking changes:

- The error summary component now has a default bottom margin
  (PR [#583](https://github.com/alphagov/govuk-frontend/pull/583))
- Nest components correctly
  (PR [#584](https://github.com/alphagov/govuk-frontend/pull/584))

🔧 Fixes:

- Make section break line 1px instead of 2px
(PR [#585](https://github.com/alphagov/govuk-frontend/pull/585))

🆕 New features:

- Add footer component (PR [#569](https://github.com/alphagov/govuk-frontend/pull/569))

🏠 Internal:

- Update pre-release step to check for new components
(PR [#574](https://github.com/alphagov/govuk-frontend/pull/574))
- Ensure render function does not have undefined object
  (PR [#587](https://github.com/alphagov/govuk-frontend/pull/587))
- Fix components relying on global builds
  (PR [#588](https://github.com/alphagov/govuk-frontend/pull/588))

## 0.0.25-alpha (Breaking release)

💥 Breaking changes:

- The colour variable `$govuk-fuschia` has been replaced with a new variable
  with the correct spelling (`$govuk-fuchsia`) – thanks to
  [@charlesrt](https://github.com/charlesrt) for reporting.
  (PR [#571](https://github.com/alphagov/govuk-frontend/pull/571))

🆕 New features:

- The input macro now accepts a `type` which allows you to override the default
  type="text" (PR [#568](https://github.com/alphagov/govuk-frontend/pull/568))

🔧 Fixes:
- The transparent outline has been removed from the button, as it already has
  a transparent border which is visible when overriding colours in the browser
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- Redundant duplication on the start button variant has been removed as it is
  inherited from the main .govuk-c-button class
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- A fix to remove a black border from buttons in IE7 has been removed as we are
  not targeting IE7 for GOV.UK Frontend
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- The date input component now sets `type="number"` and `pattern="[0-9]*"` to
  match the previous implementation in Elements
  (PR [#568](https://github.com/alphagov/govuk-frontend/pull/568))

🏠 Internal:
- The logic to determine button text colour automatically has been removed and
  replaced with a new variable $govuk-button-text-colour
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- The button component now uses the focusable mixin
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- The button component Sass has been restructured so that e.g. pseudo-selectors
  are consistently nested within their parents
  (PR [#552](https://github.com/alphagov/govuk-frontend/pull/552))
- Fixes for the release process
(PR [#567](https://github.com/alphagov/govuk-frontend/pull/567))
- Add HTML5-shiv to review app
(PR [#575](https://github.com/alphagov/govuk-frontend/pull/575))

## 0.0.24-alpha (Breaking release)

💥 Breaking changes:

- Namespace existing mixins and functions ( PR [#557](https://github.com/alphagov/govuk-frontend/pull/557))
- The class `.govuk-section-break__visible` has been renamed to
  `.govuk-section-break--visible` as it is a modifier, not an element.
  (PR [#547](https://github.com/alphagov/govuk-frontend/pull/547))
- Simplify `src/` folder structure, remove tree and string manipulations from
gulp tasks (PR [#545](https://github.com/alphagov/govuk-frontend/pull/545))

🆕 New features:

- A new variable `$govuk-input-border-colour` has been introduced to define the
  border colour for inputs. The Input, Select and Textarea components have been
  updated to use it.
  (PR [#551](https://github.com/alphagov/govuk-frontend/pull/551))

🔧 Fixes:
- Removes media query display on body from compiled CSS
  (PR [#560](https://github.com/alphagov/govuk-frontend/pull/560))

- Fieldset legends now correctly use 'full black' text colour when printed
  (PR [#544](https://github.com/alphagov/govuk-frontend/pull/544))
- Radio and Checkbox components now explicitly use currentColor for their
  borders, rather than relying on inheriting it
  (PR [#551](https://github.com/alphagov/govuk-frontend/pull/551))

🏠 Internal:

- The 'prose scope' has been updated to extend only placeholder classes. The
  corresponding classes the prose scope extends have been updated to provide a
  placeholder class and separately create the concrete class. This allows us
  to be specific about which occurrences of the class are meant to be extended.
  (PR [#550](https://github.com/alphagov/govuk-frontend/pull/550))
- The sass-lint config has been updated to prevent the use of `@extend` with
  concrete classes.
  (PR [#550](https://github.com/alphagov/govuk-frontend/pull/550))
- Release process has been streamlined with fewer steps
  (PR [#553](https://github.com/alphagov/govuk-frontend/pull/553))
- Update `govuk-section-break__visible` new class name `govuk-section-break--visible` in the     review app's Typography page.
  (PR [#566](https://github.com/alphagov/govuk-frontend/pull/566))

## 0.0.23-alpha (Breaking release)

💥 Breaking changes:

- Remove Cookie-banner and Previous-next components
  (PR [#488](https://github.com/alphagov/govuk-frontend/pull/488), PR [#523](https://github.com/alphagov/govuk-frontend/pull/523))
- Remove unused colours from the 'applied' colour palette:
  (PR [#525](https://github.com/alphagov/govuk-frontend/pull/525))
  - `$govuk-panel-colour`
  - `$govuk-canvas-colour`
  - `$govuk-highlight-colour`
  - `$govuk-page-colour`
  - `$govuk-discovery-colour`
  - `$govuk-alpha-colour`
  - `$govuk-beta-colour`
  - `$govuk-live-colour`
  - `$govuk-error-background`
  - `$govuk-proposition-border`
  - `$govuk-proposition-active-nav`
  - `$govuk-footer-background`
  - `$govuk-footer-border-top`
  - `$govuk-footer-link`
  - `$govuk-footer-link-hover`
  - `$govuk-footer-text`
- Rename `$govuk-button-colour-darken-15` to `$govuk-button-shadow-colour` to
  avoid tying it to a particular colour.
  (PR [#525](https://github.com/alphagov/govuk-frontend/pull/525))

🆕 New features:

- Button hover colour now has a semantic Sass name: $govuk-button-hover-colour
  (PR [#406](https://github.com/alphagov/govuk-frontend/pull/406))
- A new link variant has been added which removes the visited state, for cases
  where distinguishing between visited and unvisited links is not helpful
  (PR [#446](https://github.com/alphagov/govuk-frontend/pull/446))
- The responsive spacing and typography mixins will now throw an error if you
  try to use them with anything other than a spacing or font map respectively.
  (PR [#447](https://github.com/alphagov/govuk-frontend/pull/447))
- Add thematic break to typography and prose scope. This class is added to an
  `<hr>`, adds margin (xl, l and m). There is also an option to make the `<hr>`
  border visible or invisible. (PR [#483](https://github.com/alphagov/govuk-frontend/pull/483))

🔧 Fixes:

- Remove double margin from Date input component
  (PR [#451](https://github.com/alphagov/govuk-frontend/pull/451))
- Add top margin for nested lists (PR [#464](https://github.com/alphagov/govuk-frontend/pull/464))
- Remove regular font weight from link styles (PR [#469](https://github.com/alphagov/govuk-frontend/pull/469))
- Remove redundant 'govuk-c-border' div from the details component
  (PR [#481](https://github.com/alphagov/govuk-frontend/pull/481))
- Add `govuk-c-select--error` modifier class to the select component instead of relying on `govuk-c-input--error` (PR [#506](https://github.com/alphagov/govuk-frontend/pull/506))
- Allow error message and hint text to be passed to a select component without requiring a label parameter (PR [#506](https://github.com/alphagov/govuk-frontend/pull/506))
- Define size of inputs etc in `px` rather than `em`. (PR [#491](https://github.com/alphagov/govuk-frontend/pull/491))
- Remove scope=row attribute from non-th elements (PR [527](https://github.com/alphagov/govuk-frontend/pull/527))
- Form components and fieldset now include `govuk-o-form-group` that sets left
border for errors and a bottom margin. Add example of form errors to preview app
(PR [#591](https://github.com/alphagov/govuk-frontend/pull/591))

🏠 Internal:

- Replace Mocha/Chai with Jest, re-enable task tests, add back-link component.
  Special thanks to [@htmlandbacon](https://github.com/htmlandbacon) and [@tyom](https://github.com/tyom) for sharing their approaches.
  (PR [#455](https://github.com/alphagov/govuk-frontend/pull/455))
- Add example of nested lists to typography and prose scope in review app (PR [#464](https://github.com/alphagov/govuk-frontend/pull/464))
- Add tests for tag component (PR [#457](https://github.com/alphagov/govuk-frontend/pull/457))
- Add tests for button component (PR [#461](https://github.com/alphagov/govuk-frontend/pull/461))
- Add tests for breadcrumbs component (PR [#461](https://github.com/alphagov/govuk-frontend/pull/461))
- Add tests for details component (PR [#480](https://github.com/alphagov/govuk-frontend/pull/480))
- Add tests for warning text component (PR [#479](https://github.com/alphagov/govuk-frontend/pull/479))
- Add tests for table component (PR [#472](https://github.com/alphagov/govuk-frontend/pull/472))
- Add tests for error-summary component (PR [#489](https://github.com/alphagov/govuk-frontend/pull/489))
- Add tests for radios component (PR [#476](https://github.com/alphagov/govuk-frontend/pull/476))
- Add tests for input component (PR [#478](https://github.com/alphagov/govuk-frontend/pull/478))
- Add tests for date-input component (PR [#495](https://github.com/alphagov/govuk-frontend/pull/495))
- Add tests for textarea component (PR [#497](https://github.com/alphagov/govuk-frontend/pull/497))
- Add tests for panel component (PR [#500](https://github.com/alphagov/govuk-frontend/pull/500))
- Add tests for skip-link component (PR [#498](https://github.com/alphagov/govuk-frontend/pull/498))
- Add tests for file-upload component (PR [#504](https://github.com/alphagov/govuk-frontend/pull/504))
- Add tests for error-message component (PR [#507](https://github.com/alphagov/govuk-frontend/pull/507))
- Add tests for phase-banner component (PR [#505](https://github.com/alphagov/govuk-frontend/pull/505))
- Add tests for label component component (PR [#508](https://github.com/alphagov/govuk-frontend/pull/508))
- Add tests for fieldset component (PR [#509](https://github.com/alphagov/govuk-frontend/pull/509))
- Add tests for select component (PR [#506](https://github.com/alphagov/govuk-frontend/pull/506))
- Add tests for checkboxes component (PR [#513](https://github.com/alphagov/govuk-frontend/pull/513))
- Add tests to make sure the examples pages render without errors [#523](https://github.com/alphagov/govuk-frontend/pull/523)
- Add correct links to the guidance in the Design System in component READMEs
  (PR [#528](https://github.com/alphagov/govuk-frontend/pull/528))

## 0.0.22-alpha (Breaking release)

💥 Breaking changes:

- The link styles in the core layer no longer style `a` elements directly, but
  instead provide a `govuk-link` class which you will need to apply to links
  individually. (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))
- The link component has been removed from Frontend as the link styles have
  been moved to the core
  (PR [#431](https://github.com/alphagov/govuk-frontend/pull/431))
- Rename `legal-text` argument accepted by `legal-text` component to `text` (PR [#431](https://github.com/alphagov/govuk-frontend/pull/432))
- Rename `legal-text` component to `warning-text` (PR [#431](https://github.com/alphagov/govuk-frontend/pull/432))

🆕 New features:

- The prose scope has been extended to style links, which means links within the
  scope do not need the `govuk-link` class applied.
  (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))
- The muted link variant from the link component is now available as a core
  class (`govuk-link--muted`).
  (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))

🔧 Fixes:

- The error summary component allows users to pass HTML for an entry in the list
  again. (PR [#428](https://github.com/alphagov/govuk-frontend/pull/428))
- Error list entries in the error summary component no longer get wrapped in
  links when no `href` is provided.
  (PR [#428](https://github.com/alphagov/govuk-frontend/pull/428))
- Remove redundant 'resets' for link print styles
  (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))
- The back link, breadcrumbs, error summary, previous / next and skip link
  components have been updated to include explicit link styling, as they
  previously relied on the global link styles.
  (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))
- Adjust `warning-text` icon by 1px for New Transport

🏠 Internal:

- Add prose scope example (PR [#429](https://github.com/alphagov/govuk-frontend/pull/429))
- Links within the review app and the examples have been updated to use the
  `govuk-link` class.
  (PR [#427](https://github.com/alphagov/govuk-frontend/pull/427))
- Improve documentation around publishing (PR [#430](https://github.com/alphagov/govuk-frontend/pull/430))
- Improve documentation around contributing (PR [#433](https://github.com/alphagov/govuk-frontend/pull/433))
- Remove readme content from review app (PR [#482](https://github.com/alphagov/govuk-frontend/pull/482))

## 0.0.21-alpha (Breaking release)
Skipped 0.0.20-alpha due to difficulties with publishing.

💥 Breaking changes:

- Rename ‘govuk-body-lede’ to ‘govuk-body-lead’. (PR [#405](https://github.com/alphagov/govuk-frontend/pull/405))
- Pluralise radio component (PR [#388](https://github.com/alphagov/govuk-frontend/pull/388))
- Pluralise checkbox component (PR [#384](https://github.com/alphagov/govuk-frontend/pull/384))

🆕 New features:

- Add `width` classes, which were based on `form-control` classes that were
specific to form control in Elements. (PR [#413](https://github.com/alphagov/govuk-frontend/pull/413))

🔧 Fixes:

- Make buttons 40px high including box shadow (PR [#416](https://github.com/alphagov/govuk-frontend/pull/416))
- Fix focus outline style in Chrome and Safari (PR [#414](https://github.com/alphagov/govuk-frontend/pull/414))
- Remove contributors list from template, fix template markup and update README files (PR [#403](https://github.com/alphagov/govuk-frontend/pull/403))
- Generate breadcrumb chevrons using pseudo-elements (PR [#407](https://github.com/alphagov/govuk-frontend/pull/407))
- Fix undefined classes in date input macro (PR [#410](https://github.com/alphagov/govuk-frontend/pull/410))
- Add documentation for typography helpers / core, simplify syntax (PR [#400](https://github.com/alphagov/govuk-frontend/pull/400))
- Add adjacent styles for headings after lists (PR [#408](https://github.com/alphagov/govuk-frontend/pull/408))
- Allow line height to be overridden in typography helpers (PR [#404](https://github.com/alphagov/govuk-frontend/pull/404))
