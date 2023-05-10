#!/bin/sh
set -e

# Computes the diff of `dist` between a provided base reference (branch, tag, commit SHA) and the current HEAD.
# It outputs the resulting diff in the provided output folder
# 
# Usage: `bin/dist-diff.sh <base-reference> <output-folder>`

# Default the base branch to main to allow running locally quickly
base="${1:-main}"
# And the output folder to the current working directory
output_folder="${2:-`pwd`}"

git diff -M05 $base -- dist \
  > $output_folder/dist.diff
