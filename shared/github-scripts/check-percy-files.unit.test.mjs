import { checkRelevantChanges } from './check-percy-files.mjs'

const govukFrontendSrcPath = 'packages/govuk-frontend/src/govuk'
const govukReviewSrcPath = 'packages/govuk-frontend-review/src'

describe('checkRelevantChanges', () => {
  describe('govuk-frontend file extensions', () => {
    test.each([
      ['.scss', [`${govukFrontendSrcPath}/components/button/button.scss`]],
      ['.js', [`${govukFrontendSrcPath}/components/accordion/accordion.js`]],
      ['.mjs', [`${govukFrontendSrcPath}/components/header/header.mjs`]],
      ['.njk', [`${govukFrontendSrcPath}/components/button/template.njk`]],
      ['.yaml', [`${govukFrontendSrcPath}/components/button/button.yaml`]],
      ['.yml', [`${govukFrontendSrcPath}/components/button/button.yml`]]
    ])('returns true for %s', (description, changedFiles) => {
      expect(checkRelevantChanges(changedFiles)).toBe(true)
    })
  })

  describe('review app file extensions', () => {
    test.each([
      ['.scss', [`${govukReviewSrcPath}/stylesheets/app.scss`]],
      ['.js', [`${govukReviewSrcPath}/app.js`]],
      ['.mjs', [`${govukReviewSrcPath}/app.mjs`]],
      ['.njk', [`${govukReviewSrcPath}/views/component.njk`]],
      ['.yaml', [`${govukReviewSrcPath}/views/examples/example.yaml`]],
      ['.yml', [`${govukReviewSrcPath}/views/examples/example.yml`]]
    ])('returns true for %s', (description, changedFiles) => {
      expect(checkRelevantChanges(changedFiles)).toBe(true)
    })
  })

  describe('dist file extensions', () => {
    test.each([
      ['.js', [`dist/govuk-frontend.min.js`]],
      ['.css', [`dist/govuk-frontend.min.css`]]
    ])('returns true for %s', (description, changedFiles) => {
      expect(checkRelevantChanges(changedFiles)).toBe(true)
    })
  })

  describe('asset files', () => {
    test.each([
      [
        'govuk-frontend src',
        ['packages/govuk-frontend/src/govuk/assets/manifest.json']
      ],
      ['dist', ['dist/assets/manifest.json']]
    ])('returns true for %s', (description, changedFiles) => {
      expect(checkRelevantChanges(changedFiles)).toBe(true)
    })
  })

  describe('with irrelevant files', () => {
    it('returns true when relevant files mixed with irrelevant files', () => {
      const changedFiles = [
        'README.md',
        `${govukFrontendSrcPath}/components/button/button.scss`,
        'docs/contributing/testing.md'
      ]
      expect(checkRelevantChanges(changedFiles)).toBe(true)
    })

    it('returns false for irrelevant files', () => {
      const changedFiles = [
        'jest.config.mjs', // Root file
        '.github/workflows/test.yml', // GitHub files
        'bin/build-release.sh', // bin files
        'docs/contributing/testing.md', // doc files
        'packages/govuk-frontend/src/govuk/common/index.jsdom.test.mjs', // Test files, even if correct extension and location
        'packages/govuk-frontend/src/govuk/components/accordion/README.md', // Wrong extension, right location
        'packages/govuk-frontend/tasks/index.mjs', // Right extension in the package, but not relevant
        'packages/govuk-frontend-review/tasks/index.mjs', // Right extension in the package, but not relevant
        'shared/config/index.js' // Shared files
      ]
      expect(checkRelevantChanges(changedFiles)).toBe(false)
    })

    it('returns false for empty file list', () => {
      expect(checkRelevantChanges([])).toBe(false)
    })
  })
})
