/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('modal-dialogue')

describe('Modal dialogue', () => {
  it('passes accessibility tests', async () => {
    const $ = render('modal-dialogue', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('has a role of `dialog`', () => {
    const $ = render('modal-dialogue', {})

    const $component = $('dialog')
    expect($component.attr('role')).toEqual('dialog')
  })
})
