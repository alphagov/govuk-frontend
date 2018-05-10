#!/bin/sh
set -e

# echo  "Checking that you can publish to npm..."

# at some point we should create a team and check if user exists in a team
# ! npm team ls developers | grep -q $NPM_USER

NPM_USER=$(npm whoami)
if ! [ "govuk-patterns-and-tools" == "$NPM_USER" ]; then
  echo "⚠️ FAILURE: You are not logged in with the correct user."
  exit 1
fi

echo "📦  Publishing package..."

# Try publishing
cd package
npm publish
echo "🗒 Package published!" 
cd ..

# Extract tag version from ./package/package.json
ALL_PACKAGE_VERSION=$(node -p "require('./package/package.json').version")
TAG="v$ALL_PACKAGE_VERSION"
LATEST_PUBLISHED_TAG=$(git describe --abbrev=0 --tags)

if [ "$LATEST_PUBLISHED_TAG" == "$TAG" ]; then
    echo "⚠️ Tag $TAG already exists"
    exit 1
else
    echo "🗒 Tagging repo using tag version: $TAG ..."
    git tag $TAG -m "GOV.UK Frontend release $TAG"
    git push --tags
    echo "🗒 Tag $TAG created and pushed to remote."

    echo "🗒 Creating a release artifact..."
    git archive -o ./release-$TAG.zip HEAD:dist
    echo "🗒 Artifact created. Now create a release on GitHub and attach this."
fi
