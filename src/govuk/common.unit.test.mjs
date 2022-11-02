import { mergeConfigs, extractConfigByNamespace, closestAttributeValue } from './common.mjs'

// TODO: Write unit tests for `nodeListForEach` and `generateUniqueID`

describe('Common JS utilities', () => {
  describe('mergeConfigs', () => {
    const config1 = {
      a: 'antelope',
      c: { a: 'camel' }
    }
    const config2 = {
      a: 'aardvark',
      b: 'bee',
      c: { a: 'cat', o: 'cobra' }
    }
    const config3 = {
      b: 'bat',
      c: { o: 'cow' },
      d: 'dog',
      e: {
        l: {
          e: 'elephant'
        }
      }
    }

    it('flattens a single object', () => {
      const config = mergeConfigs(config1)
      expect(config).toEqual({
        a: 'antelope',
        'c.a': 'camel'
      })
    })

    it('flattens and merges two objects', () => {
      const config = mergeConfigs(config1, config2)
      expect(config).toEqual({
        a: 'aardvark',
        b: 'bee',
        'c.a': 'cat',
        'c.o': 'cobra'
      })
    })

    it('flattens and merges three objects', () => {
      const config = mergeConfigs(config1, config2, config3)
      expect(config).toEqual({
        a: 'aardvark',
        b: 'bat',
        'c.a': 'cat',
        'c.o': 'cow',
        d: 'dog',
        'e.l.e': 'elephant'
      })
    })

    it('ignores empty objects when merging', () => {
      const test1 = mergeConfigs({}, config1)
      const test2 = mergeConfigs(config1, {}, config2)
      const test3 = mergeConfigs(config3, {})

      expect(test1).toEqual(mergeConfigs(config1))
      expect(test2).toEqual(mergeConfigs(config1, config2))
      expect(test3).toEqual(mergeConfigs(config3))
    })

    it('prioritises the last parameter provided', () => {
      const config = mergeConfigs(config1, config2, config3, config1)
      expect(config).toEqual({
        a: 'antelope',
        b: 'bat',
        'c.a': 'camel',
        'c.o': 'cow',
        d: 'dog',
        'e.l.e': 'elephant'
      })
    })

    it('returns an empty object if no parameters are provided', () => {
      const config = mergeConfigs()
      expect(config).toEqual({})
    })
  })

  describe('extractConfigByNamespace', () => {
    const flattenedConfig = {
      a: 'aardvark',
      'b.a': 'bat',
      'b.e': 'bear',
      'b.o': 'boar',
      'c.a': 'camel',
      'c.o': 'cow',
      d: 'dog',
      e: 'elephant'
    }

    it('can extract single key-value pairs', () => {
      const result = extractConfigByNamespace(flattenedConfig, 'a')
      expect(result).toEqual({ a: 'aardvark' })
    })

    it('can extract multiple key-value pairs', () => {
      const result = extractConfigByNamespace(flattenedConfig, 'b')
      expect(result).toEqual({ a: 'bat', e: 'bear', o: 'boar' })
    })

    it('throws an error if no `configObject` is provided', () => {
      expect(() => extractConfigByNamespace()).toThrow()
    })

    it('throws an error if no `namespace` is provided', () => {
      expect(() => extractConfigByNamespace(flattenedConfig)).toThrow()
    })
  })

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
      const dom = template.content.cloneNode(true)
      const $element = dom.querySelector('.target')

      expect(closestAttributeValue($element, 'lang')).toEqual('en-GB')
    })

    it('returns undefined if neither the element or a parent have the attribute', () => {
      const $parent = document.createElement('div')
      const $element = document.createElement('div')
      $parent.appendChild($element)

      expect(closestAttributeValue($element, 'lang')).toBeUndefined()
    })
  })
})
