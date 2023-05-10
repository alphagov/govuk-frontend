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

git diff -M05 $base -- dist \
  > $output_folder/dist.diff
