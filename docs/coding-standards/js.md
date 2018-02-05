# JavaScript

# Linting

GOV.UK Frontend uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter. All JavaScript files follow its conventions, and it runs on CI to ensure that new pull requests are in line with them.

## Running standard manually

To check the whole codebase, run:

```bash
npm run lint
```

## Running standard in your editor

Easier than running standard manually is to install it as a plugin in your editor. This way, it will run automatically while you work, catching errors as they happen on a per-file basis.

### Sublime Text

Using [Package Control](https://packagecontrol.io/), install [SublimeLinter](http://www.sublimelinter.com/en/latest/) and [SublimeLinter-contrib-standard](https://packagecontrol.io/packages/SublimeLinter-contrib-standard).

For automatic formatting on save, install [StandardFormat](https://packagecontrol.io/packages/StandardFormat).

### Atom

Install [linter-js-standard](https://atom.io/packages/linter-js-standard).

For automatic formatting, install [standard-formatter](https://atom.io/packages/standard-formatter). For snippets, install [standardjs-snippets](https://atom.io/packages/standardjs-snippets).

### Visual Studio Code

Install [vscode-standardjs](https://marketplace.visualstudio.com/items/chenxsan.vscode-standardjs). It includes support for automatic formatting.

For snippets, install [vscode-standardjs-snippets](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-standardjs-snippets).

### Other editors

There are [official guides for most of the popular editors](http://standardjs.com/index.html#text-editor-plugins).

## Do I need to respect this?

If you want to submit a pull request to the govuk-frontend, your code will need to pass the linter.

If you're just using the prototype kit in a separate project, then no, you aren't forced to use standard, or any other linter for that matter. Just write code as you would normally.

## Why lint?

Automated linting ensures project-wide consistency and limits (ideally eliminates) bikeshedding discussions involving spacing, naming conventions, quotes, and others during the pull request review process. It frees the reviewer to focus on the actual substance rather than stylistic issues.

More importantly, linting will catch some low hanging programmer errors, such as calling an undefined function or assigning a value and then never reading it. These allow the programmer to catch some bugs before having to test the code.

## Why standard?

Linting rules can be a contentious subject, and a lot of them are down to personal preference. The core idea of standard is to be opinionated and limit the amount of initial bikeshedding discussions around which linting rules to pick, because in the end, it's not as important which rules you pick as it is to just be consistent about it. This is why we chose standard: because we want to be consistent about how we write code, but don't want to spend unnecessary time picking different rules (which all have valid points).

The standard docs have a [complete list of rules and some reasoning behind them](http://standardjs.com/rules.html).

Standard is also [widely used (warning: large file)](https://github.com/feross/standard-packages/blob/master/all.json) (which means community familiarity) and has a [good ecosystem of plugins](http://standardjs.com/awesome.html).

If we decide to move away from it, standard is effectively just a preconfigured bundle of eslint, so it can easily be replaced by switching to a generic `.eslintrc` setup.
