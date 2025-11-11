# Changelog

For advice on how to use these release notes see [our guidance on staying up to date with changes](https://frontend.design-system.service.gov.uk/staying-up-to-date/).

## Unreleased

### Breaking changes

#### Use the `govuk-applied-colour` function to access applied colours in Sass

We've restructured our applied colours in Sass, changing how you can access applied colours for use in your own code.

If you were using the value of one of the variables in [`settings/_colours-applied.scss`](https://github.com/alphagov/govuk-frontend/blob/v5.13.0/packages/govuk-frontend/src/govuk/settings/_colours-applied.scss), use the new `govuk-applied-colour` function to output a [`var()` call](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var) referencing the colour.

```scss
.a-component {
  // color: $govuk-text-colour
  color: govuk-applied-colour(text);
}
```

| Removed Sass variable               | `govuk-applied-colour` call                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `$govuk-brand-colour`               | `govuk-applied-colour(brand)`                                                                                      |
| `$govuk-text-colour`                | `govuk-applied-colour(text)`                                                                                       |
| `$govuk-template-background-colour` | `govuk-applied-colour(template-background)`                                                                        |
| `$govuk-body-background-colour`     | `govuk-applied-colour(body-background)`                                                                            |
| `$govuk-print-text-colour`          | `govuk-applied-colour(text)`<br>**Note**: The `text` colour will automatically switch to pure black when printing. |
| `$govuk-secondary-text-colour`      | `govuk-applied-colour(secondary-text)`                                                                             |
| `$govuk-focus-colour`               | `govuk-applied-colour(focus)`                                                                                      |
| `$govuk-focus-text-colour`          | `govuk-applied-colour(focus-text)`                                                                                 |
| `$govuk-error-colour`               | `govuk-applied-colour(error)`                                                                                      |
| `$govuk-success-colour`             | `govuk-applied-colour(success)`                                                                                    |
| `$govuk-border-colour`              | `govuk-applied-colour(border)`                                                                                     |
| `$govuk-input-border-colour`        | `govuk-applied-colour(input-border)`                                                                               |
| `$govuk-hover-colour`               | `govuk-applied-colour(hover)`                                                                                      |
| `$govuk-link-colour`                | `govuk-applied-colour(link)`                                                                                       |
| `$govuk-link-visited-colour`        | `govuk-applied-colour(link-visited)`                                                                               |
| `$govuk-link-hover-colour`          | `govuk-applied-colour(link-hover)`                                                                                 |
| `$govuk-link-active-colour`         | `govuk-applied-colour(link-active)`                                                                                |

#### Use `$govuk-applied-colours` to redefine applied colours

We've restructured our applied colours in Sass, changing how you can redefine applied colours.

If you were redefining a custom value for the applied colour before importing GOV.UK Frontend, you can still do this by assigning a map of the colours you want to change to the `$govuk-applied-colours` variable.

```scss
// This will be merged with the default applied colours of GOV.UK Frontend
// redefining the 'brand' colour to `rebeccapurple`
$govuk-applied-colour: (
  brand: rebeccapurple
);
@import 'pkg:govuk-frontend';
```

This also works if you use `@use` to load GOV.UK Frontend:

```scss
// This will be merged with the default applied colours of GOV.UK Frontend
// redefining the 'brand' colour to `rebeccapurple`
@use 'pkg:govuk-frontend' with (
  $govuk-applied-colour: (
    brand: rebeccapurple
  )
);
```

Note that you can only redefine existing applied colours, not add new applied colours. This is to make sure there's a clear separation between colours from GOV.UK Frontend and colours from your own project.

#### We've ended support for Ruby Sass and LibSass

GOV.UK Frontend no longer supports Ruby Sass and LibSass. You must update your project to [Dart Sass](https://sass-lang.com/dart-sass/) to continue using GOV.UK Frontend.

Support for Ruby Sass ended in 2019, and LibSass was deprecated in 2020. A number of Sass implementations, including Node Sass, SassC and sass-rs, are dependent upon LibSass. GOV.UK Frontend also no longer supports these implementations.

The Sass developers have provided guides for:

- [migrating from Ruby Sass to Dart Sass](https://sass-lang.com/ruby-sass/)
- [migrating from LibSass to Dart Sass](https://sass-lang.com/blog/libsass-is-deprecated/#how-do-i-migrate)

This change was introduced in [pull request #6311: Remove support for Ruby Sass and LibSass](https://github.com/alphagov/govuk-frontend/pull/6311).

#### We've set our minimum Dart Sass version to 1.79

GOV.UK Frontend will no longer support services using Dart Sass versions earlier than 1.79. If you're using an earlier version of Dart Sass, your service's Sass may break, as GOV.UK Frontend may use features in Dart Sass that are not available in earlier versions.

If you're using an earlier version of Dart Sass than 1.79, see [the Dart Sass releases](https://github.com/sass/dart-sass/releases) and follow their release notes to upgrade to version 1.79 or later to continue using GOV.UK Frontend.

This change was introduced in [pull request #6366: Update Dart Sass tests minimum version to 1.79.0](https://github.com/alphagov/govuk-frontend/pull/6366)

#### Update references to `govuk-pagination__item--ellipses` class from the HTML for the Pagination component

The `govuk-pagination__item--ellipses` class was deprecated in [GOV.UK Frontend 5.13.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.13.0) and has now been removed.

If you are not using Nunjucks macros, you should update instances of this class to use the `govuk-pagination__item--ellipsis` class instead.

Users of Nunjucks macros don't need to change anything.

We introduced this change in [pull request #6382: Remove deprecated `govuk-pagination__item--ellipses` class](https://github.com/alphagov/govuk-frontend/pull/6382).

#### Update the class on the GOV.UK logo link in the Header component

We've updated the value of the `class` attribute on the link to the GOV.UK homepage to `govuk-header__homepage-link`.

If you're not using Nunjucks macros, you'll need to update this class manually.

```html
<!-- Before -->
<a href="//gov.uk" class="govuk-header__link govuk-header__link--homepage">
  [...]
</a>

<!-- After -->
<a href="//gov.uk" class="govuk-header__homepage-link">
  [...]
</a>
```

This change was introduced in [pull request #6423: Remove service name and navigation from Header component](https://github.com/alphagov/govuk-frontend/pull/6423)

#### Stop including the service name and navigation items in the Header component

We deprecated including the service name and navigation in the Header in [GOV.UK Frontend 5.9.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.9.0).

We've now removed this functionality.

Service names and service-level navigation should now use the [Service navigation component](https://design-system.service.gov.uk/components/service-navigation/).

This change was introduced in [pull request #6423: Remove service name and navigation from Header component](https://github.com/alphagov/govuk-frontend/pull/6423)

#### Stop importing GOV.UK Frontend's Sass using `all`

GOV.UK Frontend's `all.scss` file and partials were deprecated in [GOV.UK Frontend 5.8.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.8.0) and were replaced by equivalent [Sass `index` files](https://sass-lang.com/documentation/at-rules/use/#index-files). We've now removed the files entirely.

With the move to Dart Sass, you can now simplify how you import Sass from GOV.UK Frontend.

```scss
// Before
@import "govuk/all";
@import "govuk/components/all"

// After
@import "govuk";
@import "govuk/components"
```

This change was introduced in [pull request #6412: Remove `all.scss` file and partials](https://github.com/alphagov/govuk-frontend/pull/6412).

#### Update to the new organisation colour palette

We updated the organisation colour palette in [GOV.UK Frontend 5.9.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.9.0).

The new palette was initially opt-in using the `$govuk-new-organisation-colours` feature flag. The updated palette is now the only palette available, so you can remove the feature flag from your code.

As part of this work, we removed the deprecated `$websafe` parameter of the `govuk-organisation-colour` function. Use the `$contrast-safe` parameter when calling the function instead.

This change was introduced in [pull request #6390: Remove legacy organisation colour palette](https://github.com/alphagov/govuk-frontend/pull/6390).

#### Update references to deprecated organisations in the organisation colour palette

We've removed deprecated organisations from the organisation colour palette. These organisations had ceased to exist or had been renamed prior to the start of 2025.

This change was introduced in [pull request #6426: Remove deprecated organisation colours](https://github.com/alphagov/govuk-frontend/pull/6426).

#### Stop using the `govuk-responsive-typography` Sass mixin

We renamed the `govuk-responsive-typography` Sass mixin to `govuk-font-size` in [GOV.UK Frontend 5.1.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.1.0). We've now removed the previous name entirely.

This change was introduced in [pull request #6387: Remove `govuk-responsive-typography` mixin](https://github.com/alphagov/govuk-frontend/pull/6387).

#### Stop using the `--govuk-frontend-breakpoint` CSS custom properties

We renamed CSS custom properties starting `--govuk-frontend-breakpoint` to begin with `--govuk-breakpoint` in [GOV.UK Frontend 5.11.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.11.0). We've now removed the previous names for these properties.

This change was introduced in [pull request #6385: Remove `--govuk-frontend-breakpoint` CSS properties](https://github.com/alphagov/govuk-frontend/pull/6385).

#### Remove references to the `$govuk-show-breakpoints` feature flag

The `$govuk-show-breakpoints` feature flag was deprecated and rendered non-operational by the media query changes introduced in [GOV.UK Frontend 5.13.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.13.0).

This flag was only intended to be used as a local development aid and not used on production services, and we've now removed it.

This change was introduced in [pull request #6384: Remove `$govuk-show-breakpoints` feature flag](https://github.com/alphagov/govuk-frontend/pull/6384).

#### Stop using the `element` parameter of the Button component

The `element` parameter of the Button component Nunjucks macro was deprecated in [GOV.UK Frontend 5.1.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.1.0), and we've now removed it.

The component is now output as a link if the `href` parameter is set. Otherwise, it's a `button` element.

This means it's no longer possible to use `input` elements for buttons. Buttons using `input` are less flexible than `button` elements in terms of styling and content allowed within them, so we want to avoid using them.

This change was introduced in [pull request #6383: Remove element parameter from Button component](https://github.com/alphagov/govuk-frontend/pull/6383).

#### Stop using `$govuk-canvas-background-colour`

We renamed `$govuk-canvas-background-colour` to `$govuk-template-background-colour` in [GOV.UK Frontend 5.10.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.10.0). We've now removed the previous variable entirely.

This change was introduced in [pull request #6413: Remove `$govuk-canvas-background-colour`](https://github.com/alphagov/govuk-frontend/pull/6413)

#### Stop using St. Edward's Crown and the `useTudorCrown` parameter

GOV.UK updated its logo to replace the St. Edward's Crown with the Tudor Crown in [GOV.UK Frontend 5.1.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.1.0). The Tudor Crown became the default in [5.2.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.2.0), which is when the option to switch between crowns was deprecated.

We've now removed the Header component's `useTudorCrown` parameter and assets relating to the St. Edward's Crown.

This change was introduced in [pull request #6414: Remove `useTudorCrown` parameter and St. Edwards crown assets](https://github.com/alphagov/govuk-frontend/pull/6414)

#### Stop using `govuk-body-xs`, `govuk-!-font-size-14` and '14' as a possible font size in `govuk-font`

We deprecated 14 as a point on our [type scale](https://design-system.service.gov.uk/styles/type-scale/) in [GOV.UK Frontend 5.1.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.1.0). We've now removed it as an option, along with the typography classes that used it:

- `govuk-body-xs`
- `govuk-!-font-size-14`

This change was introduced in [pull request #6417: Remove 14 from the type scale](https://github.com/alphagov/govuk-frontend/pull/6417)

#### We've updated our responsive type scale

We updated our responsive type scale behind the feature flag `$govuk-new-typography-scale` in [GOV.UK Frontend 5.2.0](https://github.com/alphagov/govuk-frontend/releases/tag/v5.2.0).

These type scale changes are now on by default, and we've removed the `$govuk-new-typography-scale` feature flag.

This change was introduced in [pull request #6421: Turn the new type scale on by default](https://github.com/alphagov/govuk-frontend/pull/6421)

### Recommended changes

#### Replace use of `govuk-text-colour` mixin with `color: govuk-applied-colour(text)`

We've updated how the text colour changes to pure black when printing. This change allows to simplify
how the text colour is applied to your CSS ruleset, which can now be a single `color` declaration rather
than a mixin call.

Replace your `@include govuk-text-colour;` mixin calls with `color: govuk-applied-colour(text)`,
as we'll be removing the `govuk-text-colour` mixin in a future breaking release.

This change was introduced in [pull request ...: ](https://github.com/alphagov/govuk-frontend/pull/....)

#### Rename turquoise and pink coloured tags

We've renamed 2 of the Tag component's colour modifier classes to be in line with GOV.UK Frontend's new colour palette:

- `govuk-tag--turquoise` is now `govuk-tag--teal`
- `govuk-tag--pink` is now `govuk-tag--magenta`

Rename your tags to reflect these changes, as we'll be removing `govuk-tag--turquoise` and `govuk-tag--pink` in a future breaking release.

This change was introduced in [pull request #6416: Deprecate turquoise and pink tag colour modifiers](https://github.com/alphagov/govuk-frontend/pull/6416)

#### Check that the GOV.UK logo links to the GOV.UK homepage

We've updated the default value of `homepageUrl` to point to the GOV.UK homepage.

The previous default value pointed at the root of the current domain. On services, this caused the GOV.UK logo to link to the homepage of the service, rather than the GOV.UK homepage.

Unless you operate a GOV.UK branded product, the GOV.UK logo should always link to the homepage of GOV.UK. Use the [Service navigation component](https://design-system.service.gov.uk/components/service-navigation/) to provide a link to a local homepage.

This change was introduced in [pull request #6418: Update default `homepageUrl` to point to GOV.UK homepage](https://github.com/alphagov/govuk-frontend/pull/6418)

### Fixes

#### Tags now have borders for improved legibility

We've reviewed the design of the tag component in response to changes from the new GOV.UK brand colour palette.

Tags now have a 1px border, with the colour based on the background colour of the tag. This makes tags easier to distinguish against white backgrounds.

This change was introduced in [pull request #6379: Add borders to tags](https://github.com/alphagov/govuk-frontend/pull/6379)

#### Other fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5311 Remove non-operational value parameter from file upload component](https://github.com/alphagov/govuk-frontend/pull/5311)

## v6.0.0-beta.0 (Beta breaking release)

To install this version with npm, run `npm install govuk-frontend@6.0.0-beta.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### Breaking changes

#### Use GOV.UK brand colours

We’ve updated GOV.UK Frontend to use the web palette defined by the [GOV.UK Brand guidelines](https://www.gov.uk/government/publications/govuk-brand-guidelines), as well as the 25% and 50% shades when they exist for a given colour.

##### Check your service’s colours

Our components now use the colours of the GOV.UK web palette. If you’re using any custom colours, you’ll need to make sure they still work well with the new web palette in terms of accessibility and design. If possible, you should use the GOV.UK brand colours instead.

##### Use the `govuk-colour` function to access GOV.UK brand colours

You can use the `govuk-colour` function to fetch colours from the GOV.UK web palette. This function allows you to access both primary colours and their variants, such as tints and shades.

When the function receives only the colour name, it’ll return the primary variant of that colour. For example:

```scss
$app-colour: govuk-colour(‘blue’); // Returns the ‘Primary blue’ colour
```

Use the new `$variant` parameter of the `govuk-colour` function to access the tints and shades of a colour defined by the GOV.UK brand.

```scss
$component-colour: govuk-colour(‘red’, $variant: ‘tint-25’) // Returns the “Red tint 25%” colour
$other-component-colour: govuk-colour(‘green’, $variant: ‘shade-50’) // Returns the “Green shade 50%” colour
```

You can find the list of possible colour names in the GOV.UK brand guidelines.

##### If you’re already using the `govuk-colour` function

If you’re already using the `govuk-colour` function in your project, colours from the GOV.UK web palette will now be applied automatically when you call the function.

If the colour name exists in the GOV.UK web palette, the function returns the primary variant for that colour. The colour remains the same for`‘blue`, `yellow` and `orange`, but the following colours will see a slight change:

| Colour   | Old colour hex | New colour hex |
| -------- | -------------- | -------------- |
| `green`  | `#00703c`      | `#11875a`      |
| `red`    | `#d4351c`      | `#ca3535`      |
| `purple` | `#4c2c92`      | `#54319f`      |
| `brown`  | `#b58840`      | `#99704a`      |

Some of the GOV.UK brand colours are slightly different from the colours that were returned by `govuk-colour` before GOV.UK Frontend v6.0. That means you’ll need to check that the colours still work correctly where you applied them in your project, in terms of accessibility and design.

To make it easier to upgrade, in cases where a colour name does not exist in the GOV.UK brand palette (for example, `bright-purple`), the function will return the closest colour from the GOV.UK brand palette but produce a deprecation warning. We recommend that you update your calls to `govuk-colour` with deprecated colour names to use a colour from the GOV.UK brand, such as the one suggested in the deprecation warning message.

`govuk-colour` now maps colour names that no longer exist from the old palette to the new palette, as described in the following table. You can use this list to assess and update your use of `govuk-colour`.

| Old colour name | Old colour hex | New colour name   | New colour hex |
| --------------- | -------------- | ----------------- | -------------- |
| `light-pink`    | `#f499be`      | Magenta tint 50%  | `#e59abe`      |
| `pink`          | `#d53880`      | Primary magenta   | `#ca357c`      |
| `light-green`   | `#85994b`      | Green tint 25%    | `#4da583`      |
| `turquoise`     | `#28a197`      | Primary teal      | `#158187`      |
| `light-blue`    | `#5694ca`      | Blue tint 25%     | `#5694ca`      |
| `dark-blue`     | `#003078`      | Blue shade 50%    | `#0f385c`      |
| `light-purple`  | `#6f72af`      | Purple tint 25%   | `#7f65b7`      |
| `bright-purple` | `#912b88`      | Magenta shade 25% | `#98285d`      |
| `dark-grey`     | `#505a5f`      | Black tint 25%    | `#484949`      |
| `mid-grey`      | `#b1b4b6`      | Black tint 80%    | `#cecece`      |
| `light-grey`    | `#f3f2f1`      | Black tint 95%    | `#f3f3f3`      |

##### If you’re using the `$govuk-colours` variable

We’ve removed the `$govuk-colours` variable from GOV.UK Frontend, to only allow access to the colours through the `govuk-colour` function.

If you were accessing the GOV.UK Frontend colours with `map-get($govuk-colours, <COLOUR_NAME>)`, you’ll now need to use `govuk-colour(<COLOUR_NAME>)`.

We made these changes in the following pull requests:

- [#6326: Use brand palette through `govuk-colour`](https://github.com/alphagov/govuk-frontend/pull/6326)
- [#6335: Update button colours to use `govuk_palette`](https://github.com/alphagov/govuk-frontend/pull/6335)
- [#6336: Update tag colours to use `govuk_palette`](https://github.com/alphagov/govuk-frontend/pull/6336)
- [#6337: Update file upload colours to use `govuk_palette`](https://github.com/alphagov/govuk-frontend/pull/6337)

#### Stop using the `$legacy` parameter in the `govuk-colour` function

We’ve removed the `$legacy` parameter of the `govuk-colour` function, so you should remove any usage of it.

We made this change in [pull request #6326: Use brand palette through `govuk-colour`](https://github.com/alphagov/govuk-frontend/pull/6326).

#### Stop using `govuk-tint` and `govuk-shade`

The `govuk-tint` and `govuk-shade` functions for applying tints and shades to colours by percentage are now deprecated and no longer work. They now only return the colour you pass to them, as well as a Sass warning. We’ll remove the `govuk-tint` and `govuk-shade` functions in the final release of 6.0.0.

We recommend replacing them with tints and shades from the new GOV.UK colour palette that are as close as possible to your existing implementation.

We made this change in [pull request #6341: Deactivate `govuk-tint` and `govuk-shade` functions](https://github.com/alphagov/govuk-frontend/pull/6341).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#6338: Fix hover state on focused small radios](https://github.com/alphagov/govuk-frontend/pull/6338)

## v5.13.0 (Feature release)

### New features

#### Use Sass functions to create custom media queries

We've added new Sass functions to help write `@media` and `@container` queries, mixins and functions whilst still using GOV.UK Frontend's `$govuk-breakpoints` setting.

You can create `min-width` and `max-width` queries using the `govuk-from-breakpoint` and `govuk-until-breakpoint` functions:

```scss
.element {
  color: red;

  @media #{govuk-from-breakpoint(mobile)} and #{govuk-until-breakpoint(desktop)} {
    color: blue;
  }
}
```

You can get the configured value of a breakpoint using `govuk-breakpoint-value`:

```scss
@function wider-than-tablet($width) {
  @return $width > govuk-breakpoint-value(tablet);
}
```

Each of these functions allows for passing a custom breakpoint map. This can be useful if a particular component needs to change layout at different dimensions to the rest of the site and for authoring `@container` queries.

```scss
$component-breakpoints: (
  small: 300px,
  medium: 500px,
  large: 750px
);

.element {
  color: red;

  @container #{govuk-from-breakpoint(small, $component-breakpoints)} {
    color: blue;
  }
}
```

We've rewritten the internals of the `govuk-media-query` mixin to make use of these new functions. The rewritten mixin should work identically and return the same CSS as the previous version, but you may want to make sure that your existing media queries work as expected.

We made these changes in the following pull requests:

- [#6264: Add media query functions](https://github.com/alphagov/govuk-frontend/pull/6264).
- [#6265: Rewrite `govuk-media-query`, remove dependency on `sass-mq`](https://github.com/alphagov/govuk-frontend/pull/6265).

### Recommended changes

#### Rename ellipses HTML class in pagination to ellipsis

Within the pagination component, change the `govuk-pagination__item--ellipses` class to `govuk-pagination__item--ellipsis`.

We introduced this change in [pull request #5882: Rename ellipses html class to ellipsis](https://github.com/alphagov/govuk-frontend/pull/5882). Thanks to @frankieroberto for making this change.

### Fixes

- [#6223: Account for multiple attribute when enhancing a File Input](https://github.com/alphagov/govuk-frontend/pull/6223). Thanks to @deberny for reporting this issue.
- [#6297: Output deprecation warning if $govuk-show-breakpoints is true](https://github.com/alphagov/govuk-frontend/pull/6297)
- [#6304: Fix long filenames in enhanced file upload not wrapping](https://github.com/alphagov/govuk-frontend/pull/6304). Thanks to @wardt7 for reporting this issue.

## v5.12.0 (Feature release)

### New features

#### Use the `govuk-focused-form-input` mixin to style focus states for form inputs

You can now use the `govuk-focused-form-input` mixin to style the focus state in your own form input components.

Thanks to @patrickpatrickpatrick for suggesting this change.

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#6222: Fall back to the 'other' translation in older browsers that do not support `Intl.PluralRules` and remove fallback logic](https://github.com/alphagov/govuk-frontend/pull/6222)
- [#6232: Remove fieldset indentation from checkboxes and radios](https://github.com/alphagov/govuk-frontend/pull/6232) – thanks to @RichardBradley, @devkokov and @nathdolan for reporting this issue

## v5.11.2 (Fix release)

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#6138: Fix file upload being invisible when using the 'JavaScript enhanced' version with an empty label](https://github.com/alphagov/govuk-frontend/pull/6138) – thanks to @JoPintoPaul for reporting this issue
- [#6164: Fix handling of scope being null when calling `createAll()` or `initAll()`](https://github.com/alphagov/govuk-frontend/pull/6164) – thanks to @colinrotherham for reporting and fixing this issue
- [#6184: Fix thickness of underlines on previous and next pagination links in Safari](https://github.com/alphagov/govuk-frontend/pull/6184) – thanks to @frankieroberto for reporting this issue

## v5.11.1 (Fix release)

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#6047: Fix text within the inverse Service navigation variant not appearing in white](https://github.com/alphagov/govuk-frontend/pull/6047) – thanks to @peteryates for reporting this issue
- [#6084: Output hexadecimal colours for `govuk-shade` and `govuk-tint`](https://github.com/alphagov/govuk-frontend/pull/6084)

## v5.11.0 (Feature release)

### New features

#### The Service navigation component no longer uses a menu on mobile for a single link

If you're using our Nunjucks macros, the Service navigation component will no longer collapse the navigation behind a **Menu** toggle on mobile if there's only one navigation link.

You can control this behaviour using the new `collapseNavigationOnMobile` Nunjucks option.

If you're not using our Nunjucks macros, you can recreate this behaviour by omitting the **Menu** `<button>` element when there is only one navigation item.

We made this change in [pull request #6016: Don’t use menu for service nav with a single link](https://github.com/alphagov/govuk-frontend/pull/6016).

#### Add inverse styling to Service navigation for use on product pages

If you enable the GOV.UK rebrand, you can now add the `govuk-service-navigation--inverse` class to the Service navigation component to use white links on a blue background.

This allows the rebranded GOV.UK header and Service navigation components to flow seamlessly with any following components that have a blue background, as is common on [GOV.UK Digital Service Platform](https://platforms.service.gov.uk/) pages.

We made this change in [pull request #6015: Add inverse variant to Service navigation component](https://github.com/alphagov/govuk-frontend/pull/6015).

#### You'll now see a deprecation warning if you're using LibSass

If you're using the deprecated LibSass library, you'll now see this deprecation warning when compiling your Sass:

> It looks like you may be using LibSass to compile your Sass. LibSass is deprecated and will not be supported by the next major version of GOV.UK Frontend. See https://sass-lang.com/libsass/ for more information. To silence this warning, update `$govuk-suppressed-warnings` with key: "libsass"

We made this change in [pull request #5993: Warn if Sass is compiled using libsass](https://github.com/alphagov/govuk-frontend/pull/5993).

### Deprecated features

#### Replace references to CSS custom properties for breakpoints

We've renamed the CSS custom properties for breakpoints to simplify the prefix from `--govuk-frontend` to just `--govuk`.

| Old name                            | New name                   |
| ----------------------------------- | -------------------------- |
| --govuk-frontend-breakpoint-mobile  | --govuk-breakpoint-mobile  |
| --govuk-frontend-breakpoint-tablet  | --govuk-breakpoint-tablet  |
| --govuk-frontend-breakpoint-desktop | --govuk-breakpoint-desktop |

You can still use the old names, but we'll remove them in the next breaking release (GOV.UK Frontend v6.0.0).

We made this change in [pull request #6014: Simplify prefix for breakpoint custom properties](https://github.com/alphagov/govuk-frontend/pull/6014).

### Fixes

We've updated the SVG (Scalable Vector Graphics) file of the GOV.UK logo to fix some imperfections visible at high zoom levels. Thanks to @matteason for reporting this.

If you're using the `govukHeader` Nunjucks macro, you do not need to update anything. If you're not using the macro, replace the logo's SVG code in the header with the following code:

```html
<svg
  focusable="false"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 324 60"
  height="30"
  width="162"
  fill="currentcolor"
  class="govuk-header__logotype"
  aria-label="GOV.UK">
  <title>GOV.UK</title>
  <g>
    <circle cx="20" cy="17.6" r="3.7"></circle>
    <circle cx="10.2" cy="23.5" r="3.7"></circle>
    <circle cx="3.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <circle cx="43.3" cy="17.6" r="3.7"></circle>
    <circle cx="53.2" cy="23.5" r="3.7"></circle>
    <circle cx="59.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
  </g>
  <circle class="govuk-logo-dot" cx="226" cy="36" r="7.3"></circle>
  <path d="M93.94 41.25c.4 1.81 1.2 3.21 2.21 4.62 1 1.4 2.21 2.41 3.61 3.21s3.21 1.2 5.22 1.2 3.61-.4 4.82-1c1.4-.6 2.41-1.4 3.21-2.41.8-1 1.4-2.01 1.61-3.01s.4-2.01.4-3.01v.14h-10.86v-7.02h20.07v24.08h-8.03v-5.56c-.6.8-1.38 1.61-2.19 2.41-.8.8-1.81 1.2-2.81 1.81-1 .4-2.21.8-3.41 1.2s-2.41.4-3.81.4a18.56 18.56 0 0 1-14.65-6.63c-1.6-2.01-3.01-4.41-3.81-7.02s-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83a20.45 20.45 0 0 1 19.46-13.65c3.21 0 4.01.2 5.82.8 1.81.4 3.61 1.2 5.02 2.01 1.61.8 2.81 2.01 4.01 3.21s2.21 2.61 2.81 4.21l-7.63 4.41c-.4-1-1-1.81-1.61-2.61-.6-.8-1.4-1.4-2.21-2.01-.8-.6-1.81-1-2.81-1.4-1-.4-2.21-.4-3.61-.4-2.01 0-3.81.4-5.22 1.2-1.4.8-2.61 1.81-3.61 3.21s-1.61 2.81-2.21 4.62c-.4 1.81-.6 3.71-.6 5.42s.8 5.22.8 5.22Zm57.8-27.9c3.21 0 6.22.6 8.63 1.81 2.41 1.2 4.82 2.81 6.62 4.82S170.2 24.39 171 27s1.4 5.62 1.4 8.83-.4 6.02-1.4 8.83-2.41 5.02-4.01 7.02-4.01 3.61-6.62 4.82-5.42 1.81-8.63 1.81-6.22-.6-8.63-1.81-4.82-2.81-6.42-4.82-3.21-4.41-4.01-7.02-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83 2.41-5.02 4.01-7.02 4.01-3.61 6.42-4.82 5.42-1.81 8.63-1.81Zm0 36.73c1.81 0 3.61-.4 5.02-1s2.61-1.81 3.61-3.01 1.81-2.81 2.21-4.41c.4-1.81.8-3.61.8-5.62 0-2.21-.2-4.21-.8-6.02s-1.2-3.21-2.21-4.62c-1-1.2-2.21-2.21-3.61-3.01s-3.21-1-5.02-1-3.61.4-5.02 1c-1.4.8-2.61 1.81-3.61 3.01s-1.81 2.81-2.21 4.62c-.4 1.81-.8 3.61-.8 5.62 0 2.41.2 4.21.8 6.02.4 1.81 1.2 3.21 2.21 4.41s2.21 2.21 3.61 3.01c1.4.8 3.21 1 5.02 1Zm36.32 7.96-12.24-44.15h9.83l8.43 32.77h.4l8.23-32.77h9.83L200.3 58.04h-12.24Zm74.14-7.96c2.18 0 3.51-.6 3.51-.6 1.2-.6 2.01-1 2.81-1.81s1.4-1.81 1.81-2.81a13 13 0 0 0 .8-4.01V13.9h8.63v28.15c0 2.41-.4 4.62-1.4 6.62-.8 2.01-2.21 3.61-3.61 5.02s-3.41 2.41-5.62 3.21-4.62 1.2-7.02 1.2-5.02-.4-7.02-1.2c-2.21-.8-4.01-1.81-5.62-3.21s-2.81-3.01-3.61-5.02-1.4-4.21-1.4-6.62V13.9h8.63v26.95c0 1.61.2 3.01.8 4.01.4 1.2 1.2 2.21 2.01 2.81.8.8 1.81 1.4 2.81 1.81 0 0 1.34.6 3.51.6Zm34.22-36.18v18.92l15.65-18.92h10.82l-15.03 17.32 16.03 26.83h-10.21l-11.44-20.21-5.62 6.22v13.99h-8.83V13.9"></path>
</svg>
```

We made this change in [pull request #6036: Fix some wordmark artifacts at high zoom levels](https://github.com/alphagov/govuk-frontend/pull/6036).

We've also made fixes to GOV.UK Frontend in the following pull requests:

- [#6011: Derive rebranded tints from $govuk-brand-colour](https://github.com/alphagov/govuk-frontend/pull/6011) – thanks to @tamoreton for proposing this change
- [#6018: Fix layout of Service navigation in Edge when forced colours are enabled](https://github.com/alphagov/govuk-frontend/pull/6018)
- [#6019: Fix service nav wrapper not filling available width](https://github.com/alphagov/govuk-frontend/pull/6019) – thanks to @joelanman for reporting and fixing this issue

## v5.10.2 (Patch release)

To install this version with npm, run `npm install govuk-frontend@5.10.2`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/) in our documentation.

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5968: Apply header logo right padding only when menu button is visible](https://github.com/alphagov/govuk-frontend/pull/5968)

## v5.10.1 (Patch release)

To install this version with npm, run `npm install govuk-frontend@5.10.1`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/) in our documentation.

### Brand refresh fixes

We’ve fixed the colour of the dot in the refreshed GOV.UK logo as well as made some fixes to the implementation of the brand refresh in GOV.UK Frontend. We did this in the following pull requests:

- [#5962: Fix colour of refreshed GOV.UK logo's dot](https://github.com/alphagov/govuk-frontend/pull/5962)
- [#5905: Fix unnecessary whitespace after logo](https://github.com/alphagov/govuk-frontend/pull/5905)
- [#5920: Fix transparency around edge of rebranded favicon.ico](https://github.com/alphagov/govuk-frontend/pull/5920), thanks to @matteason for reporting and fixing this issue

### Other fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5908: Fix footer licence link reflowing on focus in Safari](https://github.com/alphagov/govuk-frontend/pull/5908)
- [#5919: Update deprecation warning message to make it clearer how to update to new organisation colour palette](https://github.com/alphagov/govuk-frontend/pull/5919)
- [#5953: Move organisation legacy colour palette warning into the govuk-organisation-colour mixin](https://github.com/alphagov/govuk-frontend/pull/5953)
- [#5918: Fix `govuk-font-size` mixin outputting the wrong font properties for size 14 text when compiled using libsass](https://github.com/alphagov/govuk-frontend/pull/5918), thanks to @oscarduignan for reporting this issue
- [#5896: Fix character count not having error border colour when rendered with error message](https://github.com/alphagov/govuk-frontend/pull/5896), thanks to @gunjam for fixing this issue

## v5.10.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.10.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### Prepare to use the refreshed GOV.UK brand

We’ve added features to GOV.UK Frontend to implement GOV.UK’s refreshed brand. Ahead of the brand’s go-live date of 25 June 2025, prepare your service by updating its code. You’ll then need to deploy the changes to production on 25 June 2025 or as soon after this date as possible.

These changes affect these components:

- [GOV.UK header](https://design-system.service.gov.uk/components/header/)
- [GOV.UK footer](https://design-system.service.gov.uk/components/footer/)
- [Service navigation](https://design-system.service.gov.uk/components/service-navigation/)
- [Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/)

These changes also affect the `theme-color` metadata and assets, including:

- icons
- Open Graph image
- `manifest.json`

To help you get ready, we've published this release, which includes several features to make the necessary updates across your service:

- updated markup for the GOV.UK header component (with the refreshed logo) and GOV.UK footer component (adding the crown logo)
- a new `govuk-template--rebranded` HTML class to apply updated styles from our CSS
- a new set of assets for icons, Open Graph image and page metadata

You’ll need to serve the new assets in your service. What you’ll need to do after that depends on the code in your service and if you use GOV.UK Frontend:

- with its Nunjucks page template and macros
- with its Nunjucks macros (without the page template)
- without using Nunjucks
- using the Prototype Kit

##### Add the brand refresh assets to your project

GOV.UK Frontend provides updated assets for the icons, Open Graph image and `manifest.json` to reflect the refreshed brand. These assets are available in the `dist/govuk/assets/rebrand` folder of the package.

If you [serve the assets from the GOV.UK Frontend assets folder](https://frontend.design-system.service.gov.uk/import-font-and-images-assets/#serve-the-assets-from-the-gov-uk-frontend-assets-folder-recommended), make sure the assets inside the `dist/govuk/assets/rebrand` folder are served correctly at `<YOUR-SITE-URL>/assets/rebrand`.

If you [copy the font and image files into your application](https://frontend.design-system.service.gov.uk/import-font-and-images-assets/#copy-the-font-and-image-files-into-your-application), you’ll need to copy the `dist/govuk/assets/rebrand` folder to `<YOUR-APP>/assets/rebrand`. If you use an automated task to copy the files, you may need to update your task to automatically copy our new folder.

##### Use the refreshed GOV.UK brand if you're using our Nunjucks page template

If you can edit your Nunjucks environment, you can add a `govukRebrand` [global value](https://mozilla.github.io/nunjucks/api.html#addglobal) to your environment, with a value of `true`. This global value makes the affected components use new styles for the brand refresh and display updated assets (such as the refreshed logo in the GOV.UK header component and the crown in the GOV.UK footer component).

```js
nunjucksEnv.addGlobal(‘govukRebrand’, true)
```

If you cannot edit your Nunjucks environment, you can use our new `govukRebrand` ['variable' option from our page template](https://design-system.service.gov.uk/styles/page-template/#changing-template-content), which makes:

- the Service navigation and Cookie banner components use new styles for the brand refresh
- the GOV.UK header and GOV.UK footer components rendered in the [`header` and `footer` blocks](https://design-system.service.gov.uk/styles/page-template/#exploded-view-of-the-page-template-block-areas) display updated assets (such as the refreshed logo in the GOV.UK header component and the crown in the GOV.UK footer component)

If you’ve overridden the `header` or `footer` block, see the next sections to make sure your header or footer displays the updated assets.

Use [`set`](https://mozilla.github.io/nunjucks/templating.html#set) to assign the `govukRebrand` variable a value of `true` and enable the new styles:

```nunjucks
{% set govukRebrand = true %}
```

Do not place this snippet between any `block` and `endblock` lines. Place it on a separate line.

If you’ve previously customised the template's `assetPath`, `assetUrl` or `opengraphImageUrl` options, you may need to update these to point to the location of the updated icons, Open Graph image and `manifest.json`.

##### Use the refreshed GOV.UK brand if you're using Nunjucks macro (without the page template)

You can do this by adding the updated styles for these components:

- [GOV.UK header](https://design-system.service.gov.uk/components/header/)
- [GOV.UK footer](https://design-system.service.gov.uk/components/footer/)
- [Service navigation](https://design-system.service.gov.uk/components/service-navigation/)
- [Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/)

Add the `govuk-template--rebranded` class to the `<html>` element of your page to apply the updated styles to all affected components.

Enable the refreshed GOV.UK logo by adding `rebrand: true` to the GOV.UK header component configuration.

```nunjucks
{{ govukHeader({
  rebrand: true
}) }}
```

Enable the GOV.UK crown in the GOV.UK footer component by adding`rebrand: true` to the component configuration.

```nunjucks
{{ govukFooter({
  rebrand: true
}) }}
```

Update the links to the assets. Change the HTML inside your `<head>` element to use the new file locations (from `/assets/` to `/assets/rebrand/`) and `theme-color`. Replace any existing definitions.

```html
<meta name="theme-color" content="#1d70b8">
<link rel="icon" sizes="48x48" href="/assets/rebrand/images/favicon.ico">
<link rel="icon" sizes="any" href="/assets/rebrand/images/favicon.svg" type="image/svg+xml">
<link rel="mask-icon" href="/assets/rebrand/images/govuk-icon-mask.svg" color="#1d70b8">
<link rel="apple-touch-icon" href="/assets/rebrand/images/govuk-icon-180.png">
<link rel="manifest" href="/assets/rebrand/manifest.json">
<meta property="og:image" content="<SERVICE URL>/assets/rebrand/images/govuk-opengraph-image.png">
```

##### Use the refreshed GOV.UK brand if you're not using Nunjucks

You also can use the refreshed GOV.UK brand if you’re not using Nunjucks.

Start by adding the `govuk-template--rebranded` class to the `<html>` element of your page to apply the updated styles to all affected components.

As you make changes, use the examples on our website to check your updates:

- [GOV.UK header](https://design-system.service.gov.uk/components/header/)
- [GOV.UK footer](https://design-system.service.gov.uk/components/footer/)
- [Service navigation](https://design-system.service.gov.uk/components/service-navigation/)
- [Cookie banner](https://design-system.service.gov.uk/components/cookie-banner/)

Replace the `<svg>` element in your header with the following SVG code to display the refreshed GOV.UK logo:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
  role="img"
  viewBox="0 0 324 60"
  height="30"
  width="162"
  fill="currentcolor"
  class="govuk-header__logotype"
  aria-label="GOV.UK">
  <title>GOV.UK</title>
  <g>
    <circle cx="20" cy="17.6" r="3.7"></circle>
    <circle cx="10.2" cy="23.5" r="3.7"></circle>
    <circle cx="3.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <circle cx="43.3" cy="17.6" r="3.7"></circle>
    <circle cx="53.2" cy="23.5" r="3.7"></circle>
    <circle cx="59.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
  </g>
  <circle class="govuk-logo-dot" cx="227" cy="36" r="7.3"></circle>
  <path d="M94.7,36.1c0,1.9.2,3.6.7,5.4.5,1.7,1.2,3.2,2.1,4.5.9,1.3,2.2,2.4,3.6,3.2,1.5.8,3.2,1.2,5.3,1.2s3.6-.3,4.9-.9c1.3-.6,2.3-1.4,3.1-2.3.8-.9,1.3-2,1.6-3,.3-1.1.5-2.1.5-3v-.4h-11v-6.6h19.5v24h-7.7v-5.4c-.5.8-1.2,1.6-2,2.3-.8.7-1.7,1.3-2.7,1.8-1,.5-2.1.9-3.3,1.2-1.2.3-2.5.4-3.8.4-3.2,0-6-.6-8.4-1.7-2.5-1.1-4.5-2.7-6.2-4.7-1.7-2-3-4.4-3.8-7.1-.9-2.7-1.3-5.6-1.3-8.7s.5-6,1.5-8.7,2.4-5.1,4.2-7.1c1.8-2,4-3.6,6.5-4.7s5.4-1.7,8.6-1.7,4,.2,5.9.7c1.8.5,3.5,1.1,5.1,2,1.5.9,2.9,1.9,4,3.2,1.2,1.2,2.1,2.6,2.8,4.1l-7.7,4.3c-.5-.9-1-1.8-1.6-2.6-.6-.8-1.3-1.5-2.2-2.1-.8-.6-1.7-1-2.8-1.4-1-.3-2.2-.5-3.5-.5-2,0-3.8.4-5.3,1.2s-2.7,1.9-3.6,3.2c-.9,1.3-1.7,2.8-2.1,4.6s-.7,3.5-.7,5.3v.3h0ZM152.9,13.7c3.2,0,6.1.6,8.7,1.7,2.6,1.2,4.7,2.7,6.5,4.7,1.8,2,3.1,4.4,4.1,7.1s1.4,5.6,1.4,8.7-.5,6-1.4,8.7c-.9,2.7-2.3,5.1-4.1,7.1s-4,3.6-6.5,4.7c-2.6,1.1-5.5,1.7-8.7,1.7s-6.1-.6-8.7-1.7c-2.6-1.1-4.7-2.7-6.5-4.7-1.8-2-3.1-4.4-4.1-7.1-.9-2.7-1.4-5.6-1.4-8.7s.5-6,1.4-8.7,2.3-5.1,4.1-7.1c1.8-2,4-3.6,6.5-4.7s5.4-1.7,8.7-1.7h0ZM152.9,50.4c1.9,0,3.6-.4,5-1.1,1.4-.7,2.7-1.7,3.6-3,1-1.3,1.7-2.8,2.2-4.5.5-1.7.8-3.6.8-5.7v-.2c0-2-.3-3.9-.8-5.7-.5-1.7-1.3-3.3-2.2-4.5-1-1.3-2.2-2.3-3.6-3-1.4-.7-3.1-1.1-5-1.1s-3.6.4-5,1.1c-1.5.7-2.7,1.7-3.6,3s-1.7,2.8-2.2,4.5c-.5,1.7-.8,3.6-.8,5.7v.2c0,2.1.3,4,.8,5.7.5,1.7,1.2,3.2,2.2,4.5,1,1.3,2.2,2.3,3.6,3,1.5.7,3.1,1.1,5,1.1ZM189.1,58l-12.3-44h9.8l8.4,32.9h.3l8.2-32.9h9.7l-12.3,44M262.9,50.4c1.3,0,2.5-.2,3.6-.6,1.1-.4,2-.9,2.8-1.7.8-.8,1.4-1.7,1.9-2.9.5-1.2.7-2.5.7-4.1V14h8.6v28.5c0,2.4-.4,4.6-1.3,6.6-.9,2-2.1,3.6-3.7,5-1.6,1.4-3.4,2.4-5.6,3.2-2.2.7-4.5,1.1-7.1,1.1s-4.9-.4-7.1-1.1c-2.2-.7-4-1.8-5.6-3.2s-2.8-3-3.7-5c-.9-2-1.3-4.1-1.3-6.6V14h8.7v27.2c0,1.6.2,2.9.7,4.1.5,1.2,1.1,2.1,1.9,2.9.8.8,1.7,1.3,2.8,1.7s2.3.6,3.6.6h0ZM288.5,14h8.7v19.1l15.5-19.1h10.8l-15.1,17.6,16.1,26.4h-10.2l-11.5-19.7-5.6,6.3v13.5h-8.7"></path>
</svg>
```

Update the HTML inside your `<footer>` element by adding the following SVG code at the start of the `<div>` with the `govuk-width-container` class.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
  role="presentation"
  viewBox="0 0 64 60"
  height="30"
  width="32"
  fill="currentcolor"
  class="govuk-footer__crown">
  <g>
    <circle cx="20" cy="17.6" r="3.7"></circle>
    <circle cx="10.2" cy="23.5" r="3.7"></circle>
    <circle cx="3.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <circle cx="43.3" cy="17.6" r="3.7"></circle>
    <circle cx="53.2" cy="23.5" r="3.7"></circle>
    <circle cx="59.7" cy="33.2" r="3.7"></circle>
    <circle cx="31.7" cy="30.6" r="3.7"></circle>
    <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
  </g>
</svg>
```

Update the links to the assets. Change the HTML inside your `<head>` element to use the new file locations (from `/assets/` to `/assets/rebrand/`) and `theme-color`. Replace any existing definitions.

```html
<meta name="theme-color" content="#1d70b8">
<link rel="icon" sizes="48x48" href="/assets/rebrand/images/favicon.ico">
<link rel="icon" sizes="any" href="/assets/rebrand/images/favicon.svg" type="image/svg+xml">
<link rel="mask-icon" href="/assets/rebrand/images/govuk-icon-mask.svg" color="#1d70b8">
<link rel="apple-touch-icon" href="/assets/rebrand/images/govuk-icon-180.png">
<link rel="manifest" href="/assets/rebrand/manifest.json">
<meta property="og:image" content="<SERVICE URL>/assets/rebrand/images/govuk-opengraph-image.png">
```

##### Use the refreshed GOV.UK brand in your Prototype Kit prototype

If you use GOV.UK Frontend in a Prototype Kit prototype, enable the refreshed brand by adding the following to your prototype's `app/config.json` :

```json
"plugins": {
  "govuk-frontend": {
	"rebrand": true
  }
}
```

##### Pull requests

These changes were made in the following pull requests:

- [#5794: Add redesigned header component](https://github.com/alphagov/govuk-frontend/pull/5794)
- [#5796: Update template background colour and components using it](https://github.com/alphagov/govuk-frontend/pull/5796)
- [#5797: Add refreshed brand to service navigation component](https://github.com/alphagov/govuk-frontend/pull/5797)
- [#5798: Add mixin to help rebrand specific properties](https://github.com/alphagov/govuk-frontend/pull/5798)
- [#5800: Update favicons, app icons and OpenGraph image](https://github.com/alphagov/govuk-frontend/pull/5800)
- [#5804: Use logo in new Footer design](https://github.com/alphagov/govuk-frontend/pull/5804)
- [#5806: Update background colour of Cookie banner for brand refresh](https://github.com/alphagov/govuk-frontend/pull/5806)
- [#5810: Update logo SVG](https://github.com/alphagov/govuk-frontend/pull/5810)
- [#5853: Add rebrand variable to page template](https://github.com/alphagov/govuk-frontend/pull/5853)
- [#5857: Increase spacing in logo to 3 dots, increase viewbox size](https://github.com/alphagov/govuk-frontend/pull/5857)
- [#5870: Service navigation spacing adjustments](https://github.com/alphagov/govuk-frontend/pull/5870)
- [#5872: Improvements to the rebranded footer in forced colors mode](https://github.com/alphagov/govuk-frontend/pull/5872)
- [#5874: Add checks for `govukRebrand` Nunjucks global](https://github.com/alphagov/govuk-frontend/pull/5874)
- [#5877: Update prototype kit plugin rebrand function to be specific to govuk-frontend](https://github.com/alphagov/govuk-frontend/pull/5877)
- [#5883: Fix old wordmark using incorrect coordinates](https://github.com/alphagov/govuk-frontend/pull/5883)

### Other changes

#### The GOV.UK footer component top border is now consistent with GOV.UK

We've updated the border of the GOV.UK footer component so it matches the border used on the GOV.UK website. This will provide a more consistent experience for users as they navigate from the GOV.UK website and into services.

This change was introduced in [pull request #5792: Update footer top border to be consistent with GOV.UK](https://github.com/alphagov/govuk-frontend/pull/5792).

#### The Royal Arms in the GOV.UK footer component now matches the text colour

We've updated the colour of the Royal Arms in the [GOV.UK footer](https://design-system.service.gov.uk/components/footer/) so it matches the text colour in browsers supporting the `mask-image` CSS property.

This improves its accessibility and reduces the number of colours used in the footer.

This change was introduced in [pull request #5801: Update colour of the copyright logo using CSS](https://github.com/alphagov/govuk-frontend/pull/5801)

### Deprecated features

#### Deprecation of `$govuk-canvas-background-colour`

The responsibilities of the `$govuk-canvas-background-colour` variable were unclear, as the variable name and the description in the Sass API did not reflect how we were using it.

We’re replacing it with the `$govuk-template-background-colour` variable, which you can use to get the background colour of the `<html>` elements and of elements that need to match for visual continuity, such as the GOV.UK footer and Cookie banner components.

If you were using `$govuk-canvas-background-colour` to match the background colour of the `<html>` element, use `$govuk-template-background-colour` instead.

If you were using `$govuk-canvas-background-colour` to set the background colour in your custom styling to `light-grey`, use `govuk-colour('light-grey')` instead.

This change was introduced in [pull request #5790: Deprecate `$govuk-canvas-background-colour`, use `$govuk-template-background-colour` instead](https://github.com/alphagov/govuk-frontend/pull/5790)

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5785: Add missing Sass imports of components depended on](https://github.com/alphagov/govuk-frontend/pull/5785) - thanks to @matthew-shaw for reporting this issue and proposing a fix
- [#5863: Omit ‘empty’ nav items from service navigation](https://github.com/alphagov/govuk-frontend/pull/5863) – thanks to @NikhilNanjappa for reporting this issue

## v5.9.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.9.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### Use our improved File upload component

We've added a [JavaScript enhancement to the File upload component](https://design-system.service.gov.uk/components/file-upload/#using-the-improved-file-upload-component) which:

- makes the component easier to use for drag and drop
- allows the text of the component to be translated
- fixes accessibility issues for users of Dragon, a speech recognition software

This improvement is opt-in, as it's a substantial visual change which risks shifting other content on the page.

To enable this improvement for your users, you'll first need to update the markup of your File upload component:

- if you use our Nunjucks macro, using the new `javascript` option of `govukFileUpload`

  ```njk
  {{ govukFileUpload({
    id: "file-upload",
    name: "photo",
    label: {
      text: "Upload your photo"
    },
    javascript: true
  }) }}
  ```

- if you're using HTML, wrapping the `<input type="file">` of the File upload markup in a `<div class="govuk-drop-zone" data-module="govuk-file-upload">`

  ```html
  <div class="govuk-form-group">
    <label class="govuk-label" for="file-upload-1">
      Upload your photo
    </label>
    <div class="govuk-drop-zone" data-module="govuk-file-upload">
      <input class="govuk-file-upload" id="file-upload" name="photo" type="file">
    </div>
  </div>
  ```

If you're importing components individually in your JavaScript, which we recommend for better performance, you'll then need to import and initialise the new `FileUpload` component.

```js
import {FileUpload} from 'govuk-frontend'

createAll(FileUpload)
```

This change was introduced in [pull request #5305: Add progressively enhanced File Upload component](https://github.com/alphagov/govuk-frontend/pull/5305)

#### Form control components now have default `id` attributes

If you're using the included Nunjucks macros, these components now automatically use the value of the name parameter for the `id` parameter:

- Text input
- Textarea
- Password input
- Character count
- File upload
- Select

You’ll only have to provide the `name` parameters if they both have the same value.

The Date input component still requires an `id` attribute.

This change was introduced in [pull request #5658: Update form control components to set a default id based on name](https://github.com/alphagov/govuk-frontend/pull/5658).

### Deprecated features

#### Move service name and navigation links from the GOV.UK header to Service navigation component

We’ve deprecated the option to show a service name in the GOV.UK header component. This option will be removed from the GOV.UK header in the next breaking release of GOV.UK Frontend.

We recommend updating your service to use the [Service navigation component](https://design-system.service.gov.uk/components/service-navigation/) as soon as possible.

Previously, we deprecated the option to show navigation links in the GOV.UK header component. This option will be removed as well, along with the GOV.UK header JavaScript component, since its only purpose was to make the navigation links responsive.

This change was introduced in pull request #5721: [Add deprecation field and deprecate header navigation](https://github.com/alphagov/govuk-frontend/pull/5721).

#### Migrate to the new organisation colour palette

The legacy organisation colour palette has been deprecated and will be removed in the next major version.

If your service uses the organisation colour palette, make sure that things still look as expected with the `$govuk-new-organisation-colours` feature flag enabled.

This change was introduced in pull request #5627: [Deprecate legacy organisation colour palette](https://github.com/alphagov/govuk-frontend/pull/5627).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5628: Add focused error state to Character count](https://github.com/alphagov/govuk-frontend/pull/5628) - thanks to @edwardhorsford for reporting this issue
- [#5717: Fix prototype kit sass import path](https://github.com/alphagov/govuk-frontend/pull/5717) - thanks to @joelanman
- [#5720: Fix summary card actions appearance when there are lots of links](https://github.com/alphagov/govuk-frontend/pull/5720)
- [#5728: Prevent menu button being overlaid at high zoom levels](https://github.com/alphagov/govuk-frontend/pull/5728) - thanks to @govindmalurwardwp for reporting this issue

## v5.8.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.8.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### Use our base configurable component to build your own configurable component

We've added a `ConfigurableComponent` class to help you build your own configurable components. It extends our `Component` class and allows you to focus on your components' specific features by handling these shared behaviours across components:

- checking that GOV.UK Frontend is supported
- checking that the component is not already initialised on its root element
- checking the type of the root element and storing it for access within the component as `this.$root`
- taking a configuration object as a parameter and then storing it for access within the component as `this.config`
- merging a passed configuration object with configuration options specified on the data attributes of the root element

We introduced this change in:

- [#5499: Rename GOVUKFrontendComponentConfigurable, export ConfigurableComponent](https://github.com/alphagov/govuk-frontend/pull/5499)
- [#5456: Refactor Accordion to extend from a GOVUKFrontendConfigurableComponent](https://github.com/alphagov/govuk-frontend/issues/5456)

### Deprecated features

#### Importing Sass using `govuk/all`

You'll see a warning when compiling your Sass if you import all of GOV.UK Frontend's styling using `govuk/all`. Importing using the `all` file is deprecated, and we’ll remove it in the next major release.

In your import statements, use a trailing `/index` rather than `/all` to load GOV.UK Frontend's files:

- `@import "govuk/index";` instead of `@import "govuk/all";`

You do not need `/index` at the end of each import path if you’re using Dart Sass.

This change was introduced in [pull request #5518: Deprecate `govuk/all.scss` and only reference `govuk/index.scss` internally](https://github.com/alphagov/govuk-frontend/pull/5518).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5533: Fix UMD files overriding existing global](https://github.com/alphagov/govuk-frontend/pull/5533)

## v5.7.1 (Fix release)

To install this version with npm, run `npm install govuk-frontend@5.7.1`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### Recommended changes

#### Stop setting a `value` for File upload components

The File upload component currently supports a `value` parameter, which populates the `value` HTML attribute of the input.

However, since no modern browser supports passing a `value` to a file input, we've made the decision to remove this parameter. It has been deprecated and will be removed in a future version of GOV.UK Frontend.

We introduced this change in [pull request #5330: Deprecate File upload component's `value` parameter](https://github.com/alphagov/govuk-frontend/pull/5330).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5396: Update various department brand colours](https://github.com/alphagov/govuk-frontend/pull/5396)

## v5.7.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.7.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### The Royal Arms has been updated

The Royal Arms in the [GOV.UK footer](https://design-system.service.gov.uk/components/footer/) has been updated to reflect the version introduced by King Charles III.

If your service does not use the image directly from the Frontend package, you should ensure the new image is being copied to your service’s image assets folder. By default this folder is located at `/assets/images`.

If you’re using Nunjucks, the asset path may have been changed by the `assetPath` global variable or `assetsPath` parameter on the header component.

Copy the `govuk-crest.svg` file from `/dist/assets/images` into your assets folder.

You can safely delete the old image files, named `govuk-crest.png` and `govuk-crest-2x.png`.

We introduced this change in [pull request #5376: Update the Royal Arms graphic in footer (v5.x)](https://github.com/alphagov/govuk-frontend/pull/5376).

#### Components will not longer initialise twice on the same element

GOV.UK Frontend components now throw an error if they've already been initialised on the DOM Element they're receiving for initialisation.
This prevents components from being initialised more than once and therefore not working properly.

We introduced this change in [pull request #5272: Prevent multiple initialisations of a single component instance](https://github.com/alphagov/govuk-frontend/pull/5272)

#### Respond to initialisation errors when using `createAll` and `initAll`

We've added a new `onError` option for `createAll` and `initAll` that lets you respond to initialisation errors.
The functions will continue catching errors and initialising components further down the page if one component fails to initialise,
but this option will let you react to a component failing to initialise. For example, to allow reporting to an error monitoring service.

We introduced this change in:

- [pull request #5252: Add `onError` to `createAll`](https://github.com/alphagov/govuk-frontend/pull/5252)
- [pull request #5276: Add `onError` to `initAll`](https://github.com/alphagov/govuk-frontend/pull/5276)

#### Check if GOV.UK Frontend is supported

We've added the `isSupported` function to let you check if GOV.UK Frontend is supported in the browser running your script.
GOV.UK Frontend components have been checking this automatically since [the release of v5.0.0](https://github.com/alphagov/govuk-frontend/releases/v5.0.0), but you may want to use the `isSupported` function to avoid running some code when GOV.UK Frontend is not supported.

We introduced this change in [pull request #5250: Add `isSupported` to `all.mjs`](https://github.com/alphagov/govuk-frontend/pull/5250)

#### Use our base component to build your own components

We've added a `Component` class to help you build your own components. It allows you to focus on your components' specific features by handling these shared behaviours across components:

- checking that GOV.UK Frontend is supported
- checking that the component is not already initialised on its root element
- checking the type of the root element and storing it for access within the component as `this.$root`

We introduced this change in:

- [pull request #5350: Export a base `Component` class](https://github.com/alphagov/govuk-frontend/pull/5350).
- [pull request #5354: Refactor the root type check in `GOVUKFrontendComponent`](https://github.com/alphagov/govuk-frontend/pull/5354)

#### New brand colour

We've added a brand colour for the Serious Fraud Office in [pull request #5389](https://github.com/alphagov/govuk-frontend/pull/5389).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5278: Fix service navigation mobile toggle spacing](https://github.com/alphagov/govuk-frontend/pull/5278)
- [#5331: Fix Warning Text font weight when `<strong>` styles are reset](https://github.com/alphagov/govuk-frontend/pull/5331)
- [#5352: Only apply margin to details summary when open](https://github.com/alphagov/govuk-frontend/pull/5352)
- [#5089: Fix details expanded state not announced on iOS](https://github.com/alphagov/govuk-frontend/pull/5089)
- [#5332: Improve how licence description wraps in the footer](https://github.com/alphagov/govuk-frontend/pull/5332)

## v5.6.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.6.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### Make it easier to navigate complex services with the Service navigation component

We've added a new [Service navigation component](https://design-system.service.gov.uk/components/service-navigation/) to help users to navigate services with multiple top-level sections. This replaces the navigation functions of the Header component, which will be deprecated in a future release of GOV.UK Frontend.

This component includes some features we consider experimental. We intend to iterate these features in response to user feedback. These are:

- moving the service name from the Header to the Service navigation
- providing slots for injecting custom HTML into specified locations within the component

We introduced this change in [pull request #5206: Service navigation component](https://github.com/alphagov/govuk-frontend/pull/5206).

## v5.5.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.5.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### We've updated the list of organisations and brand colours included in Frontend

We've overhauled the list of organisations and organisation brand colours that are shipped with GOV.UK Frontend.

The previous list was outdated and had not kept up with changes to the machinery of government. We’ve updated the list to:

- add all current government departments and their brand colours
- add variants of brand colours that meet a 4.5:1 contrast ratio against white, where required
- provide warnings if defunct organisations are still being referenced in your Sass code

To enable these changes, set the feature flag variable `$govuk-new-organisation-colours` to `true` before you import GOV.UK Frontend in your Sass files:

```scss
// application.scss
$govuk-new-organisation-colours: true;
@import "govuk-frontend/all";
```

You can also silence warnings about defunct organisations by adding `organisation-colours` to the [`$govuk-suppressed-warnings`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-suppressed-warnings) setting.

We introduced this change in [pull request #3407: Update organisation colours](https://github.com/alphagov/govuk-frontend/pull/3407).

#### Stop long words breaking out of components with `govuk-!-text-break-word`

We've added a new override class to help display long words with no obvious break points when the space is too narrow to display them on one line. An example of a long word might be an email address entered by a user.

Wrapping the content with the `govuk-!-text-break-word` class forces words that are too long for the parent element to break onto a new line.

```html
A confirmation email will be sent to <span class="govuk-!-text-break-word">arthur_phillip_dent.42@peoplepersonalitydivision.siriuscyberneticscorporation.corp</span>.
```

Sass users can also use the `govuk-text-break-word` mixin.

We introduced this change in [pull request #5159: Add break-word typography helper](https://github.com/alphagov/govuk-frontend/pull/5159).

### Recommended changes

#### Update the `$websafe` parameter on the `govuk-organisation-colour` function

The `govuk-organisation-colour` Sass function's `$websafe` parameter has been renamed to `$contrast-safe`.

This is to more accurately describe the functionality of the parameter.

The old parameter name will stop working in the next major version of GOV.UK Frontend.

We introduced this change in [pull request #3407: Update organisation colours](https://github.com/alphagov/govuk-frontend/pull/3407).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5046: Skip ‘empty’ tasks in the task list](https://github.com/alphagov/govuk-frontend/pull/5046)
- [#5066: Fix whitespace affecting text alignment in pagination block variant](https://github.com/alphagov/govuk-frontend/pull/5066)
- [#5158: Remove ↑ up and ↓ down arrow key bindings from tabs](https://github.com/alphagov/govuk-frontend/pull/5158)
- [#5191: Fix rendering of Back link's `href` and `text` for falsy values](https://github.com/alphagov/govuk-frontend/pull/5191)

## 5.4.1 (Fix release)

### Recommended changes

#### Update Breadcrumbs to use `nav` and `aria-label`

We've made changes to the Breadcrumbs component to improve how it appears to screen readers.

We've changed the wrapping element to use the `nav` tag to expose it as a navigational landmark, and added an `aria-label` attribute to differentiate it as breadcrumb navigation.

This change was introduced in [pull request #4995: Update Breadcrumb component to improve screen reader accessibility](https://github.com/alphagov/govuk-frontend/pull/4995).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#5114: Fix divider width for small checkboxes](https://github.com/alphagov/govuk-frontend/pull/5114) – thanks to [@colinrotherham](https://github.com/colinrotherham)
- [#5043: Refactor the accordion JavaScript](https://github.com/alphagov/govuk-frontend/pull/5043)
- [#5044: Remove session storage checks from accordion JavaScript](https://github.com/alphagov/govuk-frontend/pull/5044)
- [#5060: Reintroduce additional bottom margin to Error Summary content](https://github.com/alphagov/govuk-frontend/pull/5060)
- [#5070: Fix alignment of content in conditional checkboxes and radio buttons](https://github.com/alphagov/govuk-frontend/pull/5070)
- [#5090: Remove redundant tag CSS from phase banner](https://github.com/alphagov/govuk-frontend/pull/5090)

## 5.4.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.4.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

This release includes new features to help you include only the components your service uses. Doing this can help reduce the size of the JavaScript and CSS files sent to users, improving their experience.

### New features

#### Create individual components with `createAll`

We've added a new `createAll` function that lets you initialise specific components in the same way that `initAll` does.

The `createAll` function will:

- find all elements in the page with the corresponding `data-module` attribute
- instantiate a component object for each element
- catch errors and log them in the console
- return an array of all the successfully instantiated component objects.

```js
import { createAll, Button, Checkboxes } from 'govuk-frontend'

createAll(Button)
createAll(Checkboxes)
```

You can also pass a config object and a scope within which to search for elements.

You can find out more about [how to use the `createAll` function](https://frontend.design-system.service.gov.uk/import-javascript/#import-individual-components) in our documentation.

This change was introduced in [pull request #4975: Add `createAll` function to initialise individual components](https://github.com/alphagov/govuk-frontend/pull/4975).

#### Use tabular numbers easily with `govuk-!-font-tabular-numbers`

We've added a new override class for tabular number styling: `govuk-!-font-tabular-numbers`.

Using tabular numbers can make it easier for users to read numbers intended for comparison to one another, or for numbers that dynamically update.

It was previously only possible to use tabular numbers by using the `govuk-font-tabular-numbers` Sass mixin.

This change was introduced in [pull request #4973: Add override class for tabular numbers](https://github.com/alphagov/govuk-frontend/pull/4973).

### Deprecated features

#### Importing layers using `all` files

You'll see a warning when compiling your Sass if you import any of our layers using the `all` file. Importing using the `all` files is deprecated, and we’ll remove them in the next major release.

In your import statements, use a trailing `/index` rather than `/all` to load GOV.UK Frontend's files.
For example:

- `@import "govuk/index";` instead of `@import "govuk/all";`;
- `@import "govuk/<PATH>/index";` instead of `@import "govuk/<PATH>/all";`;

You do not need `/index` at the end of each import path if you’re using Dart Sass, LibSass 3.6.0 or higher, or Ruby Sass 3.6.0 or higher.

This change was introduced in [pull request #4955: Rename `all` files to `index` for our Sass entry points](https://github.com/alphagov/govuk-frontend/pull/4955).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#4942: Remove duplicate `errorMessage` argument for the password input component](https://github.com/alphagov/govuk-frontend/pull/4942) - thanks to [Tim South](https://github.com/tim-s-ccs) for contributing this change
- [#4961: Fix tree-shaking when importing `govuk-frontend`](https://github.com/alphagov/govuk-frontend/pull/4961)
- [#4963: Fix input value not being set if the value was '0'](https://github.com/alphagov/govuk-frontend/pull/4963) – thanks to [@dwp-dmitri-algazin](https://github.com/dwp-dmitri-algazin) for reporting this issue
- [#4971: Fix Error Summary component outputting list HTML when no `errorList` is provided](https://github.com/alphagov/govuk-frontend/pull/4971)
- [#442: Update content to streamline installation info](https://github.com/alphagov/govuk-frontend-docs/pull/442)
- [#438: Split up the 'Import CSS, assets and JavaScript' page](https://github.com/alphagov/govuk-frontend-docs/pull/438)

## 5.3.1 (Fix release)

To install this version with npm, run `npm install govuk-frontend@5.3.1`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#4906: Update the icon in the warning text component to match the defined text colour and background colour, rather than always being white on black](https://github.com/alphagov/govuk-frontend/pull/4906)
- [#4919: Use canvas colour for cookie banner over hardcoded grey](https://github.com/alphagov/govuk-frontend/pull/4919)
- [#4899: Remove indents from conditional reveals in radios and checkboxes](https://github.com/alphagov/govuk-frontend/pull/4899)
- [#4935: Fix password input button unexpectedly stretching](https://github.com/alphagov/govuk-frontend/pull/4935)
- [#4936: Fix skip link underline being removed when global styles are enabled](https://github.com/alphagov/govuk-frontend/pull/4936)
- [#4938: Fix `attributes` option ignoring values passed from the `safe` filter ](https://github.com/alphagov/govuk-frontend/pull/4938)

## 5.3.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.3.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### Use the Password input component to help users accessibly enter passwords

The [Password input component](https://design-system.service.gov.uk/components/password-input/) allows users to choose:

- whether their passwords are visible or not
- to enter their passwords in plain text

This helps users use longer and more complex passwords without needing to remember what they've already typed.

This change was introduced in [pull request #4442: Create password input component](https://github.com/alphagov/govuk-frontend/pull/4442). Thanks to [@andysellick](https://github.com/andysellick) for the original contribution.

### Recommended changes

#### Update the HTML for the Character count component

We've updated the HTML for the Character count component. The component wrapper `data-module="govuk-character-count"` and its form group `class="govuk-form-group"` are now combined as the same `<div>`. The hint text used as the count message now appears directly after the `<textarea>`.

If you're not using Nunjucks macros, then you should:

- move all classes and attributes from the form group `<div>` to the component wrapper `<div>`
- remove the opening `<div>` and closing `</div>` tags used by the form group
- check the count message is now directly after the `<textarea>`

The following example shows some HTML and the difference once it’s updated.

HTML before:

```html
<div class="govuk-character-count" data-module="govuk-character-count" data-maxlength="100">
  <div class="govuk-form-group">
    <!-- // Label, hint, error and textarea -->
  </div>
  <!-- // Count message -->
</div>
```

HTML after:

```html
<div class="govuk-form-group govuk-character-count" data-module="govuk-character-count" data-maxlength="100">
  <!-- // Label, hint, error, textarea and count message -->
</div>
```

Check your changes against [the Character count example in the Design System](https://design-system.service.gov.uk/components/character-count/#character-count-example) to make sure you’ve correctly implemented them.

This change was introduced in [pull request #4566: Use Character count `formGroup` as module wrapper](https://github.com/alphagov/govuk-frontend/pull/4566).

#### Remove redundant `role` attributes from elements

We've made minor changes to the HTML of the page template, as well as the header, footer and pagination components.

You can update your HTML to remove the `role` attribute from some elements. These include the:

- `main` role on the `main` element in the template
- `banner` role on the `header` element in the Header component
- `contentinfo` role on the `footer` element in the Footer component
- `navigation` role on the `nav` element in the Pagination component

These roles were present to support legacy browsers, such as older versions of Internet Explorer. GOV.UK Frontend no longer supports these browsers, so you can now remove these roles.

You do not need to change anything if you're using the Nunjucks versions of the page template or these components,

This change was introduced in [pull request #4854: Remove redundant `role` attributes](https://github.com/alphagov/govuk-frontend/pull/4854).

### Fixes

We've fixed an upstream issue in the [cssnano npm package](https://www.npmjs.com/package/cssnano) that caused elements with transparency to render incorrectly in Internet Explorer 11. This affected the pre-compiled CSS files in the [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend) and [GitHub releases](https://github.com/alphagov/govuk-frontend/releases) for versions 5.0, 5.1 and 5.2. This was fixed in:

- [#1573: feat: add preset and plugin options for browserslist](https://github.com/cssnano/cssnano/pull/1573) in the cssnano repository
- [#4829: Bump the postcss group with 2 updates](https://github.com/alphagov/govuk-frontend/pull/4829)

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#4811: Use `KeyboardEvent.key` over deprecated `KeyboardEvent.keyCode` in the Tabs component](https://github.com/alphagov/govuk-frontend/pull/4811)
- [#4812: Use `KeyboardEvent.key` over deprecated `KeyboardEvent.keyCode` in the Button component](https://github.com/alphagov/govuk-frontend/pull/4812)
- [#4813: Remove deprecated `KeyboardEvent` properties from the Exit this Page component](https://github.com/alphagov/govuk-frontend/pull/4813)
- [#4855: Fix mobile product name being misaligned in new type scale](https://github.com/alphagov/govuk-frontend/pull/4855)

## 5.2.0 (Feature release)

In this release, we’ve adjusted our responsive type scale, which is available behind a feature flag. The type scale change is to make text easier to read on smaller screens. We’ve also deprecated the `useTudorCrown` parameter.

To install this version with npm, run `npm install govuk-frontend@5.2.0`. You can also find more information about [how to stay up to date](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version) in our documentation.

### New features

#### We've adjusted our responsive type scale

We've made the following adjustments to our responsive type scale:

- point 16 now returns 16px across all screen sizes
- point 19 now returns 19px across all screen sizes
- point 24 remains as 24px on large screens
- point 24 now returns 21px on small screens instead of 18px and has a line height 25px instead of 20px
- point 27 remains as 27px on large screens
- point 27 now returns 21px on small screens instead of 18px and has a line height 25px instead of 20px
- point 36 remains as 27px on large screens
- point 36 now returns 27px on small screens instead of 24px and has a line height 30px instead of 25px

To enable these changes, set the feature flag variable `$govuk-new-typography-scale` to `true` before you import GOV.UK Frontend in your Sass files:

```scss
// application.scss
$govuk-new-typography-scale: true;
@import "govuk-frontend/all";
```

If your service uses custom elements made using GOV.UK Frontend, test your service against the new typography scale to assess if you need to make any adjustments.

You can read more on upgrading your service to the new type scale in our [upgrade guide](https://design-system.service.gov.uk/get-started/new-type-scale/).

This change was introduced in [pull request #2421: Adjust the responsive type scale](https://github.com/alphagov/govuk-frontend/pull/2421)

#### Insert custom HTML into component form group wrappers

You can now insert custom HTML into form group wrappers for all components with form fields.

```njk
govukInput({
  formGroup: {
    beforeInput: {
      html: "example"
    },
    afterInput: {
      html: "example"
    },
  }
})
```

This change was introduced in [pull request #4567: Add `beforeInput(s)` and `beforeInput(s)` options to form groups](https://github.com/alphagov/govuk-frontend/pull/4567).

### Deprecated features

#### Stop using the `useTudorCrown` parameter in the Heading component

The rollout for the revised GOV.UK logo has started and the Tudor crown logo is now shown by default. We’ve deprecated the `useTudorCrown` parameter and will remove it in the next major release.

You can now remove the `useTudorCrown` parameter, along with any other adjustments made to display the Tudor crown logo in your service.

This change was introduced in [pull request #4740: Make Tudor Crown logo the default](https://github.com/alphagov/govuk-frontend/pull/4740)

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#4768: Fix z-index of inputs in Radios and Checkboxes component](https://github.com/alphagov/govuk-frontend/pull/4768)
- [#4784: Fix LibSass `calc()` compatibility in Radios and Checkboxes](https://github.com/alphagov/govuk-frontend/pull/4784)

## 5.1.0 (Feature release)

To install this version with npm, run `npm install govuk-frontend@5.1.0`. You can also find more information about [how to stay up to date in our documentation](https://frontend.design-system.service.gov.uk/staying-up-to-date/#updating-to-the-latest-version).

### New features

#### Update to the new GOV.UK logo

The GOV.UK logo has been updated to reflect the changing of the monarch. King Charles III uses the Tudor Crown, rather than the St Edward’s Crown chosen by Queen Elizabeth II.

If your service uses GOV.UK branding, you must update your service between 19 February and 1 March 2024 to use the new logo.

These changes were made in the following pull requests:

- [#4354: Implement the Tudor crown favicons (v5.x)](https://github.com/alphagov/govuk-frontend/pull/4354)
- [#4297: Implement the Tudor crown in the Header component (v5.x)](https://github.com/alphagov/govuk-frontend/pull/4297)

#### Include the new logo assets

Multiple new image assets are included in this release. You’ll need to copy these to your service's image assets folder if they’re not being used directly from the Frontend package. By default this folder is located at `/assets/images`.

If you’re using Nunjucks, the asset path may have been changed by the `assetPath` global variable or `assetsPath` parameter on the header component.

Copy the following files from `/dist/assets/images` into your assets folder. Any images with the same name as an existing image can be safely overwritten.

- favicon.ico
- favicon.svg
- govuk-icon-180.png
- govuk-icon-192.png
- govuk-icon-512.png
- govuk-icon-mask.svg
- govuk-opengraph-image.png

#### Update the logo in the header of your page

If you’re using the `govukHeader` Nunjucks macro in your service, add the `useTudorCrown` parameter to the macro instantiation. This will become the default in a future version of GOV.UK Frontend.

```nunjucks
{{ govukHeader({
  ...
  useTudorCrown: true
}) }}
```

If you’re not using the Nunjucks macro, locate the SVG code for the existing logo and replace it with this updated SVG.

```html
<svg
  focusable="false"
  role="img"
  class="govuk-header__logotype"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 148 30"
  height="30"
  width="148"
  aria-label="GOV.UK"
>
  <title>GOV.UK</title>
  <path d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8m28.3-11.6c0 .9.1 1.7.3 2.5.2.8.6 1.5 1 2.2.5.6 1 1.1 1.7 1.5.7.4 1.5.6 2.5.6.9 0 1.7-.1 2.3-.4s1.1-.7 1.5-1.1c.4-.4.6-.9.8-1.5.1-.5.2-1 .2-1.5v-.2h-5.3v-3.2h9.4V28H55v-2.5c-.3.4-.6.8-1 1.1-.4.3-.8.6-1.3.9-.5.2-1 .4-1.6.6s-1.2.2-1.8.2c-1.5 0-2.9-.3-4-.8-1.2-.6-2.2-1.3-3-2.3-.8-1-1.4-2.1-1.8-3.4-.3-1.4-.5-2.8-.5-4.3s.2-2.9.7-4.2c.5-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.6 2.6-.8 4.1-.8 1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1s1.4.9 1.9 1.5c.6.6 1 1.3 1.4 2l-3.7 2.1c-.2-.4-.5-.9-.8-1.2-.3-.4-.6-.7-1-1-.4-.3-.8-.5-1.3-.7-.5-.2-1.1-.2-1.7-.2-1 0-1.8.2-2.5.6-.7.4-1.3.9-1.7 1.5-.5.6-.8 1.4-1 2.2-.3.8-.4 1.9-.4 2.7zM71.5 6.8c1.5 0 2.9.3 4.2.8 1.2.6 2.3 1.3 3.1 2.3.9 1 1.5 2.1 2 3.4s.7 2.7.7 4.2-.2 2.9-.7 4.2c-.4 1.3-1.1 2.4-2 3.4-.9 1-1.9 1.7-3.1 2.3-1.2.6-2.6.8-4.2.8s-2.9-.3-4.2-.8c-1.2-.6-2.3-1.3-3.1-2.3-.9-1-1.5-2.1-2-3.4-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2c.4-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.5 2.6-.8 4.2-.8zm0 17.6c.9 0 1.7-.2 2.4-.5s1.3-.8 1.7-1.4c.5-.6.8-1.3 1.1-2.2.2-.8.4-1.7.4-2.7v-.1c0-1-.1-1.9-.4-2.7-.2-.8-.6-1.6-1.1-2.2-.5-.6-1.1-1.1-1.7-1.4-.7-.3-1.5-.5-2.4-.5s-1.7.2-2.4.5-1.3.8-1.7 1.4c-.5.6-.8 1.3-1.1 2.2-.2.8-.4 1.7-.4 2.7v.1c0 1 .1 1.9.4 2.7.2.8.6 1.6 1.1 2.2.5.6 1.1 1.1 1.7 1.4.6.3 1.4.5 2.4.5zM88.9 28 83 7h4.7l4 15.7h.1l4-15.7h4.7l-5.9 21h-5.7zm28.8-3.6c.6 0 1.2-.1 1.7-.3.5-.2 1-.4 1.4-.8.4-.4.7-.8.9-1.4.2-.6.3-1.2.3-2v-13h4.1v13.6c0 1.2-.2 2.2-.6 3.1s-1 1.7-1.8 2.4c-.7.7-1.6 1.2-2.7 1.5-1 .4-2.2.5-3.4.5-1.2 0-2.4-.2-3.4-.5-1-.4-1.9-.9-2.7-1.5-.8-.7-1.3-1.5-1.8-2.4-.4-.9-.6-2-.6-3.1V6.9h4.2v13c0 .8.1 1.4.3 2 .2.6.5 1 .9 1.4.4.4.8.6 1.4.8.6.2 1.1.3 1.8.3zm13-17.4h4.2v9.1l7.4-9.1h5.2l-7.2 8.4L148 28h-4.9l-5.5-9.4-2.7 3V28h-4.2V7zm-27.6 16.1c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z"></path>
</svg>
```

#### Add attributes to component form group wrappers

You can now add attributes to the form group wrapper for all components with form fields.

```njk
govukRadios({
  formGroup: {
    attributes: {
      "data-attribute": "value"
    }
  }
})
```

This change was introduced in [pull request #4565: Allow `attributes` option on form groups](https://github.com/alphagov/govuk-frontend/pull/4565).

#### Use tabular numbers with the `govuk-font-tabular-numbers` mixin

You can now use tabular numbers in your authored Sass by including the new `govuk-font-tabular-numbers` mixin.

Previously, you’d use the `govuk-font` mixin with the `$tabular` parameter. However, the `govuk-font` mixin includes styles unrelated to tabular numbers, which are not needed in some contexts.

These additional styles are not included if you use `govuk-font-tabular-numbers`. Switching to the new mixin can reduce the size of your compiled CSS without affecting the appearance of pages.

This change was introduced in [pull request #4307: Refactor tabular number activation into their own mixin](https://github.com/alphagov/govuk-frontend/pull/4307).

### Recommended changes

#### Replace instances of `govuk-typography-responsive` with `govuk-font-size`

We've renamed the Sass mixin `govuk-typography-responsive` to `govuk-font-size` and have deprecated `govuk-typography-responsive`. You can still use `govuk-typography-responsive`, but we'll remove it in a future breaking release (GOV.UK Frontend v6.0.0).

This is an experimental change to see if the name `govuk-font-size` better communicates the Sass mixin's intended use than the name `govuk-typography-responsive`.

We're interested in feedback from the community on this name change, so please let us know what you think [through our usual channels](https://design-system.service.gov.uk/get-in-touch/).

This change was introduced in [pull request #4291: Rename `govuk-typography-responsive` to `govuk-font-size`](https://github.com/alphagov/govuk-frontend/pull/4291).

#### Remove the `aria-labelledby` attribute from accordion sections

If you’re not using our Nunjucks macros, remove the `aria-labelledby` attribute from all accordion sections (`div` elements that have the `govuk-accordion__section-content` class).

This change was introduced in [pull request #4628: Remove `aria-labelledby` from accordion sections](https://github.com/alphagov/govuk-frontend/pull/4628).

### Deprecated features

#### Stop using the `element` parameter on buttons

We’ve deprecated the `element` Nunjucks parameter and will remove it in the next major release.

In the future, if the `href` parameter is set the component will automatically use the `<a>` element. If the `href` parameter is not set the component will automatically use the `<button>` element. It will not be possible to override this change.

This change was introduced in [pull request #4646: Deprecate `element` parameter on button component](https://github.com/alphagov/govuk-frontend/pull/4646).

#### Stop using `govuk-body-xs`, `govuk-!-font-size-14` and '14' on the type scale

We’ve deprecated point 14 (14px large screens, 12px small screens) on the GOV.UK Frontend responsive type scale, including font override classes that use point 14:

- `govuk-body-xs`
- `govuk-!-font-size-14`

We’ll remove these classes and point 14 on the type scale in the next major release, GOV.UK Frontend release v6.0.0. With this change in the v6.0.0 release, you’ll no longer be able to call the Sass mixins `govuk-font` or `govuk-font-size` with `$size` set to '14'.

This change was introduced in [#4649: Deprecate 14 on the type scale](https://github.com/alphagov/govuk-frontend/pull/4649) and [#4713: Ensure `govuk-font-size()` handles string keys](https://github.com/alphagov/govuk-frontend/pull/4713).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#4157: Dynamically position text within input prefixes and suffixes](https://github.com/alphagov/govuk-frontend/pull/4157)
- [#4150: Header menu button position refactor](https://github.com/alphagov/govuk-frontend/pull/4150)
- [#4093: Refactor positioning of radios and checkboxes](https://github.com/alphagov/govuk-frontend/pull/4093)
- [#4562: Use CSS custom properties for component `matchMedia()`](https://github.com/alphagov/govuk-frontend/pull/4562)

## 5.0.0 (Breaking release)

You can find a summary of the main [changes to GOV.UK Frontend v5](https://frontend.design-system.service.gov.uk/changes-to-govuk-frontend-v5/) on the Frontend site. It's important to note [our old frameworks (such as GOV.UK Elements)](https://frontend.design-system.service.gov.uk/v4/migrating-from-legacy-products/) are no longer compatible with this release. It also stops Internet Explorer 11 from running GOV.UK Frontend JavaScript and removes support completely for Internet Explorer 8 to 10.

Your service will not stop working in Internet Explorer 11, but components will look and behave differently without JavaScript. Read more about [how we provide support for different browsers](https://frontend.design-system.service.gov.uk/browser-support/).

Service teams should be [using a progressive enhancement approach](https://www.gov.uk/service-manual/technology/using-progressive-enhancement) to make sure users can still access any content and complete their tasks.

If you still need to provide support for older versions of Internet Explorer, you should stay on the latest [GOV.UK Frontend v4 release](https://github.com/alphagov/govuk-frontend/releases).

If you need it, we have a checklist for the changes you might need to make for v5, which you can [view](https://docs.google.com/spreadsheets/d/1Qt-9kLcB_ONp4WOTI61i69P3q7Ymw0ziA5YNUqNkImE/edit) or [copy (needs a Google account)](https://docs.google.com/spreadsheets/d/1Qt-9kLcB_ONp4WOTI61i69P3q7Ymw0ziA5YNUqNkImE/copy).

### Breaking changes

You must make the following changes when you migrate to this release, or your service might break.

#### Update package file paths for Sass

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

Replace `govuk-frontend/govuk` with `govuk-frontend/dist/govuk` in any [Sass](https://sass-lang.com/) `@import` paths.

For example:

```scss
@import "node_modules/govuk-frontend/dist/govuk/all";
```

If you've added [`node_modules/govuk-frontend` as a Sass import path](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#simplify-sass-import-paths), update it with the `/dist` suffix:

```js
loadPaths: [
  'node_modules/govuk-frontend/dist'
]
```

If you're building your Sass code through Rails Assets Pipeline or Sprockets, refer to the section 'Update package file paths in Rails Assets Pipeline or Sprockets'.

Refer to the [detailed guidance on importing using Sass](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-using-sass).

These changes were introduced in [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Update package file paths for Nunjucks

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

Replace `govuk-frontend` with `govuk-frontend/dist` in any [`nunjucks.configure()`](https://mozilla.github.io/nunjucks/api.html#configure) search paths:

```js
nunjucks.configure([
  'node_modules/govuk-frontend/dist'
])
```

Refer to the [detailed guidance on using Nunjucks](https://frontend.design-system.service.gov.uk/use-nunjucks/#set-up-nunjucks-and-use-the-page-template).

These changes were made in the following pull requests:

- [#3491: Update Review app to import `govuk-frontend` via local package](https://github.com/alphagov/govuk-frontend/pull/3491)
- [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Update package file paths for assets such as images and fonts 

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

If you're [serving the assets from the GOV.UK Frontend assets folder](https://frontend.design-system.service.gov.uk/v4/importing-css-assets-and-javascript/#serve-the-assets-from-the-gov-uk-frontend-assets-folder-recommended) (`node_modules/govuk-frontend/govuk/assets`), [update your routing to the new assets path ](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#serve-the-assets-from-the-gov-uk-frontend-assets-folder-recommended): `node_modules/govuk-frontend/dist/govuk/assets`.

Refer to the [detailed guidance on importing assets](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#font-and-image-assets).

These changes were introduced in [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Update package file paths in Rails Assets Pipeline or Sprockets

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

Update the  `node_modules/govuk-frontend` part of the path to `node_modules/govuk-frontend/dist`, if you've added the path to GOV.UK Frontend package inside `node_modules` to:

- [Rails Assets Pipeline search path](https://guides.rubyonrails.org/asset_pipeline.html#search-paths) using `Rails.application.config.assets.paths`
- Sprockets using `append_path`

These changes were introduced in [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Update package file paths if including JavaScript directly

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

If you've [set up your routing to serve GOV.UK Frontend's `all.js` file from `node_modules`](https://frontend.design-system.service.gov.uk/v4/importing-css-assets-and-javascript/#add-the-javascript-file-to-your-html), update the path you're serving to `node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js`.

Update any `<script>` tag with the new path and filename, if necessary. Make sure they have a `type="module"` attribute. For example:

```html
<script type="module" src="{path-to-javascript}/govuk-frontend.min.js"></script>
```

Replace `<script>window.GOVUKFrontend.initAll()</script>` to import and initialise GOV.UK Frontend using ES modules:

```html
<script type="module">
  import { initAll } from '{path-to-javascript}/govuk-frontend.min.js'

  initAll()
</script>
```

Refer to the [detailed guidance on importing JavaScript](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#add-the-javascript-file-to-your-html).

These changes were introduced in [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Update package file paths for Node.js and other bundlers

In preparation for additional build targets, we've moved our package files into a directory called `dist`.

If you're importing GOV.UK Frontend using `import ... from 'govuk-frontend'` or `require('govuk-frontend')`, you have nothing to change.

If you're using `import` to import individual components, replace `govuk-frontend/govuk` with `govuk-frontend/dist/govuk`. For example:

```js
import Button from 'govuk-frontend/dist/govuk/components/button/button.mjs'
```

If you're using `require` to import individual components, replace `govuk-frontend/govuk` with `govuk-frontend/dist/govuk` and update the file name to `<COMPONENT_NAME>.bundle.js`. For example:

```js
const Button = require('govuk-frontend/dist/govuk/components/button/button.bundle.js')
```

Refer to the [detailed guidance on importing JavaScript](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-javascript-using-a-bundler).

These changes were introduced in [#3498: Remove built `dist` and `package` from source](https://github.com/alphagov/govuk-frontend/pull/3498)

#### Verify your code does not rely on polyfills we have now removed

We have removed polyfills for Internet Explorer 8 to 11:

- `DOMTokenList`, `Element.prototype.classList`, `Element.prototype.closest`, `Element.prototype.matches`, and `Event` - required for Internet Explorer 11 and below
- `Element.prototype.dataset` - required for Internet Explorer 10 and below
- `Date.now`, `Document`, `Element`, `Element.prototype.nextElementSibling`, `Element.prototype.previousElementSibling`, `Function.prototype.bind`, `Object.defineProperty`, `String.prototype.trim` and `Window` - required for Internet Explorer 8

However, because these polyfills create or extend global objects ('polluting the global namespace'), you might have other code in your service unintentionally relying on the inclusion of these polyfills. You might need to introduce your own polyfills or rewrite your JavaScript to avoid using the polyfilled features.

These changes were introduced in [pull request #3570: Remove Internet Explorer 8 to 10 JavaScript polyfills, helpers, config](https://github.com/alphagov/govuk-frontend/pull/3570)

#### Stop Internet Explorer 11 and other older browsers running unsupported JavaScript

Add `type="module"` to all HTML `<script>` tags that include or bundle GOV.UK Frontend.

This is to stop Internet Explorer 11 and other older browsers running the JavaScript, which relies on features older browsers might not support and could cause errors.

Please note that `<script>` with `type="module"` [runs JavaScript in a slightly different way](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_standard_scripts) than `<script>` without `type="module". You'll need to assess the impact of these nuances and make sure that:

- when your service code is bundled with GOV.UK Frontend it runs as expected in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- if you have any code that needs to run after [GOV.UK](http://gov.uk) Frontend in its own `<script>` tag, you'll need to make sure it's using `type="module"` or [`defer`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer). This is because the tag loading [GOV.UK](http://gov.uk) Frontend will be deferred because of its `type="module"` attribute
- code that needs to run without being deferred, is split into its own file and loaded with a `<script>` tag without `type="module"`

If your service has JavaScript you want to run successfully in Internet Explorer (for example JavaScript for analytics), you will need to load it in a separate `<script>` tag without `type="module"` and make sure its code is compatible with the browsers it should run in (see previous section about polyfills).

These changes were introduced in [pull request #3720: Remove IE11 vendor polyfills](https://github.com/alphagov/govuk-frontend/pull/3720)

#### Update the `<script>` snippet at the top of your `<body>` tag

Page templates now include a new `govuk-frontend-supported` class on the `<body>` tag when GOV.UK Frontend JavaScript components are fully supported.

If you are not using our Nunjucks page template, replace the existing snippet:

```js
<script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
```

with:

```js
<script>document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');</script>
```

These changes were introduced in [pull request #3801:

Add class .govuk-frontend-supported for ES modules support] (<https://github.com/alphagov/govuk-frontend/pull/3801>)

#### Update the hash used by your Content Security Policy

If your [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) uses a hash to let the snippet above run, you'll need to update it from:

```
sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=
```

to:

```
sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw=
```

These changes were introduced in [pull request #3801:

Add class .govuk-frontend-supported for ES modules support] (<https://github.com/alphagov/govuk-frontend/pull/3801>)

#### Remove calls to component `init` methods from your JavaScript

If you instantiate individual components, remove any calls to component `init` methods,  as initialisation now happens automatically. If you initialise the JavaScript using `window.GOVUKFrontend.initAll()`, you will not need to make any changes.

For example, the following:

```js
new Radios($radio).init()
```

becomes:

```js
new Radios($radio)
```

This change was introduced in [pull request #4011: Remove component init() methods and initialise in constructor](https://github.com/alphagov/govuk-frontend/pull/4011).

#### Remove Internet Explorer 8 stylesheets, settings and mixins

We no longer support Internet Explorer 8 (IE8) in GOV.UK Frontend or provide dedicated stylesheets for the browser. Remove any references to these stylesheets from your HTML.

We've removed the `govuk-if-ie8` and `govuk-not-ie8` mixins, and the `$govuk-is-ie8` and `$govuk-ie8-breakpoint` settings. These were deprecated in [GOV.UK Frontend v4.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.6.0).

You should:

- remove calls to the `govuk-if-ie8` mixin entirely (because the code passed to the mixin was only ever for Internet Explorer 8)
- replace calls to the `govuk-not-ie8` mixin with the contents that were previously passed to the mixin (because now we always want the code passed to the mixin)
- verify your codebase no longer uses these mixins and variables
- remove `ie8` from the `$govuk-suppressed-warnings` list, if present

If a library you depend on is not yet updated and relies on these mixins and variables, as a temporary workaround you can define the following mixins and variables before importing:

```scss
$govuk-is-ie8: false;
$govuk-ie8-breakpoint: ('desktop');
@mixin govuk-if-ie8 {
  @if false {
    @content;
  }
}
@mixin govuk-not-ie8 {@content}
```

This change was introduced in [pull request #3559: Remove IE8-related Sass and CSS build tasks](https://github.com/alphagov/govuk-frontend/pull/3559).

#### Remove references to "Compatibility mode" and related features from your Sass

GOV.UK Frontend is no longer compatible with [our old frameworks](https://frontend.design-system.service.gov.uk/v4/migrating-from-legacy-products/):

- GOV.UK Elements
- GOV.UK Template
- GOV.UK Frontend Toolkit.

You cannot migrate an existing service to GOV.UK Frontend v5.0 if it is still using one of these frameworks -- you'll need to remain on the latest v4.x release until you've finished the migration. Remove any references to these Sass variables and mixins:

- `$govuk-compatibility-govukelements`
- `$govuk-compatibility-govuktemplate`
- `$govuk-compatibility-govukfrontendtoolkit`

- the `govuk-compatibility` mixin which could be used to conditionally output CSS when compatibility mode was enabled
- remove `compatibility-mode` from the `$govuk-suppressed-warnings` list, if present

We've additionally removed features that were managed using the above variables. We've removed the following features and their corresponding variables:

- access to the legacy colour palette using `$govuk-use-legacy-palette`
- access to the legacy font using `$govuk-use-legacy-font`
- use of legacy tabular fonts using `$govuk-font-family-tabular`
- the ability to not use rem font sizes using `$govuk-typography-use-rem`

These changes were introduced in:

- [pull request #3622: Remove compatibility mode variables](https://github.com/alphagov/govuk-frontend/pull/3622)
- [pull request #3602: Remove compatibility-mode mixin](https://github.com/alphagov/govuk-frontend/pull/3602)
- [pull request #3576: Remove legacy colour palette](https://github.com/alphagov/govuk-frontend/pull/3576)
- [pull request #3574: Remove legacy and tabular fonts support](https://github.com/alphagov/govuk-frontend/pull/3574)
- [pull request #3576: Remove $govuk-typography-use-rem setting](https://github.com/alphagov/govuk-frontend/pull/3575)

#### Remove references to font family variables from your Sass

Remove any references to following Sass variables:

- `$govuk-font-family-gds-transport`
- `$govuk-font-family-nta`
- `$govuk-font-family-nta-tabular`

If you were using `$govuk-font-family-gds-transport` to set the font on an element, we recommend using [the `govuk-font` mixin](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-font) instead.

This change was introduced in [pull request #3949: Simplify font family settings](https://github.com/alphagov/govuk-frontend/pull/3949).

#### Remove references to `govuk-button--disabled` class from the HTML for the Button component

For the [Button component](https://design-system.service.gov.uk/components/button/), remove any references to the `govuk-button--disabled` class that we deprecated in [GOV.UK Frontend v4.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.6.0).

Use the `disabled` attribute to mark `<button>` and `<input>` elements as being disabled instead.

We no longer support link buttons being disabled or using disabled styles.

This change was introduced in [pull request #3557: Remove deprecated `govuk-button--disabled` class](https://github.com/alphagov/govuk-frontend/pull/3557).

#### Remove references to the JavaScript for the Details component

The [Details component](https://design-system.service.gov.uk/components/details/) no longer uses JavaScript, and is no longer polyfilled in older browsers.

If you are importing the JavaScript for this component individually, remove any references to it.

If you are not using our Nunjucks macros, remove the `data-module="govuk-details"` attribute from all `<details>` elements.

We've styled the details component so content does not look 'broken' in browsers that do not support it. If your service supports these browsers,  you will need to add your own polyfills.

This change was introduced in:

- [pull request #3766: Remove JavaScript from Details component](https://github.com/alphagov/govuk-frontend/pull/3766).
- [pull request #3758: Style details in older browsers](https://github.com/alphagov/govuk-frontend/pull/3758)

#### Update the GOV.UK logo

We've updated the GOV.UK logo to merge the GOV.UK text with the crown graphic. This is to make sure the full logo is always rendered correctly even if parts of the page, such as CSS or the Transport webfont, fail to load. We've also modified styles relating to the logo.

If you're using the `govukHeader` Nunjucks macro you don't need to change anything.

Otherwise, to update to the new logo:

- remove `<span class="govuk-header__logotype-text">` and its content
- remove the `<span class="govuk-header__logotype">` around the svg element
- replace the svg element with [this updated SVG](https://github.com/alphagov/govuk-frontend/blob/70be4b7fcaed406c4aeaf9618da52de1b3ff02db/packages/govuk-frontend/src/govuk/components/header/template.njk#L14-L26), and make sure you also update the class name and attributes

This change was introduced in [pull request #4449: Implement transitional crown in the Header component (v5.0)](https://github.com/alphagov/govuk-frontend/pull/4449).

#### Check your favicons, app icons and OpenGraph image still work

We've changed the names, formats and sizes of icon assets we distribute in Frontend. You will want to check that the correct files are copied in the right place and served at the right URLs.

The following files have been added to the assets folder:

- manifest.json
- images/favicon.svg
- images/govuk-icon-180.png
- images/govuk-icon-192.png
- images/govuk-icon-512.png
- images/govuk-icon-mask.svg

The following files have been removed from the assets folder:

- images/govuk-apple-touch-icon.png
- images/govuk-apple-touch-icon-152x152.png
- images/govuk-apple-touch-icon-167x167.png
- images/govuk-apple-touch-icon-180x180.png
- images/govuk-mask-icon.svg

If you're not using the Nunjucks page template, you will need to replace the list of icons in the template's head with the following:

```html
<link rel="icon" sizes="48x48" href="/assets/images/favicon.ico">
<link rel="icon" sizes="any" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="mask-icon" href="/assets/images/govuk-icon-mask.svg" color="#0b0c0c">
<link rel="apple-touch-icon" href="/assets/images/govuk-icon-180.png">
<link rel="manifest" href="/assets/manifest.json">
```

You will need to update the file path to match your assets folder if it's not at the default location.

This change was introduced in [pull request #4445: Implement transitional crown favicons (v5.0)](https://github.com/alphagov/govuk-frontend/pull/4445).

#### Remove the fallback GOV.UK crown logo from the  HTML for the Header component

The [Header component](https://design-system.service.gov.uk/components/header/) previously included a fallback PNG version of the GOV.UK crown logo for Internet Explorer 8. As Frontend no longer supports Internet Explorer 8, we've removed this fallback.

If you're not using the Nunjucks macros, you'll need to remove this fallback from your HTML code. In your Header component:

1. Remove the block of HTML containing the `govuk-header__logotype-crown-fallback-image` image, starting with `<!--[if IE 8]>` and ending with `<![endif]-->`.
2. Remove `<!--[if gt IE 8]><!-->` and  `<!--<![endif]-->` from around the `govuk-header__logotype-crown` SVG, but don't remove the SVG.
3. Delete the `govuk-logotype-crown.png` file from your assets folder.

You do not need to change any HTML if you're using the supplied Nunjucks macros, but you might still need to remove the `govuk-logotype-crown.png` image depending on [how you are serving the font and image assets](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#font-and-image-assets).

This change was introduced in [pull request #3641: Remove fallback GOV.UK logo for IE8](https://github.com/alphagov/govuk-frontend/pull/3641).

#### Remove references to `govuk-header__navigation--no-service-name` class from the HTML for the Header component

We've removed the `govuk-header__navigation--no-service-name` class which we deprecated in [GOV.UK Frontend v4.3.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.3.0).

We no longer supply a dedicated class for headers with navigation but no service name. If you still need this feature, you can reproduce it in your own code using the `govuk-spacing` Sass mixin.

You could:

- add a new `app-header-navigation` class to the header's `<nav>` tag (you can use the `navigationClasses` option for the Header component if you're using Nunjucks)
- add the following styles for this class in your Sass:

```scss
.app-header-navigation {
    padding-top: govuk-spacing(7);
}
```

This change was introduced in [pull request #3595: Remove deprecated `govuk-header__navigation--no-service-name` class](https://github.com/alphagov/govuk-frontend/pull/3595).

#### Add the `hidden` attribute to the mobile menu button in the Header component

We've removed some styles from the `govuk-header__menu-button` class. These styles were included on the [mobile menu button](https://design-system.service.gov.uk/components/header/#header-with-service-name-and-navigation) to avoid introducing a breaking change in [GOV.UK Frontend v4.3.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.3.0).

If you're not using Nunjucks macros, and have not done so already, add the `hidden` attribute to the button's HTML to ensure it continues working as expected.

You do not need to make any changes if using the Nunjucks macro.

When working correctly, the button should only show on narrow screens when JavaScript is available. It should be hidden on wider screens or if JavaScript is unavailable.

This change was introduced in [pull request #3596: Remove redundant display style from `govuk-header__menu-button`](https://github.com/alphagov/govuk-frontend/pull/3596).

#### Update references to `govuk-header__link--service-name` class from the HTML for the Header component

We've removed the `govuk-header__link--service-name` class which we deprecated in [GOV.UK Frontend v4.2.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.2.0).

Use the `govuk-header__service-name` class instead.

This change was introduced in [pull request #3594: Remove deprecated `govuk-header__link--service-name` class](https://github.com/alphagov/govuk-frontend/pull/3594).

#### Update references to `govuk-!-margin-static` and `govuk-!-padding-static classes` from the HTML

We've removed the override classes starting with `govuk-!-margin-static` and `govuk-!-padding-static`, which were deprecated in [GOV.UK Frontend v4.3.1](https://github.com/alphagov/govuk-frontend/releases/tag/v4.3.1).

Use the classes starting with `govuk-!-static-margin` and `govuk-!-static-padding` instead.

This change was introduced in [pull request #3593: Remove deprecated static spacing classes](https://github.com/alphagov/govuk-frontend/pull/3593).

#### Update references to the `govuk-warning-text__assistive` class  from the HTML for the Warning Text component

For the [Warning Text component](https://design-system.service.gov.uk/components/warning-text/), we've removed the `govuk-warning-text__assistive` class and its styles from GOV.UK Frontend. This class is unnecessary, as it duplicates the functionality of the `govuk-visually-hidden` class already present in Frontend.

If you're not using Nunjucks macros, update your warning text HTML to replace the `govuk-warning-text__assistive` class with the `govuk-visually-hidden` class.

This change was introduced in [pull request #3569: Remove unnecessary class from Warning Text component](https://github.com/alphagov/govuk-frontend/pull/3569).

#### Check your browser console for component initialisation errors

GOV.UK Frontend JavaScript components now provide errors if you initialise a component incorrectly.

These errors will be:

- logged in the browser console when using the `initAll()` function
- [thrown as exceptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) when [instantiating components individually](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#select-and-initialise-an-individual-component)

To make sure the components behave as intended, we encourage you to check your browser console and address any errors by updating your markup or configuration.

Errors you might see include:

- `SupportError` - when GOV.UK Frontend is not supported in the current browser
- `ElementError` - when component templates have missing or broken HTML elements
- `ConfigError` - when component JavaScript configuration does not match our documentation

These changes were introduced in:

- [pull request #4030: Throw `SupportError` when instantiating components where GOV.UK Frontend is not supported](https://github.com/alphagov/govuk-frontend/pull/4030)
- [pull request #4104: Throw `ElementError` when the module is not of the expected type](<[https://github.com/alphagov/govuk-frontend/pull/4104](https://github.com/alphagov/govuk-frontend/pull/4104)>))
- [pull request #4177: Add `MissingElementError` and use it within the Skip Link](https://github.com/alphagov/govuk-frontend/pull/4177)
- [pull request #4199: Throw `ElementError` when "Exit this page" button is missing](https://github.com/alphagov/govuk-frontend/pull/4199)
- [pull request #4206: Throw `ElementError` when the menu of the header is missing but a toggle is present](https://github.com/alphagov/govuk-frontend/pull/4206)
- [pull request #4236: Throw `ElementError` for missing elements during Character count instantiation](<[https://github.com/alphagov/govuk-frontend/pull/4236](https://github.com/alphagov/govuk-frontend/pull/4236)>))
- [pull request #4261: Throw `ElementError` for missing elements during Character count instantiation](https://github.com/alphagov/govuk-frontend/pull/4261)
- [pull request #4266: Throw errors during accordion initialisation](https://github.com/alphagov/govuk-frontend/pull/4266)
- [pull request #4176: Throw `ConfigError` when component configs are invalid](<[https://github.com/alphagov/govuk-frontend/pull/4176](https://github.com/alphagov/govuk-frontend/pull/4176)>))

#### Check any JavaScript that uses `HTMLElement.getAttribute` to get the disabled state of a button works as expected

The `disabled` attribute on 'Disabled buttons' created using our Nunjucks macros no longer includes a value.

If you are using `$button.getAttribute('disabled')` to check for the disabled attribute in JavaScript, this will now return an empty string. This might cause unexpected behaviour if you are relying on the return value being the string 'disabled' or being [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

Instead, we recommend checking for the `disabled` attribute using [`$button.hasAttribute('disabled')`](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) or the [`$button.disabled` IDL attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/disabled).

This change was introduced in [pull request #2830: Set the boolean disabled attribute consistently in the Button component](https://github.com/alphagov/govuk-frontend/pull/2830).

#### Check that inverse buttons still look as expected if you have customised the brand colour

[Inverse button components](https://design-system.service.gov.uk/components/button/#buttons-on-dark-backgrounds) now use the `$govuk-brand-colour` setting to determine the button's text colour and the button's background tint when hovered or activated. The button will only look different if `$govuk-brand-colour` has been changed from the default.

You can restore the previous blue colour by setting `$govuk-inverse-button-text-colour` before importing the button component's Sass.

```scss
@import "node_modules/govuk-frontend/govuk/base";

$govuk-inverse-button-text-colour: govuk-colour("blue");

@import "node_modules/govuk-frontend/govuk/components/button/index";
```

This change was introduced in [pull request #4043: Add ability to customise inverse button colours](https://github.com/alphagov/govuk-frontend/pull/4043).

#### Check any Selects that have options without explicit values work as expected

The `govukSelect` macro will no longer include an empty value attribute for options that do not have a value set.

If that option is selected, the value of the Select will become the text content of the option, rather than an empty string.

If you need to maintain the existing behaviour, you can set the value to an empty string.

This change was introduced in [pull request #3773: Omit the value attribute from select options with no value](https://github.com/alphagov/govuk-frontend/pull/3773).

### New features

#### Use the Task list component to give users an overview of the tasks they need to complete

The [Task list component](https://design-system.service.gov.uk/components/task-list/) displays all the tasks a user needs to do, and allows users to easily identify which ones are done and which they still need to do.

Each task in the list can have a title, status, link and an optional hint. When a link is added, the whole row is clickable.

This change was introduced in [pull request #2261: Task list component.](https://github.com/alphagov/govuk-frontend/pull/2261).

#### Use the new focus style for links containing non-text content

We've added a new focus style for use with non-text content, such as links containing images and focusable elements that are not form controls. This new style paints a visible yellow and black outline around the entire element, ensuring the focus style is visible in all situations.

For links containing images, we've added the `govuk-link-image` class. You should only use this class on links containing an image. If it also contains text, continue to use `govuk-link` instead.

```html
<a class="govuk-link-image" href="#">
  <img src="..." alt="...">
</a>
```

You can use these styles in your own code by including the `govuk-focused-box` Sass mixin.

This change was introduced in [pull request #3819: Add linked image focus style](https://github.com/alphagov/govuk-frontend/pull/3819).

#### New link styles are now enabled by default

In GOV.UK Frontend v3.12.0 we introduced new link styles which are now enabled by default. They have:

- underlines that are consistently thinner and a bit further away from the link text
- a clearer hover state, where the underline gets thicker to make the link stand out to users

The new link styles are now enabled by default. If you are setting `$govuk-new-link-styles` to `true` in your Sass you can now remove this.

This change was introduced in:

- [pull request #3599: Enable new link styles by default](https://github.com/alphagov/govuk-frontend/pull/3599)
- [pull request #3600: Remove new link styles feature flag](https://github.com/alphagov/govuk-frontend/pull/3600)

#### Customise the colours of inverse buttons

For non-GOV.UK branded websites, you can now change the colours of inverse buttons - buttons intended for use on dark backgrounds.

To change the inverse button's background colour, set the `$govuk-inverse-button-background-colour` Sass variable.

To change the inverse button's text colour, set the `$govuk-inverse-button-text-colour` Sass variable.

```scss
@import "node_modules/govuk-frontend/govuk/base";

$govuk-inverse-button-background-colour: govuk-colour("yellow");
$govuk-inverse-button-text-colour: govuk-colour("black");

@import "node_modules/govuk-frontend/govuk/components/button/index";
```

This change was introduced in [pull request #4043: Add ability to customise inverse button colours](https://github.com/alphagov/govuk-frontend/pull/4043).

#### Precompiled CSS and JavaScript

The precompiled CSS and JavaScript files found in our [GitHub releases](https://github.com/alphagov/govuk-frontend/releases) are now also published to [`govuk-frontend` on npm](https://www.npmjs.com/package/govuk-frontend).

These changes were introduced in:

- [pull request #3726: Default to ES modules with single Rollup config](https://github.com/alphagov/govuk-frontend/pull/3726)
- [pull request #4241: Add new `govuk-frontend.min.css` package bundle](https://github.com/alphagov/govuk-frontend/pull/4241)

#### Check your tags align with design changes to the Tag component

We've changed the design of the [Tag component](https://design-system.service.gov.uk/components/tag/) to improve accessibility and readability.

Text within the tag is no longer bold and uppercase with extra letter spacing. It's now regular 19px text with the first letter of a word capitalised and the rest of the content lowercase. Due to this, there might be changes to the width of existing tags.

The colours have also changed to make them more distinguishable from buttons.

Check your service is using the correct capitalisation in the contents of tags and tags within phase banners.

This change was introduced in:

- [pull request #3502: Tag design changes](https://github.com/alphagov/govuk-frontend/pull/3502)
- [pull request #3731: Remove the first letter modifier from the tag component](https://github.com/alphagov/govuk-frontend/pull/3731)

### Recommended changes

We've recently made some non-breaking changes to GOV.UK Frontend. Implementing these changes will make your service work better.

#### Remove the X-UA-Compatible meta tag

Remove the <meta http-equiv="X-UA-Compatible" content="IE=edge"> meta tag from your page template.

Internet Explorer versions 8, 9 and 10 included a feature that would try to determine if the page was built for an older version of IE and would silently enable compatibility mode, which would modify the rendering engine's behaviour to match the older version of IE. Setting this meta tag prevented that behaviour.

Internet Explorer 11 deprecated this meta tag and defaulted to always using IE11's renderer when the page has a HTML5 doctype (<!DOCTYPE html>).

As Frontend no longer supports Internet Explorer versions older than 11, you can now remove this meta tag.

This change was introduced in [pull request #4434: Remove X-UA-Compatible meta tag](https://github.com/alphagov/govuk-frontend/pull/4434).

#### Update the Pagination component's default `aria-label`

We've updated the default value of the [Pagination component's](https://design-system.service.gov.uk/components/pagination/) `aria-label` to be more descriptive of the contents of the region. If you're using the component's default label, you might wish to update it to the new default of 'Pagination'.

You do not need to change anything if you're using the `govukPagination` Nunjucks macro.

This change was introduced in [pull request #3899: Update default `aria-label` in Pagination component](https://github.com/alphagov/govuk-frontend/pull/3899).

#### Update the Exit this Page button's default text

We've updated the default text of the Exit this Page button. It now includes visually-hidden text to clarify that the button is a safety tool and not a generic method of leaving the current page.

If you are using the component's default text, you might wish to update it to the new value: `<span class="govuk-visually-hidden">Emergency</span> Exit this page`

You do not need to change anything if you're using the `govukExitThisPage` Nunjucks macro.

This change was introduced in [pull request #3989: Update default Exit This Page button text](https://github.com/alphagov/govuk-frontend/pull/3989).

#### Add the `rel` attribute to the Exit this Page button and secondary link

Update the Exit this Page button and secondary link to include a new attribute and value: `rel="nofollow noreferrer"`.

Adding this attribute does 2 things:

- it instructs search engines that your service does not endorse the external website for the purposes of determining search engine rankings
- it instructs web browsers to not send information about your service to the external website

This fixes a potential risk where the external website could detect that a user had visited from a GOV.UK page and play that information back to the user, which could risk a user's personal safety in some contexts.

You do not need to change the Exit this Page button if you're using the `govukExitThisPage` Nunjucks macro. You will still have to update the secondary link manually.

This change was introduced in [pull request #4054: Add `rel` attribute to the Exit this Page button](https://github.com/alphagov/govuk-frontend/pull/4054). Thanks to [Greg Tyler](https://github.com/gregtyler) for reporting this issue.

#### Update titles of the action links inside the Summary Card

If you're not using our Nunjucks macro, we recommend you update the action links :

- of the Summary Card (inside the element with the `govuk-summary-card__actions` class)
- of the Summary List it contains (inside the element with the `govuk-summary-list__actions` class)

You'll need to either:

- append a visually hidden `<span>` with the title of the card, if there's none already
- or append the title of card to the existing visually hidden span, if there was one already

The final link should be structured as such:

```html

<a class="govuk-link <EXISTING_CLASSES>" <EXISTING_ATTRIBUTES>>
  <EXISTING_VISIBLE_TITLE>
  <span class="govuk-visually-hidden">
    <EXISTING_HIDDEN_TEXT_IF_PRESENT>
    <SUMMARY_CARD_TITLE>
  </span>
</a>
```

This is to make sure each link has a unique accessible name, which will help users of assistive technology distinguish them from one another.

This change was introduced in [pull request #3961: Append card title to action links inside of a Summary Card](https://github.com/alphagov/govuk-frontend/pull/3961).

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#3777: Fix hover style on small checkboxes and radio buttons in High Contrast Mode](https://github.com/alphagov/govuk-frontend/pull/3777)
- [#3791: Refactor mobile menu button label/text handling](https://github.com/alphagov/govuk-frontend/pull/3791)
- [#3862: Fix focus style being overlapped by summary action links](https://github.com/alphagov/govuk-frontend/pull/3862)
- [#4113: Always set an explicit button `type`](https://github.com/alphagov/govuk-frontend/pull/4113)
- [#4267: Remove unnecessary duplicated use of govuk-font](https://github.com/alphagov/govuk-frontend/pull/4267)
- [#4268: Allow border and hover colours to be overridden](https://github.com/alphagov/govuk-frontend/pull/4268)
- [#4327: Fix Nunjucks default() values when null, false or "" is provided](https://github.com/alphagov/govuk-frontend/pull/4327)
- [#4416: Review and fix HTML attribute trailing spaces etc](https://github.com/alphagov/govuk-frontend/pull/4416)
- [#4450: Update descriptions for Nunjucks macro options + fixes](https://github.com/alphagov/govuk-frontend/pull/4450)

## 4.7.0 (Feature release)

Note: This release was created from the `support/4.x` branch.

### New features

#### Added the Exit This Page component to help users quickly exit a page or service

You can now choose to use the [exit this page](https://design-system.service.gov.uk/components/exit-this-page/) component to help users quickly leave a page or service which contains sensitive information.

This was added in [pull request #2545: Add exit this page component](https://github.com/alphagov/govuk-frontend/pull/2545).

#### Added inverse modifier for buttons on dark backgrounds

You can now choose to use the `govuk-button--inverse` class to style buttons on dark backgrounds with a white background colour.

This change was made in [pull request #3556: Add inverse button styles](https://github.com/alphagov/govuk-frontend/pull/3556).

#### Added inverse modifier for breadcrumbs on dark backgrounds

You can now choose to use the `govuk-breadcrumbs--inverse` class to style breadcrumbs on dark backgrounds with white text, links and arrows.

This change was made in [pull request #3774: Add inverse breadcrumb and back link modifiers and styles](https://github.com/alphagov/govuk-frontend/pull/3774).

#### Added inverse modifier for back links on dark backgrounds

You can now choose to use the `govuk-back-link--inverse` class to style back links on dark backgrounds with white links and arrows.

This change was made in [pull request #3774: Add inverse breadcrumb and back link modifiers and styles](https://github.com/alphagov/govuk-frontend/pull/3774).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#3817: Fix package resolution in Node.js 17+](https://github.com/alphagov/govuk-frontend/pull/3817)
- [#3836: Announce whitespace in screen reader announcements of visually hidden text](https://github.com/alphagov/govuk-frontend/pull/3836)

## 4.6.0 (Feature release)

### New features

#### Updated the appearance of disabled form controls

We’ve updated the disabled state of Text Input, Textarea, Select and File Upload components so it is consistent across browsers and devices. They’re also now consistent with the existing disabled styles for Buttons, Checkboxes, and Radios.

Disabled form controls appear at 50% opacity and with an alternative cursor appearance when hovered over.

This was added in [pull request #3187: Add disabled styles for form controls](https://github.com/alphagov/govuk-frontend/pull/3187).

#### Added a top-level `disabled` parameter to form controls

We’ve updated the Nunjucks macros for Text Input, Textarea, Select and File Upload components to include a top-level `disabled` parameter. This will make it easier to enable the disabled state for these controls.

```nunjucks
{{ govukInput({
  id: "disabled-input",
  name: "disabled-input",
  value: "Unchangeable value",
  disabled: true
}) }}
```

Disabled form controls have poor contrast and can confuse some users, so avoid them if possible.

Only use disabled form controls if research shows it makes the user interface easier to understand.

This was added in [pull request #3187: Add disabled styles for form controls](https://github.com/alphagov/govuk-frontend/pull/3187).

#### Configure whether the Accordion remembers and restores sessions

By default, when a user leaves a page, the [Accordion](https://design-system.service.gov.uk/components/accordion/) will remember the layout of expanded and collapsed sections selected by the user. If the user returns to the page, this layout will be restored and override any sections manually set as expanded in code.

You can now disable this functionality by using the `rememberExpanded` option in the `govukAccordion` Nunjucks macro.

If you're not using the Nunjucks macro, you can disable it using the `data-remember-expanded` HTML attribute.

This was added in [pull request #3342: Add option to disable sessionState in Accordion](https://github.com/alphagov/govuk-frontend/pull/3342).

#### Added `id` parameter to Buttons

We’ve updated the [Button](https://design-system.service.gov.uk/components/button/) Nunjucks macro to include an optional `id` parameter.

```nunjucks
{{ govukButton({
  text: "Save and continue",
  id: "continue-button"
}) }}
```

This was added in [pull request #3344: Adding optional ‘id’ attribute to button component](https://github.com/alphagov/govuk-frontend/pull/3344).

Thanks to [Tom Billington](https://github.com/TomBillingtonUK) for this contribution.

#### Added a modifier for text input styles that accept sequences of digits

We've added a new `.govuk-input--extra-letter-spacing` class for [Text Input](https://design-system.service.gov.uk/components/text-input/). This increases readability of text inputs that receive sequences of digits (like security codes, references or phone numbers).

You can add it through the `classes` option when using Nunjucks, or directly in the `class` attribute of the `<input>` when using HTML.

This was added in [pull request #2230: Add extra letter spacing modifier for inputs](https://github.com/alphagov/govuk-frontend/pull/2230)

### Deprecated features

#### Stop using JavaScript API properties other than the `init` method

We have deprecated all of the JavaScript properties in the API, except for the `init` method for each component. We'll make all of the deprecated JavaScript properties private in [our next main release](https://github.com/alphagov/govuk-frontend/milestone/46).

Please [let us know if you're using parts of the API other than the `init` method by filling in this form](https://docs.google.com/forms/d/e/1FAIpQLSfmH2AitMeouXqB0FWC5p5e6y1TSiFCjmJ8DrVuwfmpRGCaWw/viewform?usp=sf_link). We'll use this information when prioritising future additions to the public API.

This was added in [pull request #3499: Deprecate all JavaScript instance properties the except `init` method](https://github.com/alphagov/govuk-frontend/pull/3499).

#### Stop using the `.govuk-button--disabled` class on buttons

We have deprecated the `.govuk-button--disabled` class and will remove it in the next major release.

If a [Button](https://design-system.service.gov.uk/components/button/) uses a `<button>` or `<input>` element, use the disabled HTML attribute instead.

You will not need to make any changes if you're using the `govukButton` Nunjucks macro.

Disabling links that are styled to look like buttons will not be supported by future releases.

This was added in [pull request #3326: Deprecate `govuk-button--disabled` class](https://github.com/alphagov/govuk-frontend/pull/3326).

#### Stop using the deprecated Internet Explorer 8 mixins and settings

The next main release of GOV.UK Frontend will remove support for Internet Explorer 8 (IE8). In preparation for this, we've deprecated the settings and mixins used when [generating IE8 specific stylesheets](https://frontend.design-system.service.gov.uk/supporting-ie8/#2-generate-an-ie8-specific-stylesheet).

You'll start seeing deprecation warnings if you're:

- using the [`govuk-if-ie8`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-if-ie8) and [`govuk-not-ie8`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-not-ie8) mixins in your own Sass code (for example `@include govuk-if-ie8`)
- changing the [`$govuk-is-ie8`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-is-ie8) and [`$govuk-ie8-breakpoint`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-ie8-breakpoint) settings to anything other than their default values

If you no longer need to support IE8, we recommend you stop generating an IE8 specific stylesheet and remove references to the IE8 mixins from your code.

You can also silence these deprecation warnings by adding `ie8` to the [`$govuk-suppressed-warnings`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-suppressed-warnings) setting, but once we’ve released v5.0 you will need to address them as part of the upgrade process.

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#3255: Including the JavaScript source map in the prototype kit config](https://github.com/alphagov/govuk-frontend/pull/3255)
- [#3272: Add empty alt attribute to logo IE8 fallback PNG](https://github.com/alphagov/govuk-frontend/pull/3272)
- [#3306: Re-enable complete hover link styles on the footer](https://github.com/alphagov/govuk-frontend/pull/3306)
- [#3312: Add default value for warning text icon fallback attribute](https://github.com/alphagov/govuk-frontend/pull/3312)
- [#3426: Add organisation brand colour for Department for Business & Trade](https://github.com/alphagov/govuk-frontend/pull/3426) - thanks to [Barbara Slawinska](https://github.com/baisa) for contributing this change
- [#3454: Update default link underline offset setting](https://github.com/alphagov/govuk-frontend/pull/3454)

## 4.5.0 (Feature release)

### New features

#### Use summary cards to visually separate multiple summary lists on a single page

You can now use the [summary card](https://design-system.service.gov.uk/components/summary-list#summary-cards). This new variant of the Summary list component can help you:

- design and build pages with multiple summary lists
- show visual dividers between summary lists
- allow users to apply actions to entire lists

This was added in [pull request #2931: Add summary card enhancement to summary list](https://github.com/alphagov/govuk-frontend/pull/2931).

#### Search within accordion content on supporting browsers

We've updated the Accordion component to use the new [`hidden="until-found"` attribute value](https://developer.chrome.com/articles/hidden-until-found/).

This allows the browser's native 'find in page' functionality to search within and automatically open sections of the accordion. Currently, this functionality is only supported by recent versions of Google Chrome, Microsoft Edge and Samsung Internet.

This was added in pull requests:

- [#3053: Enhance the Accordion component with `hidden='until-found'`](https://github.com/alphagov/govuk-frontend/pull/3053)
- [#3095: Hide Accordion content (again) during `.js-enabled` page load](https://github.com/alphagov/govuk-frontend/pull/3095)

#### Source maps for precompiled files

You can now use [source maps](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/use_a_source_map/index.html) to help identify errors and console messages from GOV.UK Frontend precompiled files.

This was added in [pull request #3023: Add source maps to compiled JavaScript and CSS](https://github.com/alphagov/govuk-frontend/pull/3023).

### Fixes

We've fixed errors in IE8 caused by updates to our precompiled JavaScript. The issue prevented some polyfills from running, but was limited to the `release-v4.4.1.zip` and `release-v4.4.0.zip` assets on [GitHub releases](https://github.com/alphagov/govuk-frontend/releases):

- [#3137: Enable UglifyJS compatibility workarounds](https://github.com/alphagov/govuk-frontend/pull/3137)
- [#3013: Swap JavaScript minifier from UglifyJS to terser](https://github.com/alphagov/govuk-frontend/pull/3013)

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#2998: Refactor back link and breadcrumb chevrons to use ems](https://github.com/alphagov/govuk-frontend/pull/2998)
- [#3021: Change colour for current page link in the header to improve contrast when printing](https://github.com/alphagov/govuk-frontend/pull/3021) - thanks to [Malcolm Butler](https://github.com/MalcolmVonMoJ) for the contribution
- [#3094: Fix Accordion margin/padding inconsistencies](https://github.com/alphagov/govuk-frontend/pull/3094)
- [#3112: Remove unused `classList` polyfill from header component JavaScript](https://github.com/alphagov/govuk-frontend/pull/3112)
- [#3150: Add missing `Event` polyfill to accordion component JavaScript](https://github.com/alphagov/govuk-frontend/pull/3150)
- [#3156: Correct the closing double quotes in pagination Nunjucks](https://github.com/alphagov/govuk-frontend/pull/3156) - thanks to [Joanna Pinto Paul](https://github.com/JoPintoPaul) for the contribution
- [#3199: Fix Sass rounding issues with width of grid columns](https://github.com/alphagov/govuk-frontend/pull/3199)

## 4.4.1 (Fix release)

Note: This release was created from the `support/4.4.x` branch.

### Fixes

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#3087: Fix focus styles for links split over multiple lines in Chromium 108+ (Chrome 108+, Edge 108+, Opera 94+)](https://github.com/alphagov/govuk-frontend/pull/3087)

## 4.4.0 (Feature release)

### New features

#### Change the Button component's background and text colour

For non-GOV.UK branded websites, you can now change the Button component background and text colour.

To change the Button component background colour, set the `$govuk-button-background-colour` Sass variable.

To change the Button component text colour, set the `$govuk-button-text-colour` Sass variable.

```scss
@import "node_modules/govuk-frontend/govuk/base";

$govuk-button-background-colour: govuk-colour("yellow");
$govuk-button-text-colour: govuk-colour("black");
@import "node_modules/govuk-frontend/govuk/components/button/index";
```

This was added in [pull request #2752: Change the Button component background and text colour](https://github.com/alphagov/govuk-frontend/pull/2752). Thanks to [Nick Colley](https://github.com/NickColley) for this contribution.

#### Localise the navigation menu toggle button

When using the [header](https://design-system.service.gov.uk/components/header/) Nunjucks macro, you can now translate the text of the mobile navigation menu toggle button by using the `menuButtonText` parameter.

You should avoid lengthy values for the `menuButtonText` parameter. If the text is too long it can overflow and cause visual issues.

This was added in [pull request #2720: Add parameter to localise mobile menu toggle button](https://github.com/alphagov/govuk-frontend/pull/2720).

#### Localise the character count's textarea description/fallback text

When using the [character count](https://design-system.service.gov.uk/components/character-count/) Nunjucks macro, you can now translate the description of textarea by using the `textareaDescriptionText` option.

This text is announced by screen readers when the character count input is focused. It's also displayed visually as a fallback if JavaScript is not available.

This was added in [pull request #2742: Add ability to customise character count fallback text](https://github.com/alphagov/govuk-frontend/pull/2742), and the option renamed to `textareaDescriptionText` in [pull request #2915](https://github.com/alphagov/govuk-frontend/pull/2915).

#### Localise the character count's counter message

You can now translate the text shown by the [character count](https://design-system.service.gov.uk/components/character-count/) component to inform users of:

- when they have reached the maximum number of characters or words
- the number of characters or words over or under the allowed maximum

The Nunjucks macro accepts new options so you can customise each message. You can:

- Use `charactersAtLimitText` or `wordsAtLimitText` to provide the text that shows when users have reached the limit.
- Use `charactersUnderLimitText` or `wordsUnderLimitText` to provide the text that shows when users are under the limit. The component will pluralise the message according to the configured locale and the number of characters or words remaining.
- Use `charactersOverLimitText` or `wordsOverLimitText` to provide the text that shows when users are over the limit. The component will pluralise the message according to the configured locale and the number of characters or words remaining.

You'll find guidance about [the plural forms in our documentation about localising GOV.UK Frontend](https://frontend.design-system.service.gov.uk/localise-govuk-frontend/). The component will replace `%{count}` with the number of characters over or under the limit.

If you're not using Nunjucks macros, you can use data-\* attributes to provide these translations. Within the attribute value, any [quotation marks or other characters reserved by HTML](https://developer.mozilla.org/en-US/docs/Glossary/Entity#reserved_characters) needs to be converted into their HTML entity equivalents.

You can:

- use `data-i18n.characters-at-limit` or `data-i18n.words-at-limit` for when users are at the limit
- configure the text that informs the end user they are under the character or word limit, by using `data-i18n.characters-under-limit.{other,many,few,two,one,zero}` or `data-i18n.words-under-limit.{other,many,few,two,one,zero}`, with one suffix for each plural form required by your locale
- configure the text that informs the end user they are over the character or word limit, by using `data-i18n.characters-over-limit.{other,many,few,two,one,zero}` or `data-i18n.words-over-limit.{other,many,few,two,one,zero}`, with one suffix for each plural form required by your locale

You can also provide these messages using a JavaScript configuration object when creating an instance of the component or initialising all components. See [our guidance on localising GOV.UK Frontend](https://frontend.design-system.service.gov.uk/localise-govuk-frontend/) for how to do this.

This was added in the following pull requests:

- [#2895 Add macro options to configure CharacterCount translations](https://github.com/alphagov/govuk-frontend/pull/2895)
- [#2887 Allow CharacterCount component to receive i18n config via JS](https://github.com/alphagov/govuk-frontend/pull/2887)

#### Localise the character count's input description for assistive technologies

When configuring the character count's limit in JavaScript, you can customise the description provided to assistive technologies when users focus the input (so it indicates the overall limit of characters or words).

Depending on the [plural form required by your locale](https://frontend.design-system.service.gov.uk/localise-govuk-frontend/#understanding-pluralisation-rules), you can pass the description in the HTML using the `data-i18n.textarea-description.{other,many,few,two,one,zero}` attribute on the element to provide the text to set as the description.

You can also provide these messages using a JavaScript configuration object when creating an instance of the component or initialising all components. See [our guidance on localising GOV.UK Frontend](https://frontend.design-system.service.gov.uk/localise-govuk-frontend/) for how to do this.

This was added in [pull request #2915](https://github.com/alphagov/govuk-frontend/pull/2915).

#### Localise the accordion's toggle buttons

You can now translate the text of the [accordion](https://design-system.service.gov.uk/components/accordion/) component's show and hide toggle buttons.

When using the Nunjucks macro, you can use the new `showSectionText` and `hideSectionText` parameters to customise the text of the 'show' and 'hide' toggles in each section.

You can also use `showAllSectionsText` and `hideAllSectionsText` parameters to customise the text of the toggle at the top of the accordion.

If you're not using the Nunjucks macro, you can customise these using data-\* attributes. Within the attribute value, any [quotation marks or other characters reserved by HTML](https://developer.mozilla.org/en-US/docs/Glossary/Entity#reserved_characters) needs to be converted into their HTML entity equivalents.

- `data-i18n.show-section`
- `data-i18n.show-section-aria-label`
- `data-i18n.hide-section`
- `data-i18n.hide-section-aria-label`
- `data-i18n.show-all-sections`
- `data-i18n.hide-all-sections`

You can also change this text for all instances of the Accordion using a JavaScript configuration object. See [our guidance on localising GOV.UK Frontend](https://frontend.design-system.service.gov.uk/localise-govuk-frontend/) for how to do this.

This was added in pull requests:

- [#2818: Add support for localisation via data-\* attributes to Accordion component](https://github.com/alphagov/govuk-frontend/pull/2818)
- [#2826: Add support for localisation via JavaScript configuration to Accordion component](https://github.com/alphagov/govuk-frontend/pull/2826)

#### Suppress deprecation warnings

You can now suppress warnings from deprecations within GOV.UK Frontend by updating the `$govuk-suppressed-warnings` map in Sass. Every deprecation warning will now include a warning "key" which you can use in the following code, placed at the root of your sass project:

```scss
$govuk-suppressed-warnings: (
  deprecated-feature
);
```

This was added in [#2911 Add warning suppression functionality](https://github.com/alphagov/govuk-frontend/pull/2911)

#### Configure components in JavaScript

JavaScript components can get the same configuration options in 2 ways - through data attributes, as before, and now when creating an instance. These components are:

- the `Button` component, for its `preventDoubleClick` option (matching `data-prevent-double-click`)
- the `CharacterCount` component, for its `maxlength`, `maxwords` and `threshold` options (matching `data-maxlength`, `data-maxwords` and `data-threshold`, respectively)
- the `ErrorSummary` component, for its `disableAutoFocus` option (matching `data-disable-auto-focus`)
- the `NotificationBanner` component, for its `disableAutoFocus` option (matching `data-disable-auto-focus`)

You can leave out these configuration options when using the Nunjucks macro and provide configuration when:

- creating a component, in a configuration object as second argument
- initialising components in bulk using `initAll`

For example:

```js
// Creating a single instance
var button = document.querySelector('[data-module="button"]')
new GOVUKFrontend.Button(button, {preventDoubleClick: true})

// Or initialising components in bulk
GOVUKFrontend.initAll({
  button: {
    preventDoubleClick: true
  }
  // Or, for the other components,
  // characterCount: {/* options */},
  // errorSummary: {/* options */},
  // notificationBanner: {/* options */}
})
```

You can find more information about component configuration in [GOV.UK Frontend documentation](https://frontend.design-system.service.gov.uk/configure-components-with-javascript/).

This was added in pull requests specific for each components:

- [NotificationBanner – #2843](https://github.com/alphagov/govuk-frontend/pull/2843)
- [ErrorSummary – #2854](https://github.com/alphagov/govuk-frontend/pull/2854)
- [Button – #2867](https://github.com/alphagov/govuk-frontend/pull/2867)
- [CharacterCount – #2883](https://github.com/alphagov/govuk-frontend/pull/2883)

### Recommended changes

#### Update the HTML for the error summary

If you're not using the Nunjucks macros, you can improve the experience for screen reader users by making these changes to the error summary markup:

- Remove `aria-labelledby="error-summary-title"` and `role="alert"` from the parent element (`govuk-error-summary`)
- Add a `div` wrapper around the contents of `govuk-error-summary` with the attribute `role="alert"`
- Remove `id="error-summary-title"` from the error summary `h2` (`govuk-error-summary__title`)

This will enable screen reader users to have a better, more coherent experience with the error summary. It will make sure users of JAWS 2022 or later will hear the entire contents of the error summary on page load and therefore have further context on why there is an error on the page they're on.

This was added in [pull request #2677: Amend error summary markup to fix page load focus bug in JAWS 2022](https://github.com/alphagov/govuk-frontend/pull/2677).

### Deprecated features

#### Stop using the compatibility mode settings

In GOV.UK Frontend v5.0 we will stop supporting compatibility with legacy codebases. We are therefore deprecating the compatibility mode variables associated with legacy codebases:

- `$govuk-compatibility-govukfrontendtoolkit`
- `$govuk-compatibility-govuktemplate`
- `$govuk-compatibility-govukelements`

This was introduced in [pull request #2882: Deprecate compatibility mode settings](https://github.com/alphagov/govuk-frontend/pull/2882).

#### Stop using settings associated with legacy codebases

In GOV.UK Frontend v5.0 we will stop supporting compatibility with legacy codebases. As part of this, we're deprecating settings controlled by compatibility mode variables. This includes the `govuk-compatibility` mixin and the following settings:

- `$govuk-use-legacy-palette`
- `$govuk-use-legacy-font`
- `$govuk-typography-use-rem`
- `$govuk-font-family-tabular`

This was introduced in [pull request #2844: Remove compatibility mode from govuk-frontend](https://github.com/alphagov/govuk-frontend/pull/2844).

### Fixes

In [pull request 2851: Support Prototype Kit v13](https://github.com/alphagov/govuk-frontend/pull/2851) we've introduced support for the plugins system included in the upcoming Prototype Kit v13.

We've made fixes to GOV.UK Frontend in the following pull requests:

- [#2807: Tidy up and refactor the Character Count JavaScript](https://github.com/alphagov/govuk-frontend/pull/2807)
- [#2811: Use Element.id to get module id for accordion](https://github.com/alphagov/govuk-frontend/pull/2811)
- [#2821: Avoid duplicated --error class on Character Count](https://github.com/alphagov/govuk-frontend/pull/2821)
- [#2800: Improve Pagination component print styles](https://github.com/alphagov/govuk-frontend/pull/2800)
- [#2909: Fix JavaScript errors when entering text into the Character Count in IE8](https://github.com/alphagov/govuk-frontend/pull/2909)

## 4.3.1 (Patch release)

### Recommended changes

#### Replace deprecated `govuk-!-margin-static` and `govuk-!-padding-static` classes

We've fixed an error in the naming convention of the static spacing override classes we'd introduced in v4.3.0. These classes should start with `govuk-!-static`, and we've now deprecated the incorrect classes.

If you're using the static spacing margin override classes, replace any classes starting with `govuk-!-margin-static` with `govuk-!-static-margin`. For example: `govuk-!-margin-static-2` would become `govuk-!-static-margin-2`.

If you're using the static spacing padding override classes, replace any classes starting with `govuk-!-padding-static` with `govuk-!-static-padding`. For example: `govuk-!-padding-static-2` would become `govuk-!-static-padding-2`.

We've deprecated the `govuk-!-margin-static` and `govuk-!-padding-static` classes, and will remove them in a future major release.

This change was introduced in [pull request #2770: Fix ordering of properties in static spacing override classes](https://github.com/alphagov/govuk-frontend/pull/2770). Thanks to @garrystewart for reporting this issue.

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2766: Remove unused `console.log` calls from accordion JavaScript](https://github.com/alphagov/govuk-frontend/pull/2766)

## 4.3.0 (Feature release)

### New features

#### Customise the Open Graph image URL without duplicate meta tags

You can now customise the Open Graph image URL included in the `head` by setting the `opengraphImageUrl` Nunjucks option.

Also, the default Open Graph image URL meta tag will now only be included if you set the either `opengraphImageUrl` or `assetUrl`.

This was added in [pull request #2673: Allow Open Graph image URL to be customised](https://github.com/alphagov/govuk-frontend/pull/2673).

#### Localise the content licence and copyright statements

When using the [footer Nunjucks macro](https://design-system.service.gov.uk/components/footer/#options-default-1), you can now translate the text of the Open Government Licence (OGL) and Crown copyright statements using the `contentLicence` and `copyright` parameters.

Visit [The National Archives' documentation on OGL and Crown copyright](https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/open-government-licence/copyright-notices-attribution-statements/) for information on what you need to include in these statements.

This was added in [pull request #2702: Allow localisation of content licence and copyright notices in Footer](https://github.com/alphagov/govuk-frontend/pull/2702).

#### Pass HTML directly into compatible components

If using the Nunjucks macros, you can now pass HTML content directly into compatible components using [the Nunjucks call syntax](https://mozilla.github.io/nunjucks/templating.html#call). If HTML is provided through the call syntax, the nunjucks macro will ignore the HTML and text options.

Components updated to support this syntax are:

- Details
- Error summary (mapped to `descriptionHtml` parameter)
- Inset text
- Notification banner
- Panel

This was added in [pull request #2734: Update various components to be callable](https://github.com/alphagov/govuk-frontend/pull/2734).

#### Use new override classes to apply static spacing

You can now use static spacing override classes to apply spacing from [the static spacing scale](https://design-system.service.gov.uk/styles/spacing/#static-spacing) to elements of your design.

The new classes start with: `govuk-!-static-` followed by either `margin-` or `padding-`, and then a spacing unit number.

To apply spacing in a single direction, include `left-`, `right-`, `top-`, or `bottom-` just before the spacing unit.

For example:

- `govuk-!-static-margin-9` will apply a 60px margin to all sides of the element at all screen sizes
- `govuk-!-static-padding-right-5` will apply 25px of padding to the right side of the element at all screen sizes
- `govuk-!-static-margin-0` will remove all margins at all screen sizes

This was added in [pull request #2672: Add static spacing override classes](https://github.com/alphagov/govuk-frontend/pull/2672). Thanks to @patrickpatrickpatrick for this contribution.

### Deprecated features

#### Remove deprecated `govuk-header__navigation--no-service-name` class in the header

We've deprecated the `govuk-header__navigation--no-service-name` class, and will remove it in a future major release.

This was added in [pull request #2694: Deprecate .govuk-header\_\_navigation--no-service-name](https://github.com/alphagov/govuk-frontend/pull/2694).

### Recommended changes

We've recently made some non-breaking changes to GOV.UK Frontend. Implementing these changes will make your service work better.

#### Add `hidden` to the mobile menu button in the header component

If you're not using the Nunjucks macros, add the `hidden` attribute to the mobile menu button in the header component. The mobile menu button is `govuk-header__menu-button`.

We've changed the header's mobile menu functionality to use the `hidden` attribute instead of using CSS to show/hide the mobile menu. Adding `hidden` to the mobile menu button by default will make sure that it does not display for users when javascript does not load.

This was added in [pull request 2727: Make use of hidden in header navigation functionality](https://github.com/alphagov/govuk-frontend/pull/2727). Thanks to @NickColley and @kr8n3r for their contributions.

### Fixes

In [pull request 2678: Replace ex units with ems for input lengths](https://github.com/alphagov/govuk-frontend/pull/2678), we changed how we define input lengths in our CSS. Browsers might now display these inputs as being slightly wider than before. The difference is usually fewer than 3 pixels.

We’ve also made fixes in the following pull requests:

- [#2668: Fix Summary List action link alignment](https://github.com/alphagov/govuk-frontend/pull/2668)
- [#2670: Define minimum width for select component](https://github.com/alphagov/govuk-frontend/pull/2670) - thanks @Nosfistis for reporting this issue
- [#2723: Style accordion and tabs text content with govuk-body class](https://github.com/alphagov/govuk-frontend/pull/2723)
- [#2724: Remove redundant aria-hidden attribute from the content when using the Details polyfill](https://github.com/alphagov/govuk-frontend/pull/2724)
- [#2725: Remove padding-right from last column in summary list row](https://github.com/alphagov/govuk-frontend/pull/2725) - thanks @edwardhorsford for reporting this issue and suggesting a fix
- [#2737: Avoid unnecessary spacing-related media queries](https://github.com/alphagov/govuk-frontend/pull/2737)
- [#2747: Ensure accordion uses overriden focus colour](https://github.com/alphagov/govuk-frontend/pull/2747) - thanks @NickColley for reporting this issue and suggesting a fix

## 4.2.0 (Feature release)

### New features

#### Help users navigate through pages with pagination

You can now use [pagination](https://design-system.service.gov.uk/components/pagination/) to help users navigate forwards and backwards through a series of pages. For example, in search results or guidance that's divided into multiple website pages.

This was added in [pull request #2610: Add pagination component](https://github.com/alphagov/govuk-frontend/pull/2610).

#### Check checkboxes by using the `values` Nunjucks option

When using the `govukCheckboxes` Nunjucks macro, you can now use the `values` option to determine which checkboxes should already be checked when the page loads.

For example, `values: ['red', 'blue']` would check any checkboxes that have a `value` of 'red' or 'blue'.

You can use this option instead of setting the boolean `checked` option on each individual checkbox.

This change was introduced in [pull request #2616: Allow selecting options by passing current values](https://github.com/alphagov/govuk-frontend/pull/2616).

#### Check a radio button by using the `value` Nunjucks option

When using the `govukRadios` Nunjucks macro, you can now use the `value` option to determine which radio should already be checked when the page loads.

For example, `value: 'red'` would check the radio that has a `value` of 'red'.

You can use this option instead of setting the boolean `checked` option on each individual radio.

This change was introduced in [pull request #2616: Allow selecting options by passing current values](https://github.com/alphagov/govuk-frontend/pull/2616).

#### Select an option in a select by using the `value` Nunjucks option

When using the `govukSelect` Nunjucks macro, you can now use the `value` option to determine which option should already be selected when the page loads.

For example, `value: 'red'` would select the option that has a `value` of 'red'.

You can use this option instead of setting the boolean `selected` option on each individual option.

This change was introduced in [pull request #2616: Allow selecting options by passing current values](https://github.com/alphagov/govuk-frontend/pull/2616).

### Recommended changes

#### Replace deprecated `govuk-header__link--service-name` class in the header

If you're not using the Nunjucks macros in the header, replace any instances of the class `govuk-header__link--service-name` with `govuk-header__service-name`.

We've deprecated the `govuk-header__link--service-name` class, and will remove it in a future major release.

This change was introduced in [pull request #2617: Do not make the service name in the header a link if no `serviceUrl` is provided](https://github.com/alphagov/govuk-frontend/pull/2617).

#### File extensions added for JavaScript ES Module imports

We have updated our component ES module JavaScript to include [missing file extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions) not provided in release 4.1.0. If you have received an error similar to the following, for example when running or building your application, this fix should resolve the issue.

```
Cannot find module '../node_modules/govuk-frontend/govuk-esm/common' imported from ../node_modules/govuk-frontend/govuk-esm/all.mjs
```

You should not need to make any changes if you are successfully importing our JavaScript as ES modules with version 4.1.0, but there still might be config you can remove. For example, removing `fullySpecified: false` from your Webpack config file.

This change was introduced in [pull request #2658: Add missing mandatory file extensions for ESM JavaScript](https://github.com/alphagov/govuk-frontend/pull/2658). Thanks to @colinrotherham and @tvararu for reporting issues and suggesting and testing fixes.

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2617: Do not make the service name in the header a link if no `serviceUrl` is provided](https://github.com/alphagov/govuk-frontend/pull/2617)
- [#2640: Add top padding to accordion section](https://github.com/alphagov/govuk-frontend/pull/2640)
- [#2644: Allow users to use `require.resolve` to import GOV.UK Frontend JavaScript](https://github.com/alphagov/govuk-frontend/pull/2644) - thanks to @HughePaul for reporting this issue and testing the fix
- [#2647: Allow users to import sass files via Webpack `sass-loader`](https://github.com/alphagov/govuk-frontend/pull/2647) - thanks to @Garethp for reporting this issue, and to @Garethp and @richpjames for testing the fix
- [#2659: Add missing label and legend classes to HTML fixtures](https://github.com/alphagov/govuk-frontend/pull/2659)

## 4.1.0 (Feature release)

### New features

#### Import GOV.UK Frontend JavaScript as ECMAScript (ES) modules

You can now import our component JavaScript into your service as ES modules, if you're using a bundler.

This change allows you to import only the JavaScript you need, and helps reduce duplication of polyfills.

Because we're shipping ES modules in addition to how we currently publish our component JavaScript, this change is backwards compatible. You will not be required to make any changes unless you want to.

If you want to import using ES modules, we recommend you only use `import` to import the JavaScript for components you're using in your service. For example:

```javascript
import { SkipLink, Radios } from 'govuk-frontend'

var $skipLink = document.querySelector('[data-module="govuk-skip-link"]')
if ($skipLink) {
  new SkipLink($skipLink).init()
}

var $radios = document.querySelectorAll('[data-module="govuk-radios]')
if ($radios) {
  for (var i = 0; i < $radios.length; i++) {
    new Radios($radios[i]).init()
  }
}
```

If you need to import all of GOV.UK Frontend's components, then use the `initAll` function to initialise them:

```javascript
import { initAll } from 'govuk-frontend'
initAll()
```

Depending on the bundler you use, you may also need to make changes to your JavaScript bundler configuration file. You can [read more in our installation instructions about importing JavaScript using a bundler](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#import-javascript-using-a-bundler).

This was added in [pull request #2586: Publish our JavaScript as ES modules alongside Universal Module Definition (UMD)](https://github.com/alphagov/govuk-frontend/pull/2586).

### Recommended changes

We've recently made some non-breaking changes to GOV.UK Frontend. Implementing these changes will make your service work better.

#### Remove `aria-live` from the character count component

If you're not using the Nunjucks macros, remove the `aria-live` attribute from the character count message element. This element's content no longer updates, as we've moved the live counter functionality to a new element injected by JavaScript.

This change was introduced in [pull request #2577: Refactor character count to inject new element](https://github.com/alphagov/govuk-frontend/pull/2577).

#### Remove `pattern` from the date input component

If you're not using the Nunjucks macros, remove `pattern="[0-9]*"` from each of the date input's elements.

We originally added the `pattern` attribute to make numeric keypad functionality the default functionality in Safari on iOS. However, we no longer need to use it, as the `inputmode` attribute provides this functionality for newer Safari versions.

This change was introduced in [pull request #2599: Remove `pattern` attribute from date input component](https://github.com/alphagov/govuk-frontend/pull/2599).

### Fixes

We've made the following fixes in [pull request #2577: Refactor character count to inject new element](https://github.com/alphagov/govuk-frontend/pull/2577):

- fix character count message being repeated twice by screen readers
- fix character count hint text being announced as part of the count message
- fix multiple outdated character count messages being announced at once
- fix character count message being announced when input length is below a defined threshold

We’ve also made fixes in the following pull requests:

- [#2549: Fix header with product name focus and hover state length](https://github.com/alphagov/govuk-frontend/pull/2549)
- [#2573: Better handle cases where `$govuk-text-colour` is set to a non-colour value](https://github.com/alphagov/govuk-frontend/pull/2573)
- [#2590: Remove `maxlength` attribute from `textarea` after character count JavaScript has been initialised](https://github.com/alphagov/govuk-frontend/pull/2590)
- [#2615: Fix hints for disabled checkboxes or radios appearing darker than the associated labels](https://github.com/alphagov/govuk-frontend/pull/2615)

## 4.0.1 (Fix release)

### Recommended changes

We've recently made some non-breaking changes to GOV.UK Frontend. Implementing these changes will make your service work better.

#### Remove the `tabindex` attribute from the error summary component

If you're not using Nunjucks macros, remove the `tabindex` attribute from the error summary's HTML. The component JavaScript now adds and removes this attribute.

This change was introduced in [pull request #2491: Prevent error summary from being refocused after it has been initially focused on page load](https://github.com/alphagov/govuk-frontend/pull/2491).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2475: Tweak whitespace HTML for text input component to improve readability](https://github.com/alphagov/govuk-frontend/pull/2475)
- [#2494: Allow disabling autofocus on error summary](https://github.com/alphagov/govuk-frontend/pull/2494)
- [#2514: Fix accordion heading style while JavaScript is disabled](https://github.com/alphagov/govuk-frontend/pull/2514)
- [#2515: Add explicit width to summary list row with 'no actions' pseudo-element](https://github.com/alphagov/govuk-frontend/pull/2515)
- [#2524: Fix select component renders with grey background in Firefox and Safari](https://github.com/alphagov/govuk-frontend/pull/2524)

## 4.0.0 (Breaking release)

### Breaking changes

This release contains a lot of breaking changes, but we expect many of them will only affect a small number of users. However, to make sure your service still works after you upgrade, you should read the release notes and make any required changes.

#### Check your accordions still display as expected

We've changed the design of the accordion. You can [see its new look and read the revised guidance, particularly about when and when not to use accordions](https://design-system.service.gov.uk/components/accordion/).

You should check your accordions still display as expected if you have any:

- accordions with custom styles
- section headings that contain unusual formatting (for example, wrappers)

You do not need to make changes to the content that accordions hide or show, as this release's changes do not affect it.

These changes were introduced in [pull request #2257: Update accordion design](https://github.com/alphagov/govuk-frontend/pull/2257). Thanks to [Mia Allers](https://github.com/mia-allers-gds), [Owen Jones](https://github.com/owenatgov), [Nikin Nagewadia](https://github.com/nnagewad) and [Chris Yoong](https://github.com/chris-gds) for their contributions.

#### Only use the accordion’s summary line for ‘phrasing content’

The summary line is now inside the HTML `button` element, so you can only add ['phrasing content'](https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content-0) to it. Do not use any non-phrasing content, as the resulting HTML will not be valid.

This change was introduced in [pull request #2257: Update accordion design](https://github.com/alphagov/govuk-frontend/pull/2257).

#### Review and revise the accordion's summary line content

Only add a summary line if you need to, as it's likely to make the button text too long.

If you're already using the summary line, review your use of the summary line to make sure you actually need it.

If you need to keep the summary line, [review the accordion guidance](https://design-system.service.gov.uk/components/accordion/) and make the summary line as short as possible.

#### Update the HTML for summary lists

We've updated the HTML for the summary list component to avoid nesting `<span>` elements within `<dd>` elements, which is invalid HTML. This update only affects you if you have summary lists that include a mix of rows with and without actions. You can [read more about adding actions to rows](https://design-system.service.gov.uk/components/summary-list/#adding-actions-to-each-row).

If you're not using Nunjucks macros, do not include an empty `<span class="govuk-summary-list__actions"></span>` in rows without actions. Instead, add the `govuk-summary-list__row--no-actions` modifier class to the row.

This change was introduced in [pull request #2323: Avoid invalid nesting of `<span>` within a `<dd>` in summary list](https://github.com/alphagov/govuk-frontend/pull/2323). Thanks to [Malcolm Hire](https://github.com/malcolmhire) for reporting this issue.

#### Update the HTML for navigation in the header

We've updated the HTML for the header. This update only affects you if your header includes navigation.

Any additional classes passed using the `navigationClasses` Nunjucks option are now applied to the `<nav>` rather than the `<ul>`. Check the additional classes are still doing what you expect.

If you're not using Nunjucks macros, then you should:

- move the `<button>` inside the `<nav>`, immediately before the `<ul>`
- move the `aria-label` attribute from the `<ul>` to the `<nav>`
- move the `govuk-header__navigation` class from the `<ul>` to the `<nav>`
- add the `govuk-header__navigation-list` class to the `<ul>`

[Check your changes against the header example in the Design System](https://design-system.service.gov.uk/components/header/#header-with-service-name-and-navigation) to make sure you have correctly implemented them.

This change was introduced in [pull request #2427: Improve the screen reader experience for the header menu](https://github.com/alphagov/govuk-frontend/pull/2427).

#### Style any custom HTML in your cookie banner

We've removed the default font styles from the cookie banner Sass. This change makes it more obvious when you have not added classes and styles to any custom HTML.

If you're passing custom HTML into the cookie banner component (for example, using the `html` Nunjucks parameter), you must make sure you're applying the appropriate classes and styles to that HTML. This could look like, for example, adding the `govuk-body` class to any paragraph tags. You must do this to prevent your cookie banner displaying with unstyled text.

This change was introduced in [pull request #2432: Remove default font styles from cookie banner Sass](https://github.com/alphagov/govuk-frontend/pull/2432).

#### Update the HTML for hints

In GOV.UK Frontend v3.8.0, we [updated the HTML for hints to use a `<div>` rather than a `<span>` element, to allow the use of block elements](https://github.com/alphagov/govuk-frontend/issues/1835). We've now removed the styles which made the hint `<span>` display as block.

If you’re not using Nunjucks macros, update your hint HTML to use a `<div>` rather than a `<span>`. For example: `<div id="input-hint" class="govuk-hint"></div>` instead of `<span id="input-hint" class="govuk-hint"></span>`.

This change was introduced in [pull request #2437: Remove `display:block` on hint component](https://github.com/alphagov/govuk-frontend/pull/2437).

#### Include JavaScript for skip link to improve screen reader announcements

We've added JavaScript for the skip link component to set focus to the linked element, for example, the main content on the page. This helps screen readers read the linked content when users use the skip link component.

If you're [importing JavaScript for individual components](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#select-and-initialise-an-individual-component), import the skip link JavaScript.

If you're not using Nunjucks macros, add a `data-module="govuk-skip-link"` attribute to the component HTML. For example:

```html
<div class="govuk-skip-link" data-module="govuk-skip-link">
...
</div>
```

Once you've made the changes, check the skip link JavaScript works. To do this, select the skip link and check the linked element (usually the `<main>` element) in the browser has a `tabindex` attribute.

This change was introduced in [pull request #2450: Set focus to skip link target to improve screen reader announcements](https://github.com/alphagov/govuk-frontend/pull/2450).

#### Update the HTML for error messages

We’ve updated the HTML for the error message component to use a `<p>` element instead of a `<span>` element, as this is more semantically correct.

If you’re not using Nunjucks macros, swap the `<span class="govuk-error-message">` for a `<p class="govuk-error-message">`.

This change was introduced in [pull request #2452: Update error messages to use paragraph tags instead of spans](https://github.com/alphagov/govuk-frontend/pull/2452).

#### Check components that conditionally reveal content still work

On radios and checkboxes, the JavaScript now looks within the whole page for conditionally-revealed content. Before, it only looked within the same set of radios or checkboxes.

If you see unexpected behaviour, [make sure the revealed content's `id` is unique within the page the content is on](https://www.w3.org/WAI/WCAG21/Techniques/html/H93). Reusing the same `id` within a page could cause a radio or checkbox to reveal or hide the wrong element, and also means your HTML is invalid.

This change was introduced in [pull request #2370: Prevent issues with conditionally revealed content when content `id` includes CSS syntax characters](https://github.com/alphagov/govuk-frontend/pull/2370).

#### Check the character count component still works as expected

On character counts, the JavaScript now looks within the whole page for the count message, which will be something similar to “You have 200 characters remaining”. Before, it only looked within the character count component.

If you see unexpected behaviour, make sure the `id` for the textarea component is unique within the page the content is on. Reusing the same `id` within a page could cause the wrong count message to update, and also means your HTML is invalid.

This change was introduced in [pull request #2408: Prevent issues with character count when textarea `id` includes CSS syntax characters](https://github.com/alphagov/govuk-frontend/pull/2408).

#### Check individually-imported JavaScript modules work as expected

You do not need to do anything if you have done at least one of the following:

- followed our [Getting Started guide](https://frontend.design-system.service.gov.uk/get-started/#5-get-the-javascript-working) and are importing all of the GOV.UK Frontend JavaScript in one go via `all.js`
- installed GOV.UK Frontend using precompiled files

We've changed the naming of our components' JavaScript modules so individual imports are now attached to
`window.GOVUKFrontend.[ComponentName]` instead of `window.GOVUKFrontend`.

You can now import multiple modules without overwriting the previous one, for example:

```
//= require govuk/components/accordion/accordion.js
//= require govuk/components/button/button.js

# These modules are available under window.GOVUKFrontend.Accordion and window.GOVUKFrontend.Button respectively
```

If you're importing JavaScript modules individually, you should check any references to `window.GOVUKFrontend` in your code and update them to point to the correct component, `window.GOVUKFrontend.[ComponentName]`. You can now remove any workarounds you may have implemented.

This change was introduced in [pull request #2426: Rename exported JavaScript modules to include component name](https://github.com/alphagov/govuk-frontend/pull/2426). Thanks to [Alex Jurubita](https://github.com/alex-ju) for reporting this issue.

#### Import 'base' before importing Sass files from `core` or `overrides` layers

If you import individual files from the `core` or `overrides` layers, you might see the error `Undefined mixin 'govuk-exports'` or `no mixin named govuk-exports` when compiling your Sass.

To fix the error, import `node_modules/govuk-frontend/govuk/base` first. For example:

```scss
@import "node_modules/govuk-frontend/govuk/base";
@import "node_modules/govuk-frontend/core/typography";
```

This change was introduced in [pull request #2455: Remove 'base' import from files in `core` and `overrides` layers](https://github.com/alphagov/govuk-frontend/pull/2455).

#### Import 'template' Sass file from the `objects` layer instead of the `core` layer

If you import the 'template' Sass file from the `core` layer, you might see the error `File to import not found or unreadable: template` when compiling your Sass.

To fix this error, replace any imports of `node_modules/govuk-frontend/govuk/core/template` with `node_modules/govuk-frontend/govuk/objects/template`.

This change was introduced in [pull request #2463: Move template styles from `core` to `objects` layer](https://github.com/alphagov/govuk-frontend/pull/2463).

#### Check your footer displays as expected

We’ve made some fixes to the alignment of columns within the footer component, so they now align with our grid. We've also removed the logic that assumes a 2-section layout displays as a 'two-thirds and one-third' layout. Footer sections now display as full-width by default.

If you're using the Nunjucks macros, check your footer displays as expected and use the `width` macro option to set the width you want for each section.

If you're not using the Nunjucks macros, check your footer displays as expected and use the standard Design System grid classes on the `govuk-footer__section` element to set the width. For example:

```html
<div class="govuk-footer__section govuk-grid-column-two-thirds">...</div>
```

This change was introduced in [pull request #2462: Fix footer alignment with grid classes and add `width` macro option](https://github.com/alphagov/govuk-frontend/pull/2462).

#### Remove deprecated `$govuk-border-width-form-element-error` variable

In [GOV.UK Frontend v3.8.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.8.0), we made the border width of form elements in their error state the same as for form elements in their normal state and deprecated the `$govuk-border-width-form-element-error` variable.

Before, an element's border got thicker to show the element was in an error state. However, elements in their focused state also have a thicker border. As a result, when users focused an element in an error state, the only visible border-change was from red to black. Not all users could perceive this change. So, we reduced the element border's width, to make sure its thickness changes when users focus.

We've now removed `$govuk-border-width-form-element-error` completely.

If you’re referencing `$govuk-border-width-form-element-error` in your own Sass, you must remove it. If you're also defining your own error state, you only need to change the border colour.

You should avoid overriding the border width. For example, replace `border: $govuk-border-width-form-element-error solid $govuk-error-colour;` with `border-color: $govuk-error-colour;`.

You should also remove any override of `$govuk-border-width-form-element-error` from your Sass. This override no longer does anything.

This change was introduced in [pull request #1963: Remove deprecated `$govuk-border-width-form-element-error` variable](https://github.com/alphagov/govuk-frontend/pull/1963).

#### Remove deprecated `govuk-main-wrapper` and `govuk-main-wrapper--l` mixins

We've removed the `govuk-main-wrapper` and `govuk-main-wrapper--l` mixins we deprecated in [GOV.UK Frontend v3.0.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.0.0).

Remove any use of these mixins in your own Sass. You can replace these mixins with direct references to the [spacing mixins](https://design-system.service.gov.uk/styles/spacing/#spacing-on-custom-components).

This change was introduced in [pull request #2385: Remove deprecated `govuk-main-wrapper` and `govuk-main-wrapper--l` mixins](https://github.com/alphagov/govuk-frontend/pull/2385).

#### Remove calls to deprecated `iff` Sass function

We've removed the `iff` function we deprecated in [GOV.UK Frontend version 3.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.6.0).

If you’re calling `iff` from your own Sass, you should use [Sass's native `if` function](https://sass-lang.com/documentation/modules#if) instead.

This change was introduced in [pull request #2409: Remove deprecated `iff` Sass function](https://github.com/alphagov/govuk-frontend/pull/2409).

#### Remove deprecated `govuk-tag--inactive` class

We've removed the `govuk-tag--inactive` class we deprecated in [GOV.UK Frontend v3.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.6.0).

Replace any use of this class with the `govuk-tag--grey` class.

This change was introduced in [pull request #2417: Remove deprecated `govuk-tag--inactive class`](https://github.com/alphagov/govuk-frontend/pull/2417).

### Recommended changes

We've recently made some other changes to GOV.UK Frontend. While these are not breaking changes, implementing them will make your service work better.

You do not need to do anything if you're using Nunjucks macros.

#### Change date input from `type="number"` to `inputmode="numeric"`

There are some known issues with inputs of `type="number"`. [Read our research into the issues with `type="number"`.](https://github.com/alphagov/govuk-frontend/issues/1449#issuecomment-503186819)

If you’re not using Nunjucks macros, remove the `type="number"` attribute from the date input component.

Replace it with `type="text"` and `inputmode="numeric"`. For example:

```
<input class="govuk-input govuk-date-input__input" id="passport-issued-month" name="passport-issued-month" type="text" pattern="[0-9]*" inputmode="numeric">

```

This change was introduced in [pull request #1704: Update date input to use `type=text` and `inputmode=numeric`](https://github.com/alphagov/govuk-frontend/pull/1704).

#### Fix fallback logo so Chrome will not flag it to screen readers

If you’re not using Nunjucks macros, change the SVG markup within the header, footer and button components. We’ve added this fix so screen readers will not announce the fallback image to users.

For the header, footer and button, replace `role="presentation"` with `aria-hidden="true"`. For example:

```
<svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
```

This change was introduced in [pull request #1724: Fix fallback logo so Chrome will not flag it to screen readers](https://github.com/alphagov/govuk-frontend/pull/1724).

#### Add `data-nosnippet` attribute to cookie banner

Apply a `data-nosnippet` attribute to the cookie banner component to stop it appearing in Google Search snippets.

If you’re not using Nunjucks macros, add a new `data-nosnippet` attribute to the cookie banner.

```
<div class="govuk-cookie-banner " data-nosnippet role="region" aria-label="Cookies on your service">
```

This change was introduced in [pull request #2192: Add `data-nosnippet` to prevent cookie banner text appearing in Google Search snippets](https://github.com/alphagov/govuk-frontend/pull/2192).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2255: Prevent conditionally revealed questions getting out of sync when multiple sets of radios and checkboxes contain inputs with the same name](https://github.com/alphagov/govuk-frontend/pull/2255)
- [#2323: Avoid invalid nesting of `<span>` within a `<dd>` in summary list](https://github.com/alphagov/govuk-frontend/pull/2323)
- [#2370: Prevent issues with conditionally revealed content when content `id` includes CSS syntax characters](https://github.com/alphagov/govuk-frontend/pull/2370)
- [#2408: Prevent issues with character count when textarea `id` includes CSS syntax characters](https://github.com/alphagov/govuk-frontend/pull/2408)
- [#2426: Rename exported JavaScript modules to include component name](https://github.com/alphagov/govuk-frontend/pull/2426)
- [#2434: Add brand colour for Department for Levelling Up, Housing and Communities (DLUHC)](https://github.com/alphagov/govuk-frontend/pull/2434) - thanks to [Bruce Bolt](https://github.com/brucebolt) for contributing this change
- [#2447: Remove bottom margin from navigation on tablets](https://github.com/alphagov/govuk-frontend/pull/2447)
- [#2448: Remove the border from the last item in the collapsible navigation menu in the header](https://github.com/alphagov/govuk-frontend/pull/2448)

## 3.14.0 (Feature release)

Note: This release was created from the `support/3.x` branch.

### New features

#### Set text alignment with override classes

You can now use the `govuk-!-text-align-left`, `govuk-!-text-align-centre` and `govuk-!-text-align-right` CSS classes to set text alignment on elements.

This was added in [pull request #2339: Add `text-align` override classes](https://github.com/alphagov/govuk-frontend/pull/2339). Thanks to [Ed Horsford](https://github.com/edwardhorsford) for reporting this issue.

#### Define negative spacing using the `govuk-spacing` function

You can now pass the negative equivalent of a point from the spacing scale to the `govuk-spacing` function to get negative spacing.

For example, `govuk-spacing(1)` returns `5px`, and `govuk-spacing(-1)` returns `-5px`.

This was added in [pull request #2348: Allow `govuk-spacing` to output negative spacing](https://github.com/alphagov/govuk-frontend/pull/2348). Thanks to [Chris Hill-Scott](https://github.com/quis) for reporting this issue.

### Fixes

- [#2347: Prevent panel text overflowing when zoomed in on mobile](https://github.com/alphagov/govuk-frontend/pull/2347) - thanks to [Phil Sherry](https://github.com/philsherry) for reporting this issue.

## 3.13.1 (Fix release)

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2264: Improve focus state for radio and checkbox controls in forced colors mode (for example, Windows High Contrast Mode)](https://github.com/alphagov/govuk-frontend/pull/2264) – thanks to [@adamliptrot-oc](https://github.com/adamliptrot-oc) for reporting this issue
- [#2265: Do not remove focus outline from disabled link buttons in forced colors mode](https://github.com/alphagov/govuk-frontend/pull/2265)
- [#2273: Fix invisible footer on Open Government Licence logo in forced colors mode](https://github.com/alphagov/govuk-frontend/pull/2273) – thanks to [@oscarduignan](https://github.com/oscarduignan) for reporting this issue
- [#2277: Fix invisible start button chevron in forced colors mode](https://github.com/alphagov/govuk-frontend/pull/2277)
- [#2290: Improve support for Internet Explorer 11 with Windows High Contrast Mode](https://github.com/alphagov/govuk-frontend/pull/2290)
- [#2306: Add `max-width` to file upload component](https://github.com/alphagov/govuk-frontend/pull/2306)
- [#2312: Remove `padding-right` from details component](https://github.com/alphagov/govuk-frontend/pull/2312)

## 3.13.0 (Feature release)

### New features

#### Add a 'none' option and 'or' divider to checkboxes

You can now add a 'none' option to checkboxes. For example, 'None of the above' or 'None of these options apply to me'.

Use the 'none' option to [allow users to state that none of the checkboxes apply to them](https://design-system.service.gov.uk/components/checkboxes/#add-an-option-for-none-). Otherwise, users would have to work out that they should leave all the checkboxes unticked.

You can now also add an 'or' divider before the 'none' option. Use the 'or' divider to make the 'none' option more visible to users.

This was added in [pull request #2151: Add 'None of the above' and 'or' divider to checkboxes](https://github.com/alphagov/govuk-frontend/pull/2151). Thanks to [@frankieroberto](https://github.com/frankieroberto) for contributing this improvement.

#### Add a `nonce` attribute to inline scripts

If your service has a Content Security Policy (CSP), you can now add a `nonce` attribute to inline scripts within the Nunjucks page template. To do this, set the `cspNonce` Nunjucks variable. However, you should only add this attribute if you're not able to [include the hash for the inline scripts in your CSP](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#if-your-javascript-is-not-working-properly).

Make sure you [understand the security implications of using this attribute](https://www.w3.org/TR/CSP/#security-considerations), as wrong implementation could affect your service’s security.

[Read more about how to configure your CSP to work with GOV.UK Frontend](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#select-and-initialise-part-of-a-page).

This was added in [pull request #2245: Allow the CSP `nonce` attribute to be set on the inline script in the page template](https://github.com/alphagov/govuk-frontend/pull/2245). Thanks to [@natcarey](https://github.com/natcarey) for contributing this issue and its solution.

### Fixes

We've made the following fixes in [pull request #2229: Change approach to fallback PNG in the header to fix blank data URI from triggering Content Security Policy error](https://github.com/alphagov/govuk-frontend/pull/2229):

- fix blank data URI from triggering CSP error
- fix alignment of fallback PNG in the header

We’ve also made fixes in the following pull requests:

- [#2228: Fix display of checkboxes in Internet Explorer 8](https://github.com/alphagov/govuk-frontend/pull/2228)
- [#2237: Fix GOV.UK logo disappearing on light background in Windows High Contrast Mode](https://github.com/alphagov/govuk-frontend/pull/2237)
- [#2251: Disable ink skipping for underlines in hover state](https://github.com/alphagov/govuk-frontend/pull/2251)

## 3.12.0 (Feature release)

### New features

#### Links are easier to read and have a clearer hover state (opt-in)

Links now have underlines that are consistently thinner and a bit further away from the link text.

Links also have a clearer hover state, where the underline gets thicker to make the link stand out to users.

These changes are an opt-in feature because you may:

- need to make changes to your service to introduce these new link styles consistently
- want to avoid opting in if you have links within a [multiple-column layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Multiple-column_Layout) in your CSS - there is [a Chromium bug that affects such links](https://github.com/alphagov/govuk-frontend/issues/2204)

To enable this feature, set `$govuk-new-link-styles` to `true` before you import GOV.UK Frontend in your Sass:

```
// application.scss
$govuk-new-link-styles: true;
@import "govuk-frontend/all";
```

If you have created your own link styles, you should review them to ensure their use is consistent across your service.

To make it easier to be consistent in your use of link styles, we’ve also introduced new mixins and modifier classes for:

- removing underlines
- displaying white text on dark backgrounds

These new link styles will be enabled by default in a future major version of GOV.UK Frontend.

This was added in [pull request #2183: Updates to link styles and link hover states](https://github.com/alphagov/govuk-frontend/pull/2183).

#### Style links to remove underlines

You can now remove underlines from links by using either the:

- [`govuk-link-style-no-underline` mixin](http://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-link-style-no-underline) in your Sass, or
- [`govuk-link--no-underline` class](https://design-system.service.gov.uk/styles/typography/#links-without-underlines) in your HTML

An underline still appears when the user hovers their cursor over the link.

This was added in [pull request #2214: Add no-underline mixin and modifier class](https://github.com/alphagov/govuk-frontend/pull/2214).

#### Style links on dark backgrounds

You can now style links on dark backgrounds to use white text colour by using either the:

- [`govuk-link-style-inverse` mixin](http://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-link-style-inverse) in your Sass, or
- [`govuk-link--inverse` class](https://design-system.service.gov.uk/styles/typography/#links-on-dark-backgrounds) in your HTML

This was added in [pull request #2213: Add inverse link mixin and modifier class](https://github.com/alphagov/govuk-frontend/pull/2213).

#### Add links styled as buttons to cookie banners

You can now add links styled as buttons to cookie banners. For example, you can set the **Hide** button to be a link styled as a button that reloads the page. Use this feature if you set non-essential cookies on the server and want to help users keep their place using progressive enhancement.

This feature is enabled by default.

This was added in [pull request #2164: Enable cookie banner to set link styled as a button](https://github.com/alphagov/govuk-frontend/pull/2164).

### Fixes

- [#2132: Improve vertical alignment of phase banner tag on mobile devices](https://github.com/alphagov/govuk-frontend/pull/2132) – thanks to [@matthewmascord](https://github.com/matthewmascord) for contributing this issue.
- [#2157: Use pointer cursor for 'Menu' button in header](https://github.com/alphagov/govuk-frontend/pull/2157) – thanks to [@MalcolmVonMoJ](https://github.com/MalcolmVonMoJ) for contributing this issue.
- [#2171: Fix padding on GOV.UK logo affecting hover and focus states](https://github.com/alphagov/govuk-frontend/pull/2171)
- [#2186: Fix display of warning text in Edge when Windows High Contrast Mode is enabled](https://github.com/alphagov/govuk-frontend/pull/2186)
- [#2192: Add data-nosnippet to prevent cookie banner text appearing in Google Search snippets](https://github.com/alphagov/govuk-frontend/pull/2192)
- [#2201: Set -webkit-appearance: button on file upload so text is aligned in Safari](https://github.com/alphagov/govuk-frontend/pull/2201)
- [#2205: Stop file upload component 'jumping' on focus](https://github.com/alphagov/govuk-frontend/pull/2205)
- [#2212: Add underline to crown copyright link in footer](https://github.com/alphagov/govuk-frontend/pull/2212)

## 3.11.0 (Feature release)

### New features

#### Allow users to accept or reject cookies with a cookie banner

You can now [use cookie banners](https://design-system.service.gov.uk/components/cookie-banner/) to allow users to accept or reject cookies which are not essential for making your service work.

This was added in [pull request #2131: Add cookie banner component and button groups](https://github.com/alphagov/govuk-frontend/pull/2131).

#### Group buttons and links

You can now use a button group when you place two or more buttons together.

Any links you include within a button group now line up visually with the buttons.

Read more about [button groups on the Design System’s button page](https://design-system.service.gov.uk/components/button/#grouping-buttons).

This was added in [pull request #2114: Add button groups for use in cookie banner](https://github.com/alphagov/govuk-frontend/pull/2114).

#### Change the style of table captions

You can now make table captions larger or smaller by applying the `govuk-table__caption--xl`, `govuk-table__caption--l`, `govuk-table__caption--m` or `govuk-table__caption--s` classes.

This was added in [pull request #2048: Add modifiers for table captions](https://github.com/alphagov/govuk-frontend/pull/2048).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2045: Stop same-site cookies from being wiped when printing in Internet Explorer 11](https://github.com/alphagov/govuk-frontend/pull/2045) – thanks to [@gunjam](https://github.com/gunjam) for contributing this issue.
- [#2080: Fix JavaScript error when character count ID starts with a number](https://github.com/alphagov/govuk-frontend/pull/2080) - thanks to [@josef-vlach](https://github.com/josef-vlach) for reporting this issue.
- [#2092: Use tabular numbers for character count message](https://github.com/alphagov/govuk-frontend/pull/2092) - thanks to [@quis](https://github.com/quis) for contributing this issue.
- [#2093: Only output space after breadcrumbs class if there’s an additional class](https://github.com/alphagov/govuk-frontend/pull/2093) – thanks to [@frankieroberto](https://github.com/frankieroberto) for contributing this issue.
- [#2133: Remove user-agent default 2px horizontal margins on buttons in Safari](https://github.com/alphagov/govuk-frontend/pull/2133)

## 3.10.2 (Patch release)

### Fixes

We’ve made fixes to the fixtures you can use to [check your HTML matches GOV.UK Frontend](https://frontend.design-system.service.gov.uk/testing-your-html/#test-if-your-html-matches-gov-uk-frontend).

These changes were made in the following pull requests:

- [#2031: Include hidden status of the component examples in published fixtures](https://github.com/alphagov/govuk-frontend/pull/2031) – thanks to [@andymantell](https://github.com/andymantell) for contributing this
- [#2043: Fixes for a couple of component examples / fixtures](https://github.com/alphagov/govuk-frontend/pull/2043) – thanks to [@andymantell](https://github.com/andymantell) for contributing this as well!
- [#2071: Use non-bool type strings for attributes in test fixtures](https://github.com/alphagov/govuk-frontend/pull/2071) – thanks to [@matthew-shaw](https://github.com/matthew-shaw) for contributing this

There are no other changes to GOV.UK Frontend in this release.

## 3.10.1 (Patch release)

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#2035: Fix hairline gap between notification banner header and outer border on high resolution screens in Chrome/Edge (Blink)](https://github.com/alphagov/govuk-frontend/pull/2035)
- [#2036: Explicitly set the text colour for notification banner content, rather than using the user-agent default text colour](https://github.com/alphagov/govuk-frontend/pull/2036)
- [#2042: Wrap notification banner content at 2/3 grid width](https://github.com/alphagov/govuk-frontend/pull/2042)

## 3.10.0 (Feature release)

### New features

#### Update users with notification banners

You can now [use notification banners](https://design-system.service.gov.uk/components/notification-banner/) to tell users about events that occur elsewhere in your service. For example, when they need to complete tasks.

This was added in [pull request #1935: Create notification banner component](https://github.com/alphagov/govuk-frontend/issues/1935).

#### Customise input mode in the date component

You can now change which keyboard type displays for mobile and tablet users. This enables users to enter characters other than numbers when they use the date input. To change the keyboard type, set the `inputmode` when you use the Nunjucks macro options.

This was added in [pull request #1975: Enable custom inputmode for date input component](https://github.com/alphagov/govuk-frontend/pull/1975). Thanks to [@foaly-nr1](https://github.com/foaly-nr1) for contributing this issue.

## 3.9.1 (Fix release)

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#1967: Fix navigation links in the header not being announced by screen readers](https://github.com/alphagov/govuk-frontend/pull/1967)

## 3.9.0 (Feature release)

### New features

#### Add a prefix or suffix to a text input component

You can now [use prefixes and suffixes in the text input component](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes) to help users enter things like currencies and measurements.

This was added in [pull request #1816: Add input prefix and suffix](https://github.com/alphagov/govuk-frontend/pull/1816). Thanks to [@simonwhatley](https://github.com/simonwhatley) and the GOV.UK Coronavirus Services Team.

#### Test if your HTML matches GOV.UK Frontend

You can now use our test fixtures to [check you're outputting the same HTML that GOV.UK Frontend uses](http://frontend.design-system.service.gov.uk/testing-your-html/).

This was added in [pull request #1925: Generate fixtures.json files for components on build:package](https://github.com/alphagov/govuk-frontend/pull/1925). Thanks to everyone who fed back on [our test fixtures proposal](https://github.com/alphagov/govuk-frontend/issues/1830#issuecomment-665075842).

#### Customise navigation in the header component

If you use the [header component with navigation](https://design-system.service.gov.uk/components/header/#header-with-service-name-and-navigation), you can now:

- customise the section's `aria-label` text
- add navigation items without links

##### Customise aria-label text

You can use the new:

- `navigationLabel` option to set the `aria-label` text for the navigation section
- `menuButtonLabel` option to set the `aria-label` text for the button that hides or shows the navigation section on mobile

For example:

```javascript
{{ govukHeader({
    navigationLabel: "Custom navigation section aria-label",
    menuButtonLabel: "Custom menu button aria-label"
}) }}
```

The default labels are now:

- **Navigation menu** for `navigationLabel`
- **Show or hide navigation menu** for `menuButtonLabel`

This was added in pull requests:

- [#1905: Set navigation and mobile menu labels of the header component with new options](https://github.com/alphagov/govuk-frontend/pull/1905)
- [#1943: Change header menu button label](https://github.com/alphagov/govuk-frontend/pull/1943) - thanks to [@domoscargin](https://github.com/domoscargin) for raising this issue

##### Add navigation items without links

To add a navigation item without a link, use the `text` or `html` option to add the item but do not use the `href` option.

For example:

```javascript
{{ govukHeader({
    navigation: [
    {
      html: "<form method='post' action='url.com'>
              <input type='submit' class='app-logout-button-style' value='Log out' />
            </form>"
    }
  ]
}) }}
```

This was added in [pull request #1921: Make it possible to exclude link from header navigation item](https://github.com/alphagov/govuk-frontend/pull/1921).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#1918: Add new brand colour for FCDO](https://github.com/alphagov/govuk-frontend/pull/1918) - thanks to [@deborahchua](https://github.com/deborahchua) and [@beccapearce](https://github.com/beccapearce) for contributing this
- [#1942: Set aria-expanded and aria-hidden attributes on header menu button and menu when page loads](https://github.com/alphagov/govuk-frontend/pull/1942)
- [#1947 Add print styles for the panel component](https://github.com/alphagov/govuk-frontend/pull/1947)

## 3.8.1 (Fix release)

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#1912: Fix character count shrinking as you go over limit](https://github.com/alphagov/govuk-frontend/pull/1912)

## 3.8.0 (Feature release)

### New features

#### The secondary text colour is now darker

`$govuk-secondary-text-colour` and `govuk-colour("dark-grey")` are now darker so users can more clearly read hint text that uses the colour.

The colour now has a contrast ratio of 7:1 against a white background, and helps hint text meet the WCAG 2.1 (AAA) accessibility standard.

This was added in [pull request #1827: Make dark grey darker](https://github.com/alphagov/govuk-frontend/pull/1827).

#### Error styling for field border thickness is now the same with and without an error

The error styling for the:

- text input, select and textarea components no longer makes the border thicker
- file upload component no longer includes a border around the file upload input

This means it’s easier for users to tell the difference between a field with an error and a field that's focused.

When an error message is about several fields, make sure you're clear which field has the error. You must not rely on users being able to tell which field has the error styling.

This was added in [pull request #1870: Reduce border width of form inputs in the error state](https://github.com/alphagov/govuk-frontend/pull/1870).

#### Set spellcheck with a new option

You can now turn spellcheck on or off in the input, textarea and character count components using the new `spellcheck` option instead of the `attributes` option.

For example:

```javascript
{{ govukInput({
    spellcheck: true
}) }}
```

This was added in pull requests:

- [#1859: Add spellcheck option](https://github.com/alphagov/govuk-frontend/pull/1859)
- [#1869: Add missing spellcheck param to character count](https://github.com/alphagov/govuk-frontend/pull/1869)

### Deprecated features

#### $govuk-border-width-form-element-error

From GOV.UK Frontend v4.0.0, you'll no longer be able to reference the [`$govuk-border-width-form-element-error`](https://frontend.design-system.service.gov.uk/sass-api-reference/#govuk-border-width-form-element-error) Sass setting.

Change any references to `$govuk-border-width-form-element-error` in your Sass code so they reference `$govuk-border-width-form-element` instead.

This was changed in [pull request #1870: Reduce border width of form inputs in the error state](https://github.com/alphagov/govuk-frontend/pull/1870).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#1838: Correctly camel case SVG attributes in the header and footer](https://github.com/alphagov/govuk-frontend/pull/1838)
- [#1842: Preserve the state of conditional reveals when navigating 'back' in the browser](https://github.com/alphagov/govuk-frontend/pull/1842)
- [#1848: Preserve the state of the character count when navigating 'back' in the browser](https://github.com/alphagov/govuk-frontend/pull/1848)
- [#1855: Hint component can render block-level elements as valid HTML](https://github.com/alphagov/govuk-frontend/pull/1855)
- [#1861: Fix the display of checkboxes when border-box box sizing is applied globally](https://github.com/alphagov/govuk-frontend/pull/1861)
- [#1862: Fix display of warning text icon when border-box box sizing is applied globally #1862](https://github.com/alphagov/govuk-frontend/pull/1862)
- [#1879: Explicitly set outline-offset to remove 1px transparent border in chrome v84](https://github.com/alphagov/govuk-frontend/pull/1879)

## 3.7.0 (Feature release)

### New features

#### Add extra spacing between list items

If a [list](https://design-system.service.gov.uk/styles/typography/#lists) is hard to read because the items run across multiple lines, you can now [add extra spacing between list items](http://design-system.service.gov.uk/styles/typography/#adding-extra-spacing-between-list-items) using the new `govuk-list--spaced` class.

This was added in [pull request #1775: Add list--spaced modifier](https://github.com/alphagov/govuk-frontend/pull/1775). Thanks to [@frankieroberto](https://github.com/frankieroberto) for raising this issue.

#### Use HTML for navigation items in the header

You can now use HTML for a navigation item in the [header](https://design-system.service.gov.uk/components/header/) component, using the new `html` option.

This was added in [pull request #1819: Add the ability to specify HTML for a navigation item](https://github.com/alphagov/govuk-frontend/pull/1819). Thanks to [@adamsilver](https://github.com/adamsilver).

#### Import settings, tools and helpers CSS in one line

You can now import `node_modules/govuk-frontend/govuk/base`, instead of importing `settings`, `helpers` and `tools` separately.

#### Sass now compiles faster

GOV.UK Frontend's Sass files now compile to CSS faster, because we've changed the way dependencies work when you import them.

If you already import `node_modules/govuk-frontend/govuk/all` in your Sass file, you do not need to do anything. Sass will automatically compile faster.

If you import specific parts of GOV.UK Frontend in your Sass file instead, you can now make Sass compile faster by importing `base` then a component's `index` file. This will avoid GOV.UK Frontend importing dependencies multiple times.

For example:

```scss
@import "node_modules/govuk-frontend/govuk/base";

@import "node_modules/govuk-frontend/govuk/core/all";
@import "node_modules/govuk-frontend/govuk/objects/all";

@import "node_modules/govuk-frontend/govuk/components/button/index";
@import "node_modules/govuk-frontend/govuk/components/footer/index";
@import "node_modules/govuk-frontend/govuk/components/header/index";
```

Find out more about [importing CSS](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#css).

This was added in [pull request #1804: Allow components to be imported without dependencies](https://github.com/alphagov/govuk-frontend/pull/1804). Thanks to [@kevindew](https://github.com/kevindew) for raising this issue.

#### Collapse breadcrumb component on mobile

You can now [collapse the breadcrumb component on mobile](https://design-system.service.gov.uk/components/breadcrumbs/#collapsing-breadcrumbs-on-mobile-devices) using the new `collapseOnMobile` option, so it:

- shows only the first and last items
- does not wrap

This was added in [pull request #1754: Add collapseOnMobile breadcrumbs flag](https://github.com/alphagov/govuk-frontend/pull/1754). Thanks to [@vanitabarrett](https://github.com/vanitabarrett) and [@miaallers](https://github.com/miaallers).

#### Back links are easier to select

The [back link](https://design-system.service.gov.uk/components/back-link/) component is now:

- bigger, so it's easier to select if you're using a touch screen
- more consistent with the design of the breadcrumb component

This was added in [pull request #1753: Make back link arrow consistent with breadcrumb component](https://github.com/alphagov/govuk-frontend/pull/1753). Thanks to [@vanitabarrett](https://github.com/vanitabarrett) and [@miaallers](https://github.com/miaallers).

### Deprecated features

#### Importing from the `core` and `overrides` layers without `base`

If you import specific files from the `core` or `overrides` layers, you’ll now see a deprecation warning when compiling Sass if you do not import `node_modules/govuk-frontend/govuk/base` first.

To fix the warning, import `node_modules/govuk-frontend/govuk/base` first. For example:

```scss
@import "node_modules/govuk-frontend/govuk/base";
@import "node_modules/govuk-frontend/core/typography";
```

If you do not import `node_modules/govuk-frontend/govuk/base` first, your service will no longer work from GOV.UK Frontend v4.0.0.

This was added in [pull request #1807: Warn if importing core, overrides without dependencies](https://github.com/alphagov/govuk-frontend/pull/1807).

### Fixes

We’ve made fixes to GOV.UK Frontend in the following pull requests:

- [#1778: Fix accordion underline hover state being removed when hovering plus/minus symbol](https://github.com/alphagov/govuk-frontend/pull/1778)
- [#1765: Import textarea from character count](https://github.com/alphagov/govuk-frontend/pull/1765)
- [#1796: Standardise accordion section headings font size (reduce height of section headings on mobile)](https://github.com/alphagov/govuk-frontend/pull/1796)

## 3.6.0 (Feature release)

### New features

#### Use colours with the tag component

You can now [use colour with tags](https://design-system.service.gov.uk/components/tag/#using-colour-with-tags) to help distinguish between different tags - or to help draw the user’s attention to a tag if it’s especially important.

This also means you should replace the `.govuk-tag--inactive` class with the `.govuk-tag--grey` class. `.govuk-tag--inactive` is now deprecated, and it will be removed in a future release.

[Pull request #1711: Additional Tag modifier classes for different colours](https://github.com/alphagov/govuk-frontend/pull/1711).

#### Hide elements when users print a page

You can now hide elements when users print a page, using the new `govuk-!-display-none-print` class.

[Pull request #1723: Add display override for hiding content when printing](https://github.com/alphagov/govuk-frontend/pull/1723).

#### The `iff` Sass function is now deprecated

You should no longer use the `iff` Sass function. The function is now deprecated, and it will be removed in a future release.

[Pull request #1742: Deprecate iff function](https://github.com/alphagov/govuk-frontend/pull/1742).

### Fixes

- [Pull request #1724: Fix fallback logo being detected by Google Chrome's image description feature](https://github.com/alphagov/govuk-frontend/pull/1724).
- [Pull request #1745: Update vendor polyfills to match upstream](https://github.com/alphagov/govuk-frontend/pull/1745).
- [Pull request #1746: Use generic div element for tabspanel](https://github.com/alphagov/govuk-frontend/pull/1746).

## 3.5.0 (Feature release)

### New features

#### Add classes to the character count component's count message

If you're using Nunjucks, you can now add classes to the character count component's count message using the `countMessage.classes` option.

- [Pull request #1650: Make Character Count use hint component for message and allow custom classes to be added](https://github.com/alphagov/govuk-frontend/pull/1650).

### Fixes

- [Pull request #1704: Update the date input component to use `input type=text inputmode=numeric`](https://github.com/alphagov/govuk-frontend/pull/1704).
- [Pull request #1690: Don't unneccesarily self-close tags](https://github.com/alphagov/govuk-frontend/pull/1690).
- [Pull request #1678: Fix tabs component throwing JavaScript errors in Internet Explorer 8](https://github.com/alphagov/govuk-frontend/pull/1678).
- [Pull request #1676: Fix skip link component focus style with global styles enabled](https://github.com/alphagov/govuk-frontend/pull/1676).
- [Pull request #1672: Ensure footer links look clickable](https://github.com/alphagov/govuk-frontend/pull/1672).
- [Pull request #1670: Make width-container margins more targetted to avoid specificity issues](https://github.com/alphagov/govuk-frontend/pull/1670).
- [Pull request #1655: Ensure components use public `govuk-media-query` mixin](https://github.com/alphagov/govuk-frontend/pull/1655).
- [Pull request #1648: Update checkboxes and radio buttons to include item hint classes on item hint](https://github.com/alphagov/govuk-frontend/pull/1648).
- [Pull request #1638: Check component item arrays are not empty before outputting markup](https://github.com/alphagov/govuk-frontend/pull/1638).

## 3.4.0 (Feature release)

### New features

#### Add classes to the page wrapper

If you're using Nunjucks, you can now add classes to the page wrapper using the [`containerClasses` variable](https://design-system.service.gov.uk/styles/page-template/#variables).

[Pull request #1626: Allow creating custom width containers and using them with template](https://github.com/alphagov/govuk-frontend/pull/1626).

#### Set a custom width for wrappers

If you're using Sass, you can now use the `govuk-width-container` mixin to create a custom wrapper class with a specific width. You can then add that class to the following wrappers to override the width of the `govuk-width-container` class:

- [page wrapper](https://design-system.service.gov.uk/styles/layout/#page-wrappers)
- [header container](https://design-system.service.gov.uk/components/header/)
- [footer container](https://design-system.service.gov.uk/components/footer/)

To create your custom wrapper class, include the `govuk-width-container` mixin. Pass in the width in pixels.

For example:

```scss
.app-width-container--wide {
  @include govuk-width-container(1200px);
}
```

If you’re using Nunjucks, you should then add your class using either the:

- `containerClasses` variable in the [page template](https://design-system.service.gov.uk/styles/page-template/#variables)
- `containerClasses` option in the [header](https://design-system.service.gov.uk/components/header/) or [footer](https://design-system.service.gov.uk/components/footer/)

Use the `$govuk-page-width` Sass variable instead if all your pages are the same width.

- [Pull request #1626: Allow creating custom width containers and using them with template](https://github.com/alphagov/govuk-frontend/pull/1626).

#### Add attributes to the `<body>` element of a page

You can now add attributes to the `<body>` element of a page, by using the [`bodyAttributes` variable](https://design-system.service.gov.uk/styles/page-template/#variables) in the page template.

- [Pull request #1623: Allow attributes to be set on template <body>](https://github.com/alphagov/govuk-frontend/pull/1623).

### Fixes

- [Pull request #1594: Refactor handling of count message in character count JavaScript](https://github.com/alphagov/govuk-frontend/pull/1594).
- [Pull request #1609: Update hex value for secondary text to improve contrast](https://github.com/alphagov/govuk-frontend/pull/1609).
- [Pull request #1620: Only add underline to back link when href exists](https://github.com/alphagov/govuk-frontend/pull/1620).
- [Pull request #1631: Fix classes on character count when in error state](https://github.com/alphagov/govuk-frontend/pull/1631).

## 3.3.0 (Feature release)

### New features

#### Allow `lang` to be set on `<title>` and `<main>` of template

You can now set the [lang attribute](https://www.w3.org/International/questions/qa-html-language-declarations) in the title and main of page template.

This will help with scenarios where some of the elements, such as navigation and footer, are in English whereas the title and page content are in a different language.

- [Pull request #1576: Allow `lang` to be set on title and main of template](https://github.com/alphagov/govuk-frontend/pull/1576).

#### Add new override class to hide elements

You can now use the `.govuk-!-display-none` override class to hide elements.

- [Pull request #1586: Add display none override class](https://github.com/alphagov/govuk-frontend/pull/1586).

#### Visual updates to the warning text component

Align ‘Warning text’ icon with first line of the content fixing [#1352](https://github.com/alphagov/govuk-frontend/issues/1352) Some changes were made to the size and spacing of the icon to help with positioning.

- [Pull request #1578: Change position and spacing relationship of warning text icon](https://github.com/alphagov/govuk-frontend/pull/1578)

### Fixes

- [Pull request #1574: Make form elements scale correctly when text resized by user](https://github.com/alphagov/govuk-frontend/pull/1574).
- [Pull request #1584: Fix text resize issue with warning text icon](https://github.com/alphagov/govuk-frontend/pull/1584)
- [Pull request #1570: Prevent inputs ending up off screen or obscured by keyboards when linking from the error summary to inputs within a large fieldset](https://github.com/alphagov/govuk-frontend/pull/1570)
- [Pull request #1585: Explicitly set font weight on warning-text component](https://github.com/alphagov/govuk-frontend/pull/1585)
- [Pull request #1587: Fix height and alignment issue within header in Chrome 76+](https://github.com/alphagov/govuk-frontend/pull/1587)
- [Pull request #1589: Remove role="button" from header button](https://github.com/alphagov/govuk-frontend/pull/1589)
- [Pull request #1595: Do not output conditionally revealed content for radios or checkboxes when it's empty](https://github.com/alphagov/govuk-frontend/pull/1595)

## 3.2.0 (Feature release)

### New features

#### Add classes to the form group wrapper of the character count component

You can now add classes to the form group wrapper of the character count component.

```javascript
govukCharacterCount({
  formGroup: {
    classes: 'app-character-count--custom-modifier'
  }
})
```

- [Pull request #1553: Include formGroup on character count and pass through to textarea to allow class to be added to character count form group](https://github.com/alphagov/govuk-frontend/pull/1553). Thanks to [Emma Lewis](https://github.com/LBHELewis).

### Fixes

- [Pull request #1548: Fix fieldset legend text clipping when using a custom or fallback font](https://github.com/alphagov/govuk-frontend/pull/1548).
- [Pull request #1559: Stop IE8 from downloading GDS Transport font](https://github.com/alphagov/govuk-frontend/pull/1559).
- [Pull request #1564: Ensure legacy styles do not override button active state](https://github.com/alphagov/govuk-frontend/pull/1564).

## 3.1.0 (Feature release)

### New features

#### Add attributes to the fieldset on the date input component

You can now pass attributes to add to the fieldset on the date input component.

[Pull request #1541: Allow date input fieldset attributes to be set](https://github.com/alphagov/govuk-frontend/pull/1541). Thanks to [andrew-mcgregor](https://github.com/andrew-mcgregor) for raising this.

#### Add ARIA role to the fieldset component

You can now pass an ARIA role to the fieldset component.

[Pull request #1541: Allow date input fieldset attributes to be set](https://github.com/alphagov/govuk-frontend/pull/1541).

#### Add inputmode to the input component

You can now pass [inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) to the input component.

```javascript
govukInput({
  inputmode: 'email'
})
```

- [Pull request #1527: Add inputmode option to the input component](https://github.com/alphagov/govuk-frontend/pull/1527)

### Fixes

- [Pull request #1523: Improve accessibility of details component by polyfilling only where the native element is not available](https://github.com/alphagov/govuk-frontend/pull/1523).
- [Pull request #1512: Update components to only output items when they are defined](https://github.com/alphagov/govuk-frontend/pull/1512).
- [Pull request #1538: Simplify button types to avoid unnecessary type attribute](https://github.com/alphagov/govuk-frontend/pull/1538).
- [Pull request #1542: Only default two thirds/one-third layout when footer has two sections](https://github.com/alphagov/govuk-frontend/pull/1542).

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

##### If you’re using Javascript

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

| Colour variable removed | Suggested replacement |
| ----------------------- | --------------------- |
| bright-red              | red                   |
| grey-1                  | dark-grey             |
| grey-2                  | mid-grey              |
| grey-3                  | light-grey            |
| grey-4                  | light-grey            |

You should check the [contrast ratio of your colours](https://design-system.service.gov.uk/styles/colour#colour-contrast).

If you're not using Sass, change the values of the following colours:

| Colour name | Old value | Replace with |
| ----------- | --------- | ------------ |
| purple      | #2e358b   | #4c2c92      |
| red         | #b10e1e   | #d4351c      |
| yellow      | #ffbf47   | #ffdd00      |
| green       | #006435   | #00703c      |
| grey-2      | #bfc1c3   | #b1b4b6      |
| grey-3      | #dee0e2   | #f3f2f1      |
| grey-4      | #f8f8f8   | #f3f2f1      |
| light-blue  | #2b8cc4   | #5694ca      |
| blue        | #005ea5   | #1d70b8      |
| bright-red  | #df3034   | #d4351c      |

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
  <https://github.com/alphagov/govuk-frontend/issues/1204>

  ([PR #1230](https://github.com/alphagov/govuk-frontend/pull/1230))

- Accommodate camera notches on new devices (iPhone X, Google Pixel 3 etc)

  On newer devices with "camera notches", browsers reserve a safe area in
  landscape orientation (known as pillarboxing) so content isn't obscured.

  To avoid this, support has been added for `viewport-fit=cover` as shown here:
  <https://webkit.org/blog/7929/designing-websites-for-iphone-x/>

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

## 2.4.1 (Fix release)

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
  as `govuk-input--width-2` or `govuk-input--width-4` to the input fields.

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

  You can now override elements that have an undefined or smaller percentage width to be 100% width of their container.

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

## 1.3.0 (Feature release)

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

## 1.2.0 (Feature release)

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

## 1.1.1 (Fix release)

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

## 1.1.0 (Feature release)

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
  <https://github.com/alphagov/govuk-frontend/issues/868>

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

  ```css
  $govuk-spacing-scale-*
  ```

  use

  ```css
  govuk-spacing(*)
  ```

  where `*` is the number on the spacing scale. The scale itself has remained the same so that `$govuk-spacing-scale-3` corresponds to `govuk-spacing(3)`. This change allows us to control the error messaging when incorrect values are used and to deprecate variables. The values of spacing variables can also be overridden by consumers.
  - Instead of:

  ```css
  @include govuk-responsive-margin($govuk-spacing-responsive-2, "bottom");
  @include govuk-responsive-padding($govuk-spacing-responsive-2, "bottom");
  ```

  use

  ```css
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
  also been raised upstream – <https://github.com/sass-mq/sass-mq/pull/111>).
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

  The [new project structure](<(./src/README.md)>) matches our ITCSS inspired layers and is published as a single package as `@govuk-frontend/frontend`.

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

- Link styles, as well as links within the back-link, breadcrumbs, button,
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
- Update `govuk-section-break__visible` new class name `govuk-section-break--visible` in the review app's Typography page.
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
