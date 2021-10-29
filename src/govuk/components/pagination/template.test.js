/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('pagination')

describe('Pagination', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('pagination', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })
  })
})
