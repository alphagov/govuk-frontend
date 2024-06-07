const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Tag', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('tag')
  })

  it('outputs a <strong> element', () => {
    document.body.innerHTML = render('tag', examples.default)
    const $component = document.querySelector('.govuk-tag')

    expect($component.tagName).toBe('STRONG')
  })

  it('contains the content from the `text` option', () => {
    document.body.innerHTML = render('tag', examples.default)
    const $component = document.querySelector('.govuk-tag')

    expect($component).toHaveTextContent('Alpha')
  })

  it('includes additional classes from the `classes` option', () => {
    document.body.innerHTML = render('tag', examples.grey)
    const $component = document.querySelector('.govuk-tag')

    expect($component).toHaveClass('govuk-tag--grey')
  })

  it('escapes HTML when using the `text` option', () => {
    document.body.innerHTML = render('tag', examples['html as text'])
    const $component = document.querySelector('.govuk-tag')

    expect($component).toHaveTextContent('<span>Alpha</span>')
  })

  it('does not escape HTML when using the `html` option', () => {
    document.body.innerHTML = render('tag', examples.html)
    const $component = document.querySelector('.govuk-tag')

    expect($component).toContainHTML('<span>Alpha</span>')
  })

  it('sets any additional attributes based on the `attributes` option', () => {
    document.body.innerHTML = render('tag', examples.attributes)
    const $component = document.querySelector('.govuk-tag')

    expect($component).toHaveAttribute('data-test', 'attribute')
    expect($component).toHaveAttribute('id', 'my-tag')
  })
})
