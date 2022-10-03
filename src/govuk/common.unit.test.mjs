/**
 * @jest-environment jsdom
 */

import { createElement, createFragmentFromHTML } from '../../lib/dom-helpers.mjs'
import { mergeConfigs, extractConfigByNamespace, normaliseString, normaliseDataset, closestAttributeValue } from './common.mjs'

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
      d: 'dog'
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
        d: 'dog'
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
        d: 'dog'
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

  describe('normaliseString', () => {
    it('does not normalise non-strings', () => {
      expect(normaliseString(100)).toEqual(100)
      expect(normaliseString(false)).toEqual(false)
      expect(normaliseString({})).toEqual({})
      expect(normaliseString(NaN)).toEqual(NaN)
    })

    it('normalises the string "true" to boolean true', () => {
      expect(normaliseString('true')).toEqual(true)
    })

    it('normalises the string "false" to boolean false', () => {
      expect(normaliseString('false')).toEqual(false)
    })

    it('normalises the string " true " to boolean true', () => {
      expect(normaliseString(' true ')).toEqual(true)
    })

    it('normalises the string " false " to boolean false', () => {
      expect(normaliseString(' false ')).toEqual(false)
    })

    it('does not normalise non-lowercase booleans', () => {
      expect(normaliseString('TRUE')).toEqual('TRUE')
      expect(normaliseString('True')).toEqual('True')
      expect(normaliseString('FALSE')).toEqual('FALSE')
      expect(normaliseString('False')).toEqual('False')
    })

    it('does not normalise strings that contain booleans', () => {
      expect(normaliseString('true!')).toEqual('true!')
    })

    it('normalises the string "0" to the number 0', () => {
      expect(normaliseString('0')).toEqual(0)
    })

    it('normalises strings representing positive numbers to numbers', () => {
      expect(normaliseString('1337')).toEqual(1337)
    })

    it('normalises strings representing negative numbers to numbers', () => {
      expect(normaliseString('-1337')).toEqual(-1337)
    })

    it('converts strings representing decimal numbers to numbers', () => {
      expect(normaliseString('0.5')).toEqual(0.5)
    })

    it('normalises strings representing decimal numbers with extra precision to numbers', () => {
      expect(normaliseString('100.500')).toEqual(100.5)
    })

    it('normalises strings representing decimal numbers with no integer-part to numbers', () => {
      expect(normaliseString('.5')).toEqual(0.5)
    })

    it('normalises strings representing numbers with whitespace to numbers', () => {
      expect(normaliseString('   1337   ')).toEqual(1337)
    })

    it('does not normalise the string "NaN"', () => {
      expect(normaliseString('NaN')).toEqual('NaN')
    })

    it('does not normalise the string "Infinity"', () => {
      expect(normaliseString('Infinity')).toEqual('Infinity')
    })

    it('normalises strings that represent very big positive numbers to numbers', () => {
      const biggestNumber = Number.MAX_SAFE_INTEGER + 1
      expect(normaliseString(biggestNumber.toString())).toEqual(biggestNumber)
    })

    it('does not normalise strings that contain numbers', () => {
      expect(normaliseString('100%')).toEqual('100%')
    })

    it('does not normalise empty strings', () => {
      expect(normaliseString('')).toEqual('')
    })

    it('does not normalise whitespace only strings', () => {
      expect(normaliseString('   ')).toEqual('   ')
    })
  })

  describe('normaliseDataset', () => {
    it('normalises the entire dataset', () => {
      expect(normaliseDataset({
        aNumber: '1000',
        aDecimalNumber: '100.50',
        aBoolean: 'true',
        aString: 'Hello!',
        anOptionalString: ''
      })).toEqual({
        aNumber: 1000,
        aDecimalNumber: 100.5,
        aBoolean: true,
        aString: 'Hello!',
        anOptionalString: ''
      })
    })
  })

  describe('closestAttributeValue', () => {
    it('returns the value of the attribute if on the element', () => {
      const $element = createElement('div', { lang: 'en-GB' })

      expect(closestAttributeValue($element, 'lang')).toEqual('en-GB')
    })

    it('returns the value of the closest parent with the attribute if it exists', () => {
      const dom = createFragmentFromHTML(`
        <div lang="cy-GB"><!-- To check that we take the first value up -->
          <div lang="en-GB"><!-- The value we should get -->
            <div><!-- To check that we walk up the tree -->
              <div class="target"></div>
            </div>
          </div>
        </div>
      `)
      const $element = dom.querySelector('.target')

      expect(closestAttributeValue($element, 'lang')).toEqual('en-GB')
    })

    it('returns undefined if neither the element or a parent have the attribute', () => {
      const $parent = createElement('div')
      const $element = createElement('div')
      $parent.appendChild($element)

      expect(closestAttributeValue($element, 'lang')).toBeUndefined()
    })
  })
})
