#!/bin/sh
set -ex

# Computes the diff of `packages/govuk-frontend/dist` between a provided base reference (branch, tag, commit SHA) and the current HEAD.
# It outputs the resulting diff in the provided output folder
#
# Usage: `bin/package-diff.sh <base-reference> <output-folder>`

# Default the base branch to main to allow running locally quickly
base="${1:-main}"
# Default the head branch to the commit SHA when detached
head=$(git branch --show-current | git rev-parse HEAD)
# And the output folder to the current working directory
output_folder="${2:-`pwd`}"

rm -Rf .cache/diff/package
mkdir -p .cache/diff/package

# Switch to base branch
git checkout $base

# Build package for base branch
npm install --ignore-scripts --no-save --silent
npm run build:package --workspace govuk-frontend

# Switch back to original branch
git checkout $head

# Commit build output from base branch
git add --force packages/govuk-frontend/dist/
git commit --allow-empty -m "Build output for '$base'" --no-verify

# Build package for original branch
npm install --ignore-scripts --no-save --silent
npm run build:package --workspace govuk-frontend

# Commit build output from original branch
git add --force packages/govuk-frontend/dist/
git commit --allow-empty -m "Build output for '$head'" --no-verify

# Diff the minified JS file
git diff HEAD^ -- packages/govuk-frontend/dist/govuk/govuk-frontend.min.js \
  > $output_folder/.cache/diff/package/js.diff

# Diff the minified CSS file
git diff HEAD^ -- packages/govuk-frontend/dist/govuk/govuk-frontend.min.css \
  > $output_folder/.cache/diff/package/css.diff

# The following are directory diffs but filtered using git pathspec
# See https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec

# Diff the Nunjucks templates
git diff -M05 HEAD^ -- "packages/govuk-frontend/dist/**/*.njk" \
  > $output_folder/.cache/diff/package/nunjucks.diff

# Diff the rendered HTML output
git diff -M05 HEAD^ -- "packages/govuk-frontend/dist/**/*.html" \
  > $output_folder/.cache/diff/package/html.diff

# Diff the rest of the files, excluding the sourcemaps and the minified files
git diff -M05 HEAD^ -- packages/govuk-frontend/dist \
  ":(exclude)**/*.html" \
  ":(exclude)**/*.map" \
  ":(exclude)**/*.min.*" \
  ":(exclude)**/*.njk" \
  > $output_folder/.cache/diff/package/other.diff
