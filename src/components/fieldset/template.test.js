/* globals describe, it, expect */

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('fieldset')

describe('fieldset', () => {
  it('renders nested children', () => {
    const $ = render('fieldset', examples['with-nested-children'])

    console.log($.html())
    expect($('label').html()).toContain('House number')
  })
})
