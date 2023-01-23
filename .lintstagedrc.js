const { ESLint } = require('eslint')

module.exports = {
  // ESLint's configuration makes it ignore built files in `dist` or `package`
  // that we want left alone, as well as the polyfills.
  // The glob used by lint-staged to trigger the linting on commit isn't aware
  // of that ignore list, so will ask ESLint to lint those files.
  // This makes ESLint raise a warning for these files, which errors the linting
  // because we use `--max-warnings 0`.
  // To avoid that, we need to filter out files ignored by ESLint,
  // as recommended by lint-staged.
  //
  // https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore
  '*.{cjs,js,mjs}': async (files) => {
    const filesToLint = await removeESLintIgnoredFiles(files)
    return [`npm run lint:js:cli -- --fix ${filesToLint}`]
  },
  '*.scss': ['npm run lint:scss:cli -- --fix']
}

/**
 * Removes files ignored by ESLint from a list of files provided by lint-staged
 *
 * @param {Array<string>} files - The list of files lint-staged wants to lint
 * @returns {Array<string>} - The list without any of the files ignored by ESLint
 */
async function removeESLintIgnoredFiles (files) {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file)
    })
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  // Wrap file in quotes in case it contains a space
  return filteredFiles.map(file => `"${file}"`).join(' ')
}
