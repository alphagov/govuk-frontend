#!/bin/sh
set -e

ALL_PACKAGE_VERSION=$(node -p "require('./packages/all/package.json').version")
TAG="v$ALL_PACKAGE_VERSION"

npm run build:packages &&
lerna publish --skip-git --skip-npm &&
npm run build:dist


ALL_PACKAGE_VERSION=$(node -p "require('./packages/all/package.json').version")
TAG="v$ALL_PACKAGE_VERSION"
ERROR_CODE=$?
CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [ $ERROR_CODE != 0 ]; then
    echo "⚠️ Error with lerna publish. Please try again."
    exit $ERROR_CODE;
else
    # if you cancel lerna publish it still exists with 0. If there is nothing to commit,
    # then exit. Otherwise commit changes.
    if [ -z "$(git status --porcelain)" ]; then
        echo "⚠️ Nothing to commit. Run lerna publish again."
        exit 1;
    else
        git add . &&
        git commit -m "Release $TAG" &&
        #set upstream so that we can push the branch up
        git push --set-upstream origin $CURRENT_BRANCH_NAME &&
        git push
        echo "🗒 All done. Ready to create a pull request. Once approved, run npm run release"
    fi
fi
