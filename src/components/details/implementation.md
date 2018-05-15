## Implementation notes

### Marker styling

Firefox uses display: list-item to show the arrow marker for the summary
element.

Unfortunately we want to use `display: inline-block` to 'shrink-wrap' the focus
outline around the summary text, which means that the arrow no longer shows up.

Previously in GOV.UK Elements we resolved this by targeting Firefox specifically
and reverting to `display: list-item`:

```
@-moz-document regexp('.*') {
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
