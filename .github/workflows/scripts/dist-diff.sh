#!/usr/bin/env bash

# Make the whole script fail if any of the commands fail
# (including within pipes, in case we add some in the future)
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

# Computes the diff of `dist` between a provided base reference (branch, tag, commit SHA) and the current HEAD.
# It outputs the resulting diff in the provided output folder
# 
# Usage: `dist-diff.sh <base-reference> <output-folder>`

# Default the base branch to main to allow running locally quickly
base="${1:-main}"
# And the output folder to the current working directory
output_folder="${2:-`pwd`}"

# Diff the minified JS file
git diff \
  $base:dist/govuk-frontend-$(git show $base:dist/VERSION.txt).min.js \
  dist/govuk-frontend-$(cat dist/VERSION.txt).min.js \
  > $output_folder/dist-js.diff
# Diff the minified CSS file
git diff \
  $base:dist/govuk-frontend-$(git show $base:dist/VERSION.txt).min.css \
  dist/govuk-frontend-$(cat dist/VERSION.txt).min.css \
  > $output_folder/dist-css.diff
# Diff the rest of the files, excluding the sourcemaps and the minified files
# See https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec
git diff -M05 $base -- dist ":(exclude)*.map" \
  > $output_folder/dist.diff
