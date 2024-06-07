#!/bin/sh
set -ex

mkdir -p dist

for f in ./node_modules/govuk-frontend/govuk/components/*; do
  echo $f
  if [ -d "${f}" ]; then

    COMPONENT_NAME=`basename ${f}`

    # trailing `|| true` as `diff` exits with 1 when finding a difference
    # which would make the script exit due to `set -e` at the top
    diff ../../packages/govuk-frontend/src/govuk/components/${COMPONENT_NAME}/template.njk ./node_modules/govuk-frontend/govuk/components/${COMPONENT_NAME}/template.njk > dist/${COMPONENT_NAME}.diff || true
  fi
done
