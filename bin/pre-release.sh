#!/bin/sh
set -e

LATEST_PUBLISHED_TAG=$(git describe --abbrev=0 --tags)

npm run build:package
npm run build:dist

ALL_PACKAGE_VERSION=$(node -p "require('./package/package.json').version")
TAG="v$ALL_PACKAGE_VERSION"
CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [ "$LATEST_PUBLISHED_TAG" == "$TAG" ]; then
    echo "⚠️ Git tag already exists."
    exit 1;
else
    git add .
    git commit -m "Release $TAG"
    #set upstream so that we can push the branch up
    git push --set-upstream origin $CURRENT_BRANCH_NAME
    git push
    echo "🗒 All done. Ready to create a pull request. Once approved, run npm run release"
fi
