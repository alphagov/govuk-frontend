#!/bin/sh
set -e

PACKAGE=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")
PUBLISHED=$(npm info $PACKAGE@$VERSION version)

if [ "$VERSION" = "$PUBLISHED" ]; then
  echo "⚠️ $PACKAGE@$VERSION is already published!"
else
  echo "📦 Publishing: $PACKAGE@$VERSION"
  npm publish $@
fi
