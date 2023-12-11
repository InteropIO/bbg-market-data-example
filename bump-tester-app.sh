echo "Bump Tester App"

cd ./tester-app

echo "Bump version"
NEW_VERSION=$(npm --no-git-tag-version version minor)

echo "New version is ${NEW_VERSION}"

echo "Build"
npm run build --if-present

echo "Commit package.json and package-lock.json /dist"
git add "package.json"
git add "package-lock.json"
git add "dist/"
git commit -m "Bump tester-app ${NEW_VERSION}"
git tag tester-app@${NEW_VERSION}
