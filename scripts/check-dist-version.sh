# Check to see whether the VERSION.txt file has changed.

echo "Check if VERSION.txt in dist has been updated"

if git diff --exit-code --quiet dist/VERSION.txt; then
  echo "VERSION.txt is unchanged, no need to deploy."
  exit 1
else
  echo "Deploying dist to govuk-frontend.herokuapp.com ..."
fi
