#!/bin/sh
set -e

echo "Publishing a pre-release to npm."

# User should enter "internal" or "beta", as per the documentation for pre-releases
echo "Enter the npm tag for this pre-release."
echo "For internal releases, use 'internal'."
echo "For beta releases, use 'beta'."

read -r -p "Enter npm tag: " NPM_TAG

echo "Starting a release..."
echo " "
echo "This will:"
echo "- check that you're logged in to npm as the correct user"
echo "- publish the package to npm if it has not been published already"
echo "- tag the package on npm with '$NPM_TAG'"
echo "- check that there is not already a Github tag published"
echo "- create a new Github tag"
echo "- push the Github tag to remote origin"
echo "- create a zip file of the 'dist/' directory locally"
echo " "

read -r -p "Do you want to continue? [y/N] " continue_prompt

if [[ $continue_prompt != 'y' ]]; then
    echo "Cancelling release, if this was a mistake, try again and use 'y' to continue."
    exit 0
fi

# echo  "Checking that you can publish to npm..."

# at some point we should create a team and check if user exists in a team
# ! npm team ls developers | grep -q $NPM_USER

NPM_USER=$(npm whoami)
if ! [ "govuk-patterns-and-tools" == "$NPM_USER" ]; then
    echo "⚠️ FAILURE: You are not logged in with the correct user."
    exit 1
fi

echo "📦  Publishing package..."

NPM_ARGS=( --workspace govuk-frontend )
[ $NPM_TAG = "latest" ] || NPM_ARGS+=( --tag $NPM_TAG )

# Try publishing
npm publish "${NPM_ARGS[@]}"
echo "🗒 Package published!"

# Extract tag version from ./packages/govuk-frontend/package.json
ALL_PACKAGE_VERSION=$(npm run version --silent --workspace govuk-frontend)
TAG="v$ALL_PACKAGE_VERSION"

if [ $(git tag -l "$TAG") ]; then
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
