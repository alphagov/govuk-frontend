#!/bin/sh
set -e

CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
CURRENT_VERSION=$(npm run version --silent --workspace govuk-frontend)

BRANCH_NAME="preview-$CURRENT_BRANCH_NAME"
# `/` are not valid in npm version numbers, so we turn them into `-`
# https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameter-Expansion
VERSION="$CURRENT_VERSION-${CURRENT_BRANCH_NAME/\//-}"

# Check if there are files that need to be commited
if [[ -n $(git status --porcelain) ]]; then
  echo "⚠️ You have unstaged files, please commit these and then try again."
  exit 1
fi

# Remove local branch if it already exists
if [ `git branch --list $BRANCH_NAME` ]; then
  echo "⚠️ Cleaning up branch $BRANCH_NAME that already exists."
  git branch -D $BRANCH_NAME
fi

# Work on the new branch
git checkout --orphan $BRANCH_NAME
# An orphaned branch stages all new files so reset them.
git reset

# Build the package as normal
echo "✍️ Build package"
npm ci
npm run build:package

# npm will try to install dev, optional and peer dependencies
# when installing from a Git repository, which will error
# when looking for our `@govuk-frontend/xyz@*` packages
# pointing to the npm workspaces in our source
echo "✍️ Remove dev dependencies"
npm pkg delete devDependencies --workspace govuk-frontend

echo "✍️ Update package version"
npm version $VERSION --allow-same-version --no-git-tag-version --workspace govuk-frontend

echo "✍️ Commit package files"
git add packages/govuk-frontend/package.json
git add package-lock.json
# Some files are gitignored so we need to force adding them.
git add --force packages/govuk-frontend/dist/
git add --force packages/govuk-frontend/govuk-prototype-kit.config.json
git commit --no-verify --message="Release GOV.UK Frontend 'v$VERSION' to '$BRANCH_NAME' for testing"

echo "✨ Filter the branch to only the packages/govuk-frontend/ directory..."
# Remove any untracked files
git clean -df
git filter-branch --force --subdirectory-filter packages/govuk-frontend

# Force the push of the branch to the remote Github origin
git push origin $BRANCH_NAME:$BRANCH_NAME --force

echo "⚠️ Branch pushed to '$BRANCH_NAME', do not edit this by hand."

git checkout $CURRENT_BRANCH_NAME

BRANCH_COMMIT_SHA=$(git rev-parse --short $BRANCH_NAME)

echo
echo "✅ Success! To install the pushed branch release, run 'npm install --save \"alphagov/govuk-frontend#$BRANCH_COMMIT_SHA\"'"
