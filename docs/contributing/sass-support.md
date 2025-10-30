# Why we use Sass in GOV.UK Frontend

Sass lets us use patterns and functions to create consistent styles for GOV.UK Frontend. Services using GOV.UK Frontend can extend our Sass, letting them customise the output and create their own components that match the rest of Frontend.

Using a CSS abstraction instead of writing CSS directly means we need to choose which older Sass compilers and versions to support. The compilers we support decide which Sass features we can use in the future and which services can use Frontend.

Before GOV.UK Frontend version 6.0.0, we supported three Sass compilers: Ruby Sass (from version 3.4.0), LibSass (from 3.5.5), and all versions of Dart Sass.

The developers of Sass discontinued Ruby Sass in 2019. LibSass was subsequently deprecated in 2020. We ended support for both of these compilers in Frontend 6.0.0 and increased the minimum supported version of Dart Sass to 1.79.0.

## How we determine the minimum Dart Sass version we support

We'll update the minimum supported version of Dart Sass with each major release of GOV.UK Frontend, starting from version 6.0.0. We plan to do this by following the steps below.

1. Select a version of Dart Sass that was released at least 12 months before the planned release date of the major GOV.UK Frontend version.
2. Request feedback from the community to find any issues preventing the use of that version of Dart Sass.
3. If no major problems are identified, update GOV.UK Frontend's documentation and automated tests to use the selected version of Dart Sass.

The version of Dart Sass chosen is at the team's discretion, but will take into account factors such as major feature additions, deprecations, or bug fixes included in the version.
