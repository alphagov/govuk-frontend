/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('task-list')

describe('Task List', () => {
  describe('default example', () => {
    it('renders the default example', () => {
      const $ = render('task-list', examples.default)

      const $component = $('.govuk-task-list')
      expect($component.get(0).tagName).toEqual('ul')
    })
  })
})
