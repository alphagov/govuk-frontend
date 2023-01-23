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
  '*.{cjs,js,mjs}': filterTask('npm run lint:js:cli -- --fix'),
  '*.json': 'npm run lint:prettier:cli -- --write',
  '*.scss': 'npm run lint:scss:cli -- --fix --allow-empty-input'
}

// Configure paths to ignore
const eslint = new ESLint()

/**
 * Removes files ignored by ESLint from a list of files provided by lint-staged
 *
 * @param {string} task - The task `lint-staged` wants to execute
 * @returns {Promise<function(string[]): string[]>} Tasks to run with files argument
 */
function filterTask (task) {
  return async (files) => {
    const isIgnored = await Promise.all(
      files.map((file) => eslint.isPathIgnored(file))
    )

    // Wrap files in quotes in case they contains a space
    const paths = files
      .filter((_, i) => !isIgnored[i])
      .map(file => `"${file}"`)

    return paths.length
      ? [`${task} ${paths.join(' ')}`]
      : []
  }
}
