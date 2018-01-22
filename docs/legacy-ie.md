# Supporting legacy IE

Unless stated otherwise the approach to browser support still follows the GDS principles for [designing for different browsers and devices](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices).

We want to continue providing a functional experience for user of legacy browsers, but in a way that reduces complexity in this codebase.

## Generate your own legacy IE stylesheet
If you're compiling your own stylesheets from GOV.UK Frontend component partials, you can generate a separate stylesheet for legacy browsers using a build tool (like [Gulp](https://gulpjs.com/))

In our partials we use IE mixins that generate code for versions of IE:

```
@include ie-lte(8) {
  border-bottom: $button-shadow-size solid $govuk-button-colour-darken-15;
}
```

Because all our styles as written mobile first and IE8 doesn't support media queries, you need to set `$mq-responsive: false;` in your legacy IE stylesheet. You can read more about this [SassMQ functionality](https://sass-mq.github.io/sass-mq/#undefined-variable-mq-responsive).

Example of a legacy IE Sass file
```
// To enable support for browsers that do not support @media queries,
// (IE <= 8, Firefox <= 3, Opera <= 9) set $mq-responsive to false
// Create a separate stylesheet served exclusively to these browsers,
// meaning @media queries will be rasterized, relying on the cascade itself
$mq-responsive: false;

// Set is-ie to true to output IE specific styles
// uses the IE helpers in our globals/_helpers.scss file
$is-ie: true;
$ie-version: 8;

@import "main-application-sass-file";
```

## Provided separate legacy IE stylesheet
As a part of our build process we generate a separate stylesheet for legacy IE browsers.

## Fixing non-supported properties
In the separate stylesheet we are:
- Rasterizing media queries to serve only desktop styles using [Sass MQ](http://sass-mq.github.io/sass-mq/)
- Proving fallback `px`fallback for `rem` with scss function
- Replacing or removing unsupported properties, such as: `hex` for `rgba`, `nth-child` for `last-child`
- Adding vendor prefixes with AutoPrefix for PostCSS.

We use [Oldie](https://github.com/jonathantneal/oldie) in combination with PostCSS.
