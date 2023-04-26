#!/bin/sh
set -e

# Get highest tag published on Github
HIGHEST_PUBLISHED_VERSION=$(git tag --list 2>/dev/null | sort -V | tail -n1 2>/dev/null | sed 's/v//g')

# Extract tag version from ./package/package.json
CURRENT_VERSION=$(node -p "require('./package/package.json').version")

function version() { echo "$@" | awk -F. '{ printf("%d%03d%03d\n", $1,$2,$3); }'; }

if [ $CURRENT_VERSION == $HIGHEST_PUBLISHED_VERSION ]; then
  echo "⚠️ Git tag $TAG already exists. Check you have updated the version in package/package.json correctly."
  exit 1
elif [ $(version $CURRENT_VERSION) -ge $(version $HIGHEST_PUBLISHED_VERSION) ]; then
  NPM_TAG="latest"
else
  major_version_num="${CURRENT_VERSION:0:1}"
  NPM_TAG="latest-$major_version_num"
fi
