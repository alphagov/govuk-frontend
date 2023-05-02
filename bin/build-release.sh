#!/bin/sh
set -e

# Check if there are unexpected changes. Changes to CHANGELOG.md, package.json
# and package-lock.json files are expected as part of the normal release process.
changes="$(git status --porcelain -- ':!CHANGELOG.md' ':!packages/govuk-frontend/dist/package.json' ':!package-lock.json')"
if [[ -n $changes ]]; then
  echo "⚠ Unexpected changes in your working directory:"
  echo "$changes"
  exit 1
fi

echo "Starting to build release..."
echo " "
echo "This will:"
echo "- run the test suite"
echo "- build GOV.UK Frontend into the 'packages/govuk-frontend/dist/' directory"
echo "- build GOV.UK Frontend into the 'dist/' directory"
echo "- commit all changes and push the branch to remote"
echo " "

read -r -p "Do you want to continue? [y/N] " continue_prompt

if [[ $continue_prompt != 'y' ]]; then
    echo "Cancelling build, if this was a mistake, try again and use 'y' to continue."
    exit 0
fi

npm run test
npm run build:package
npm run build:release

ALL_PACKAGE_VERSION=$(node -p "require('./packages/govuk-frontend/dist/package.json').version")
TAG="v$ALL_PACKAGE_VERSION"
CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [ $(git tag -l "$TAG") ]; then
    echo "⚠️ Git tag $TAG already exists. Check you have run `npm version` correctly."
    exit 1;
else
    git add .
    git commit -m "Release $TAG"
    # set upstream so that we can push the branch up
    git push --set-upstream origin $CURRENT_BRANCH_NAME
    git push
    echo "🗒 All done. Ready to create a pull request. Once approved, run npm run publish-release"
fi
