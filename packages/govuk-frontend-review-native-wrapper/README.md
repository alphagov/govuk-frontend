# Native wrapper loading the review app

Native apps for iOS and Android that load our review app in a WebView,
allowing us to test out techniques for supporting dark mode and Dynamic Type.

## iOS

### Requirements

- XCode
- Simulator for iOS 15 installed (XCode should prompt to download it)

### Running the project

Before anything, make sure the review app is running locally with `npm run dev`.

Launch XCode. On launch, XCode should prompt you for creating a project, cloning a Git repo or opening an existing project. Chose 'Open and existing project' and select the 'GOV.UK Frontend Webview Embedding' folder.

The webview code is in the `ContentView` Swift file. If you open that file in XCode, it should render a preview on the right hand side of the screen.

A settings toggle at the bottom of the preview ('Canvas Device settings') allows you to toggle light or dark mode for the app, as well as pick a size for Dynamic Type.

## Android

TODO
