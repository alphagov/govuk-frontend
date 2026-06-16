# Language switcher

The language switcher component lets users switch to a translation of the current page in another language.

It renders a navigation landmark containing a list of language links. The language of the current page is shown as plain text. Each link includes `lang` and `hreflang` attributes so screen readers pronounce each language name correctly, and `rel="alternate"` to identify the link as an alternate version of the current page.

If the switcher includes languages with different text directions, set `dir` on every language item so the language name is read and rendered in the correct direction.

## Installation

See the [main README quick start guide](https://github.com/alphagov/govuk-frontend#quick-start) for how to install this component.

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See the [language switcher options table](language-switcher.yaml) for details.
