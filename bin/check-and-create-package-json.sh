#!/bin/sh
set -e

PACKAGES_DIR="./packages/";

# assume there are no new components
ALL_PACKAGE_JSON_FILES_PRESENT=true;

# function to create a sample package.json
# and add latest published version of globals as dependency (as it's most common)
create_package_json()
{
  GLOBALS_PACKAGE_VERSION=$(node -p "require('./packages/globals/package.json').version")
  PACKAGE_JSON='
  {
    "name": "@govuk-frontend/'${D##*/}'",
    "version": "0.0.0",
    "dependencies": {
      "@govuk-frontend/globals": "'$GLOBALS_PACKAGE_VERSION'"
    }
  }'

  # create a package.json file
  echo "$PACKAGE_JSON" >> "${D}/package.json"
}


# check in all folders inside /packages to see if any new components have been added
for D in $PACKAGES_DIR*; do
    if [ -d "${D}" ]; then
        # if there are new folders (components then they will be missing package.json)
        ALL_PACKAGE_JSON_FILES_PRESENT=false

        if ! [ -e ${D}/package.json ]; then
          # ${D##*/} strips everything before /
          COMPONENT_NAME=${D##*/}
          echo "⚠️ 🆕  $COMPONENT_NAME 🆕  component is missing a package.json file.\n"
          echo "⚠️ I've created a sample package.json file. Please amended it with correct data.\n"

          create_package_json ${D}

          echo "⚠️ Remember to add the 🆕  $COMPONENT_NAME 🆕  component to all/package.json\n"
          read -n 1 -s -r -p "Once done, come back and press any key to continue: "
        fi
    fi
done
