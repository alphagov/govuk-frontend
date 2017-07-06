# Check to see whether the package-lock.json file needs updating.

echo "checking package-lock.json for changes"

if git diff --exit-code --quiet package-lock.json; then
  echo "no changes have been made to package-lock.json"
else
  echo "package-lock.json needs updating, run npm install with npm@5+ and commit"
  exit 1
fi
