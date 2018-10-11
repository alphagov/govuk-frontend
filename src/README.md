# The `src` directory

## Structure

GOV.UK Frontend is broken into a number of layers in order to help provide a
logical structure, loosely following the conventions of [ITCSS].

1. [Settings](#settings)
2. [Tools](#tools)
3. [Helpers](#helpers)
4. [Core](#core)
5. [Objects](#objects)
6. [Components](#components)
7. [Utilities](#utilities)
8. [Overrides](#overrides)

Each folder has its own entry point (`_all.scss`).

## Settings

Global variables for the project, for example colour palettes and spacing and
typography scales.

This layer should not output any CSS.

## Tools

Mixins or functions that implement either logic (e.g. conditionally outputting
CSS) or calculations, and that need to be made available globally.

This layer should not output any CSS.

## Helpers

Mixins that abstract common styling (for example, focus states or visually
hidden content)

This layer should not output any CSS.

## Core

Basic content styles for typography, links etc. The classes defined in this
layer would generally correspond to an HTML element - for example paragraphs,
headings, lists or links.

## Objects

Objects can range from something as simple as a wrapper element, to layout
systems.

They may be used in any number of unrelated contexts to the one you can
currently see it in. This means that making modifications to these types of
class could potentially have knock-on effects in other places.

## Components

Discrete pieces of UI. In most cases these will map to the components in the
Design System.

## Utilities

Utility classes – for example clearing floats, visually hiding content.

## Overrides

Classes that map to a specific property – for example margin or font weight -
and override all other layers. Rules in this layer will generally be marked as
!important.

Class names within this layer use an additional prefix `-!-`, for example
`.govuk-!-font-width-regular`.



[ITCSS]: http://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528
