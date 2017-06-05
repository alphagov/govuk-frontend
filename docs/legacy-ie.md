# Supporting legacy IE

Unless stated otherwise the approach to browser support still follows the GDS principles for [designing for different browsers and devices](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices).

We want to continue providing a functional experience for user of legacy browsers, but in a way that reduces complexity in this codebase.

## Separate stylesheet
As a part of our build process we generate a separate stylesheet for legacy IE browsers.

## Fixing non-supported properties
In the separate stylesheet we are:
- Rasterizing media queries to serve only desktop styles using [Sass MQ](http://sass-mq.github.io/sass-mq/)
- Proving fallback `px`fallback for `rem` with scss function
- Replacing or removing unsupported properties, such as: `hex` for `rgba`, `nth-child` for `last-child`
- Adding vendor prefixes with AutoPrefix for PostCSS.

We use [Oldie](https://github.com/jonathantneal/oldie) in combination with PostCSS.
