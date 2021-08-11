# Resize text in browsers

When building components, you should check that the text:

- resizes with the page and does not stay a fixed size
- stays within its containers (for example, a box or banner)

If text spills outside of its container, your component:

- will look wrong
- may not work, if the text blocks out an interactive element
- may make some text hard for users to read

Follow these instructions to test the effect of resizing text within different browsers and devices. Please note some browsers may work slightly differently, depending on their version.

## Resize text in Firefox

You can resize text in Firefox in 2 ways.

### Use Zoom text only to resize text

1. On the menu bar, select **Firefox**.
2. Select **Preferences**.
3. Under **Language and appearance - Zoom**, select **Zoom text only**. This option lets you zoom in or out only on the webpage text. It does not affect images or any other page elements.
4. Press **Command** (Mac) or **Ctrl** (other operating systems), then **+** or **-** to increase or decrease the text size.

### Use the Size dropdown to resize text

1. On the menu bar, select **Firefox**.
2. Select **Preferences**.
3. Under **Language and appearance - Fonts and Colors**, select the **Size** dropdown to display font size options.

## Resize text in Google Chrome

1. On the URL bar, select the 3 dots icon.
2. Select **Settings**.
3. Select **Appearance**.
4. Select **Customise fonts**. The screen displays the options for you to change the font size.

## Resize text in Chrome or Firefox for Android

1. Select **Settings**. 
2. Select **Accessibility**.
3. Drag the **Text scaling** slider until you're happy with the size of the example text.

## Resize text in Internet Explorer versions 8 to 11

1. Press **Alt** to display the menu bar. 
2. On the menu bar, select **View**.
3. Select **Text size** to display resizing options.

## Resize text in Microsoft Edge

1. On the URL bar, select the 3 dots icon.
2. Select **Settings**.
3. Select **Appearance**.
4. Scroll down to **Fonts** and select the **Font size** dropdown to display font size options.

## Resize text in Safari

1. Press **Option**.
2. While still pressing **Option**, select the **View** menu.
3. Select **Make Text Bigger** or **Make Text Smaller**. To display the text in its original size again, select **Actual Size**.

## Known issue: no text resizing in iOS

You cannot resize the text for GOV.UK Design System styles in iOS. 

Due to iOS constraints, our styles do not support adjusting the base font size on iOS devices.

For more details, see our [GitHub issue #882: Investigate Dynamic Type to improve accessibility for iOS users](https://github.com/alphagov/govuk-frontend/issues/882).
