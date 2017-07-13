# Check to see whether the package-lock.json file needs updating.

echo "Check if Demo VERSION.txt has been updated"

if git diff --exit-code --quiet demo/VERSION.txt; then
  echo "VERSION.txt is unchanged, no need to deploy."
  exit 1
else
  echo "Deploying demo to govuk-frontend.herokuapp.com ..."
fi
