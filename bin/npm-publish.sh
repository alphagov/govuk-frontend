#!/bin/sh
set -e

PACKAGE=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

# check if package exists or if the current version of the package is already published
if [ -z "$(npm info ${PACKAGE} 2> /dev/null)" ] || [ "$(npm info $PACKAGE@$VERSION version)" != "$VERSION" ]; then
  npm publish $@
  echo "🗒 Package published!" 
else
  echo "⚠️ $PACKAGE@$VERSION is already published!"
fi
