import { closestAttributeValue } from './closest-attribute-value.mjs'

describe('closestAttributeValue', () => {
  it('returns the value of the attribute if on the element', () => {
    const $element = document.createElement('div')
    $element.setAttribute('lang', 'en-GB')

    expect(closestAttributeValue($element, 'lang')).toEqual('en-GB')
  })

  it('returns the value of the closest parent with the attribute if it exists', () => {
    const template = document.createElement('template')
    template.innerHTML = `
        <div lang="cy-GB"><!-- To check that we take the first value up -->
          <div lang="en-GB"><!-- The value we should get -->
            <div><!-- To check that we walk up the tree -->
              <div class="target"></div>
            </div>
          </div>
        </div>
      `

    const $element = template.content.querySelector('.target')
    expect(closestAttributeValue($element, 'lang')).toEqual('en-GB')
  })

  it('returns null if neither the element or a parent have the attribute', () => {
    const $parent = document.createElement('div')
    const $element = document.createElement('div')
    $parent.appendChild($element)

    expect(closestAttributeValue($element, 'lang')).toBeNull()
  })
})
