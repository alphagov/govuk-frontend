
# Component API definition and use
We have chosen as Nunjucks as the templating language for GOV.UK Frontend components. We expose those templates as reusable chunks of code: macros. Developers import macros into their application, call them as per documentation and provide data to its arguments.

To provide a level of consistency for developers we have standardised argument names, their expected input, use and placement. There are expectations, and  if so they are documented accordingly.

## Specifying content
When providing *content* to a macro, say for a label or a button, we accept two argument options:

 - `text` accepts a plain string and is the default way of passing content
 - `html` accepts html markup. In the template we will not escape html so it will be rendered. In a scenario where both text and html are set, html argument will take precedence over text.

Example:

`{{ govukButton({"text": "Button text"}) }}`

`{{ govukButton({"html": "Button <span class='bold'>text</span>"}) }}`

Example of implementing logic in a component template:

`{{ params.html | safe if params.html else params.text }}`

Example shows that if `html` and `text` arguments are present, then `html` takes precedence over `text` and we are not escaping it.

## Allow for text argument to be passed as a single argument
When the users don't want to specify extra attributes we should allow them to call a component without having to pass an entire object.

Example:

`govukErrorMessage("Full name must be provided")`

This is possible for components that rely only on `text` and `html` attributes.

We do this in the macro so that if in the future we transpile the templates we do not have to worry about mimicking this functionality in other languages.

Example of implementing this logic in a component macro:
```
{% if params|string === params %}
  {% set params = { text: params } %}
{% endif %}
```

## Naming attributes
We should use **camelCase** for naming attributes.

If a component depends on another component, we group the attributes for the dependent component inside an object, where the name of the object is the name of the component using **camelCase** convention. In case of ambiguity we prefix the component name.

Example of a component depending on another component
```
{{ govukLabel({
	"text": "Label text",
	"errorMessage": {
		"text": "Error message"
	}
}) }}
```

Example of a component depending on two other components
```
{{ govukInput({
	"name": "example-input",
	"label": {
		"text": "Label text"
	},
	"errorMessage": {
		"text": "Error message"
	}
}) }}
```

## Mimic HTML attribute names
When there is a need to specify html attributes, such as *checked, disabled, id, name*, etc, and they map directly, we use the same argument name. We use boolean value to check and render the attribute.

Example:

`{{ govukButton({"disabled": true}) }}`

`{{ govukCheckbox({"checked": true}) }}`


## Defining additional HTML attributes
When there is a need to add additional attributes to the component, we accept an ***"attributes"*** object with key : value pairs for each attribute.

You cannot use this to set attributes that are already defined, such as class – use the classes argument instead.

Example:
```
{{ govukButton({
	"attributes" : {
	   "data-target" : "contact-by-text",
	   "aria-labelledby": "error-summary-heading-example-1",
	   "tabindex": "-1"
	}
}) }}
```

## Specifying multiple items
When a component accepts a *single array of items* for an output, such as checkboxes or radios, we accept an ***"items"*** array of objects.  Table component is an exception is it can contain multiple array for rows, head, footer where there is need to for more specific names.

Example:
```
{{ govukCheckbox({
   "items": [
   {
      "value": "checkbox value",
      "text": "Checkbox text"
    },
    {
      "value": "checkbox value 2",
      "text": "Checkbox text 2"
    }
  ]
}) }}
```
## Use of classes to specify variants
When a component has multiple visual presentations, such default button vs start button, we make use of classes argument to differentiate between them.

Default button example:
```
{{ govukButton({
	"text" : "Continue"
}) }}
```
Start button example:
```
{{ govukButton({
	"text" : "Start",
	"classes" : "govuk-c-button--start"
}) }}
```
