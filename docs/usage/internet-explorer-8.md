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
