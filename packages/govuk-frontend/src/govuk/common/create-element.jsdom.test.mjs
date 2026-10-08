import { createElement } from './create-element.mjs'

describe('createElement', () => {
  it('creates an element of the specified type', () => {
    const $element = createElement('input')

    expect($element).toBeInstanceOf(HTMLInputElement)
  })

  it('sets all attributes', () => {
    const $element = createElement('div', {
      'data-polarity': 'reversed',
      'data-confinement-beam': 'active'
    })

    expect($element).toHaveAttribute('data-polarity', 'reversed')
    expect($element).toHaveAttribute('data-confinement-beam', 'active')
  })

  it('allows classes to be set by passing them as attributes', () => {
    const $element = createElement('div', {
      class: 'my-class'
    })

    expect($element).toHaveClass('my-class')
  })

  it('allows children to be added by passing them', () => {
    const $heading = createElement('h1')
    const $paragraph = createElement('p')

    const $element = createElement('div', {}, [
      $heading,
      $paragraph,
      '<p>Hello</p>'
    ])

    expect($element).toContainElement($heading)
    expect($element).toContainElement($paragraph)
    expect($element).toContainHTML('&lt;p&gt;Hello&lt;/p&gt;')
  })
})
