# How to write GitHub Actions

## Install the VS Code extension

If you're using Visual Studio Code install the GitHub Actions workflow extension: https://marketplace.visualstudio.com/items?itemName=github.vscode-github-actions

## Set inputs as environment variables

Set inputs as environment variables for the workflow rather using expressions inline (`${{ }}`).

Set the [`env` at the top-level](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#env)
of the workflow or [per step](https://docs.github.com/en/actions/reference/security/secure-use#use-an-intermediate-environment-variable).

Bad:

```yaml
- name: Check PR title
  run: |
    if [[ "${{ github.event.pull_request.title }}" =~ ^octocat ]]; then
      echo "PR title starts with 'octocat'"
      exit 0
    else
      echo "PR title did not start with 'octocat'"
      exit 1
    fi
```

Good :

```yaml
- name: Check PR title
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    if [[ "$TITLE" =~ ^octocat ]]; then
      echo "PR title starts with 'octocat'"
      exit 0
    else
      echo "PR title did not start with 'octocat'"
      exit 1
    fi
```

## Use quotes to protect variables

When using variables use double quotes to prevent them from breaking scripts when spaces or other characters are used.

Bad:

```shell
RELEASE_TITLE="Release v6.2.0"
git commit -m $RELEASE_TITLE
# Results in the command breaking since there is a space in the RELEASE_TITLE variable
```

Good:

```shell
RELEASE_TITLE="Release v6.2.0"
git commit -m "$RELEASE_TITLE"
```

## Move complicated logic outside of the workflow

Instead delegate to shell or JavaScript scripts that can be run individually on our machines and accept options as environment variables (to help testing).
Scripts should have associated unit tests when possible

Bad:

```yaml
- name: Generate release notes
  uses: actions/github-script@v9.0.0
  with:
    script: |
      function generateReleaseNotes (version) {
        // ... lots of logic here
      }

      generateReleaseNotes(process.env.PACKAGE_VERSION)
```

Good:

```yaml
- name: Generate release notes
  uses: actions/github-script@v9.0.0
  with:
    script: |
      const { generateReleaseNotes } = await import('${{ github.workspace }}/shared/github-scripts/changelog-release-helper.mjs')

      generateReleaseNotes(process.env.PACKAGE_VERSION)
```

## Using environments

Avoid skipping steps and instead echo out destructive commands that would have been run.

Bad:

```yaml
- name: Create GitHub release
  if: inputs.environment == 'production'
  run: |
    if gh release view "$GH_TAG" > /dev/null 2>&1; then
      echo "::error::Release $GH_TAG already exists. Please delete the release and tag via the GitHub UI and re-run this workflow"
      exit 1
    fi

    gh release create
```

Good:

```yaml
- name: Create GitHub release
  env:
    IS_PRODUCTION: inputs.environment == 'production'
  run: |
    if gh release view "$GH_TAG" > /dev/null 2>&1; then
      echo "::error::Release $GH_TAG already exists. Please delete the release and tag via the GitHub UI and re-run this workflow"
      exit 1
    fi

    create_github_release() {
      gh release create
    }

    if $IS_PRODUCTION; then
      create_github_release
    else
      declare -f create_github_release
    fi
```

Good:

Note that if the step is a one line command, it's okay to use `if:`.

```yaml
- name: Publish to npm
  if: inputs.environment == 'production'
  run: npm publish
```

## Surface important information into the Github Job Summary

When there is important information to review output it to the top level summary.

### Single line output

```shell
echo '# Built package output' >> $GITHUB_STEP_SUMMARY
```

### Multiline output

````shell
{
  echo '# Built package output'
  echo '```dist'
  tree dist
  echo '```'
} >> $GITHUB_STEP_SUMMARY
````

### Set errors as annotations

Set errors [using ::error::](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-error-message) which outputs to the top level summary

Bad:

```shell
  echo "Error: Release $GH_TAG already exists. Please delete the release and tag via the GitHub UI and re-run this workflow"
  exit 1
```

Good:

```shell
  echo "::error::Release $GH_TAG already exists. Please delete the release and tag via the GitHub UI and re-run this workflow"
  exit 1
```
