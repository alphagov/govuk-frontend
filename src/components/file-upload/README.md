# File upload

A control that lets the user select a file.

We recommend using a native input using `type="file"`, rather than a custom implementation.

This is so:
* the control gains focus when tabbing through the page
* the control functions using a keyboard
* the control functions using assistive technology
* the control functions when javascript is not available

A custom implementation of this control would need to meet the criteria above.
