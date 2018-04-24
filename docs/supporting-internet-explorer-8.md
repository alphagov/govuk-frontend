# Supporting Internet Explorer 8

If you are including GOV.UK Frontend as part of your application's stylesheets
then you will need to do some additional work to support Internet Explorer 8
(IE8).

1. [Generate an IE8-specific stylesheet](#bundling-an-ie8-specific-stylesheet)
2. [Transform the IE8 stylesheet using oldie](#transforming-the-generated-stylesheet-using-oldie)
3. [Include the IE8 stylesheet in your project](#including-the-ie8-stylesheet-in-your-project)

Once you have completed these steps, you will be able to [write CSS that targets
IE8 in your own application styles](#writing-styles-that-target-ie8).

If you are using the distributed versions of GOV.UK Frontend that already
include an IE8-specific stylesheet then you can include that in your project.

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

@import "govuk-frontend/all/all";

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

## Writing styles that target IE8

Wrapping rules with the `govuk-if-ie8` mixin will ensure that they are only
outputted when generating the IE8-specific stylesheet.

```scss
.foo {
  min-width: 100px;

  // Specify width for IE8 only
  @include govuk-is-ie8 {
    width: 100px;
  }
}
```

The `govuk-not-ie8` mixin can be used to wrap rules that you want to exclude
when generating the IE8-specific stylesheet.

```scss
.foo {
  font-weight: bold;

  // Enhance foo only for modern browsers (not IE8)
  @include govuk-not-ie8 {
    font-family: "Comic Sans MS", "Curlz MT" cursive, sans-serif;
    color: #FF69B4;
  }
}
```
