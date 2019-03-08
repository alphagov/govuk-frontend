#!/bin/sh
set -e

echo "Checking if a CI run is needed post commit: ${TRAVIS_COMMIT_RANGE}"
if ! git diff --name-only ${TRAVIS_COMMIT_RANGE} | grep -qvE '(\.md$)'
then
  echo "Only documentation files were updated, not running the CI."
  exit
fi