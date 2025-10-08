## Implementation notes

### Styling in older browsers

#### Browsers with support for `type=module`, `<details>` and feature queries

https://browsersl.ist/#q=supports+details+and+supports+css-featurequeries+and+supports+es6-module&region=GB

Previously, we provided a polyfill for older browsers which do not support the
`<details>` component. Since most browsers now DO support `<details>`, we've
removed that polyfill, and we need to make sure browsers which don't support
`<details>` don't use any styles that make them look interactable.

By wrapping these styles in a feature query, we can capture the vast majority of
browsers which have full support.

#### Browsers that support `type=module` and feature queries but not `<details>`

https://browsersl.ist/#q=supports+es6-module+and+not+supports+details+and+supports+css-featurequeries&region=GB

This only affects Edge 16 - 18. We filter these out of the support query by
checking for `-ms-ime-align: auto`, which isn't supported by any other browsers.

#### Browsers that support `<details>` but not `type=module` or feature queries

https://browsersl.ist/#q=supports+details+and+not+supports+css-featurequeries+and+not+supports+es6-module&region=GB

These will default to their native styling of the `<details>` element, with a
few of our spacing and font styles.

#### Browsers which don't support `<details>`, `type=module` or feature queries

https://browsersl.ist/#q=%3E0.0000001%25+and+not+supports+details+and+not+supports+es6-module+and+not+supports+css-featurequeries&region=GB

This is largely IE 8 - 11.

We can account for IE by styling them like inset text, via a `@media screen\0`
hack that no other browser supports.

#### Browsers that support feature queries, but not `<details>` or `type=module`

https://browsersl.ist/#q=supports+css-featurequeries+and+not+supports+details+and+not+supports+es6-module&region=GB

This is the only gap, as these browsers will get styled to look interactable,
even though they aren't. This is largely Opera Mini.

### Marker styling

Firefox uses display: list-item to show the arrow marker for the summary
element.

Unfortunately we want to use `display: inline-block` to 'shrink-wrap' the focus
outline around the summary text, which means that the arrow no longer shows up.

Previously in GOV.UK Elements we resolved this by targeting Firefox specifically
and reverting to `display: list-item`:

```scss
@-moz-document regexp(".*") {
  details summary:not([tabindex]) {
    // Allow duplicate properties, override the summary display property
    // scss-lint:disable DuplicateProperty
    display: list-item;
    display: revert;
  }
}
```

However, `@-moz-document` has been removed in Firefox nightly as of 29th Nov
2017 so with this in mind we have taken a different approach, hiding the
browser's marker and injecting and styling our own one across all browsers
instead.

This also gives us more control over the styling of the marker, allowing us for
example to align the summary and disclosed text correctly across all browsers.

The downside of this approach is that older browsers that require a polyfill for
the details element will display the marker even when Javascript is disabled.
Whilst this is not perfect, it is a cosmetic issue and the user will still be
able to access the disclosed content.

For the arrows themselves, we originally tried using unicode glyphs –
specifically \25B6 (Black right-pointing triangle) and 25BC (Black down-pointing
triangle) but Android insists on substituting the the former for an emoji even
when the \00FE0E modifier is applied. Sad face.

Hence the border-based triangles we are using today.
