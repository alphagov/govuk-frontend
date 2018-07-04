# Supporting Internet Explorer 8

If you are including GOV.UK Frontend as part of your application's stylesheets
then you will need to do some additional work to support Internet Explorer 8
(IE8).

1. [Include an HTML5 shiv](#include-an-html5-shiv)
2. [Generate an IE8-specific stylesheet](#bundling-an-ie8-specific-stylesheet)
3. [Transform the IE8 stylesheet using oldie](#transforming-the-generated-stylesheet-using-oldie)
4. [Include the IE8 stylesheet in your project](#including-the-ie8-stylesheet-in-your-project)

Once you have completed these steps, you will be able to [write CSS that targets
IE8 in your own application styles](#writing-styles-that-target-ie8).

If you are using the distributed versions of GOV.UK Frontend that already
include an IE8-specific stylesheet then you can include that in your project,
allowing you to skip steps 2 and 3.

## Include an HTML5 shiv

You will need to to include an [HTML5 shiv](https://github.com/aFarkas/html5shiv)
which allows the 'semantic' HTML elements introduced in HTML5 to be used in
older browsers which do not natively support them.

These elements include `article`, `aside`, `figcaption`, `figure`, `footer`,
`header`, `main`, `mark`, `nav`, `section`, and `time`.

To improve performance for users of modern browsers, you can wrap the shiv
include with conditional comments that target only the browsers that need it:

```html
<!--[if lt IE 9]>
  <script src="/path/tohtml5shiv.js"></script>
<![endif]-->
```

Note that some libraries such as Modernizr may already include html5shiv.

## Bundling an IE8-specific stylesheet

Setting the `$govuk-is-ie8` variable to `true` when generating the stylesheet
will create a version that targets IE8. For example, it will:

- flatten media queries to create a 'desktop only' version
- include any conditional styles that target IE8
- exclude any conditional styles that target browsers other than IE8

You must set the variable before importing GOV.UK Frontend.

In most scenarios you should be able to create a separate stylesheet for IE8,
set the `$govuk-is-ie8` variable to true and then import your main application
stylesheet without having to redefine anything else.

```scss

// application.scss

@import "govuk-frontend/frontend/all";

.example {
  // example application style
}

// application-ie8.scss

$govuk-is-ie8: true;

@import "application";
```

## Transforming the generated stylesheet using 'oldie'

You should use the [oldie](https://github.com/jonathantneal/oldie) plugin for
[postcss](https://github.com/postcss/postcss) to further transform the
stylesheet:

- replacing opacity properties with compatible filter properties
- swapping :: selectors with compatible : selectors for pseudo-elements
- swapping rgba colours with compatible hex colours and filter properties

The oldie plugin is also able to flatten media queries, but this will already
have been done as part of the stylesheet compilation in step 1.

Doing this as a separate step allows us to keep the source of GOV.UK Frontend
simple, without having to wrap syntax that would need to be transformed in
mixins or functions.

## Including the IE8 stylesheet in your project

Now that you have an IE8 compatible stylesheet you should include it using
[conditional comments](https://www.quirksmode.org/css/condcom.html):

```html
<!--[if !IE 8]><!-->
  <link rel="stylesheet" href="assets/application.css">
<!--<![endif]-->
<!--[if IE 8]>
  <link rel="stylesheet" href="assets/application-ie8.css">
<![endif]-->
```

## Writing IE8 specific styles
See [Writing styles that target IE8](../usage/internet-explorer-8.md)
