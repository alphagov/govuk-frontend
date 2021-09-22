# Test components using accessibility acceptance criteria

We're still developing this page. To suggest changes, comment on the [GitHub issue for improving this page's content](https://github.com/alphagov/govuk-design-system/issues/1850). Alternatively, you can [contact us directly](https://design-system.service.gov.uk/#support).

This page will help you if you are:

- contributing a new component to the [GOV.UK Design System](https://design-system.service.gov.uk/)
- iterating an existing component

Your component or iteration should meet: 

- [the GOV.UK Design System’s accessibility acceptance criteria](#govuk-design-system---accessibility-acceptance-criteria)
- [custom accessibility acceptance criteria that you need to write specifically for your component or iteration](#writing-custom-accessibility-acceptance-criteria-for-your-component)

If your component cannot meet some of these criteria, or if you cannot check them, let us know in your pull request or [contact us](https://design-system.service.gov.uk/#support).

You should also [test your component with disabled people](https://www.gov.uk/service-manual/user-research/running-research-sessions-with-people-with-disabilities).

## How the GOV.UK Design System's accessibility acceptance criteria relate to WCAG

The GOV.UK Design System accessibility acceptance criteria are a combination of the [WCAG (Web Content Accessibility Guidelines)](https://www.w3.org/TR/WCAG21/) and the general accessibility requirements that components need to meet.

The GOV.UK Design System’s accessibility acceptance criteria are complementary to WCAG and do not replace it.

## How to test components using accessibility acceptance criteria

You need to [make sure your services work with a set of assistive technology and browser combinations](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies).

We recommend you test your component by putting it inside a realistic page. For example, a complete page that uses realistic page content and contains elements like a header, footer and so on.

Check if the desired behaviour happens when testing. For example, whether [screen readers announce the headings](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies#how-to-test). As you test, take notes about whether the component or iteration met the criteria, or if there were issues you need to investigate further.

We have created a [template for capturing findings from accessibility tests](https://docs.google.com/spreadsheets/d/1O0rWoH3ah_rj2iJ2We9VfyHNOr0gOVItXRy3vKzuYSw/edit). If it could help you, download it or make your own copy. If you cannot access the spreadsheet, [contact us]( https://design-system.service.gov.uk/#support) and we will make sure you get a copy.

## GOV.UK Design System - accessibility acceptance criteria

Before we publish a component on the GOV.UK Design System, it should meet the following accessibility requirements.

### General accessibility acceptance criteria

To show clearly to users, components should:

- have text with a colour contrast of at least 4.5:1 between text and the background
- not depend on colour alone to communicate information
- not move (for example, flash or blink)
- be visually distinct from other elements on the page
- use [semantic markup](https://www.w3.org/WAI/WCAG21/Techniques/general/G115.html)
- if necessary, hide and display content consistently for both screen reader users and sighted users - [learn more about hiding and displaying content](https://webaim.org/techniques/css/invisiblecontent/#intro)

To make sure users can use them, components should at least be operable with:

- a keyboard
- voice
- touch
- a mouse
- the rotor or equivalent, if your screen reader has one - [learn how to use the rotor and local and global context menus](https://dequeuniversity.com/screenreaders/)
- a screen reader in browse or reader mode
- any other modes your screen reader might have - [learn how to use different modes](https://dequeuniversity.com/screenreaders/)

Behaviour may vary between different screen reader modes, which could affect what meets the definition of a component being 'operable'.

To give users the information they need, components should:

- contain markup in an order that makes sense to users
- announce any changes to all users - [see our accessibility workshop slides for an example about informing users](https://www.google.com/url?q=https://docs.google.com/presentation/d/1tPocE9yr6VyE33Y_xzeV4jsHbU6z3vla3IJT1Gqwyoc/edit%23slide%3Did.ge5d201f83b_0_6&sa=D&source=editors&ust=1629108717555636&usg=AOvVaw1nrYs6mVY6yelTob5NRCzC)
- be labelled as a [landmark region](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/index.html), if appropriate

To allow users to make adjustments on their device, components should work when:

- [users change colours on websites](https://accessibility.blog.gov.uk/2017/03/27/how-users-change-colours-on-websites/)
- JavaScript fails to load, but stylesheets load
- stylesheets fail to load, but JavaScript loads
- both JavaScript and stylesheets fail to load
- [users enlarge the text](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/resize-text-in-browsers.md)
- users zoom to 400%

### Accessibility acceptance criteria for headings

All headings should:

- convey the level - for more information, [see the headings section of GOV.UK's guidance on basic accessibility checks](https://www.gov.uk/government/publications/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one#check-youre-using-proper-headings)
- be nested in a way that makes sense to users
- allow users to navigate by headings

### Accessibility acceptance criteria for interactive elements (elements that users can focus)

Users should be able to interact with elements using at least:

- a keyboard
- a screen reader in focus or form mode
- screen reader shortcuts - [learn more about screen reader shortcuts]( https://dequeuniversity.com/screenreaders/)
- voice

Interactive elements should be actionable with at least:

- a keyboard
- touch
- a mouse
- voice

To make sure users can operate interactive elements, those elements should:
 
- be large enough to tap with one finger
- change appearance when focused - [learn more about GOV.UK Design System focus states](https://design-system.service.gov.uk/get-started/focus-states/)
- change in appearance when users hover their mouse over them
- change in appearance when users touch them
- not trap focus in a loop that users cannot exit from
- if required, provide hints to help users interact with them

### Accessibility acceptance criteria for form elements

All form elements should:

- have a perceivable text label
- associate label and instructions with inputs - for more information, [see the section on form field markup in GOV.UK’s guidance on basic accessibility checks](https://www.gov.uk/government/publications/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one#check-form-fields-are-marked-up-appropriately)
- if appropriate, [use the fieldset and legend elements to group related form fields](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements/)
- if appropriate, use the [autocomplete attribute](https://design-system.service.gov.uk/components/text-input/#use-the-autocomplete-attribute)

## Writing custom accessibility acceptance criteria for your component 

Your component should meet the GOV.UK Design System criteria described elsewhere on this page. However, you might also need to write, and test against, accessibility acceptance criteria that apply specifically to your component.

When starting out, you may not be sure what counts as correct behaviour. If so, try comparing your component's behaviour with how screen readers announce the Design System's buttons, form elements or other components.

A non-exhaustive list of points to consider when writing your own criteria:

- screen readers should announce HTML elements such as buttons and headings - for example, they should announce a button as a button, an h2 as a heading level 2, and so on
- screen readers should announce the text content of elements, such as headings
- for interactive components, check if the screen reader gives users instructions on how to interact with them - for example, "To activate, press **Enter**", if this is the native behaviour of the screen reader for that particular element 
- check if users get feedback about any changes to the state of the element - for example, if the element expands or collapses ([see our accessibility workshop slides for an example of when a screen reader did not announce changes, and how we solved the problem](https://docs.google.com/presentation/d/1tPocE9yr6VyE33Y_xzeV4jsHbU6z3vla3IJT1Gqwyoc/edit#slide=id.ge310af9263_0_88))

### Use existing resources when you write your own criteria

Here are some useful resources to help you write your own accessibility acceptance criteria:

- GOV.UK blog - [Improving accessibility with accessibility acceptance criteria](https://insidegovuk.blog.gov.uk/2018/01/24/improving-accessibility-with-accessibility-acceptance-criteria/)
- BBC guide - [How to write accessibility acceptance criteria](https://bbc.github.io/accessibility-news-and-you/guides/accessibility-acceptance-criteria.html)

## Include your own criteria in your pull request

Make sure you include your own accessibility acceptance criteria in the description for your pull request. 

Including criteria in your pull request allows us to:

- use the criteria as a checklist
- keep the criteria for future testing, if there is another iteration to the component

## Testing your iteration against existing criteria

Components that you iterate may already have accessibility acceptance criteria. If so, you should test your iteration against these existing criteria. However, depending on what you change, you may still need to write new criteria to describe the component’s behaviour.

If you're only making a small change to a component, then you only need to test against the criteria relevant to the change. For example, if you change a heading level, you will probably only need to test against the heading criteria.

If you cannot find criteria in the [GOV.UK Design System Community Backlog](https://design-system.service.gov.uk/community/backlog/), then [ask the GOV.UK Design System team]( https://design-system.service.gov.uk/#support).
