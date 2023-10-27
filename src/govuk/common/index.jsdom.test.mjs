import {
  mergeConfigs,
  extractConfigByNamespace,
  isSupported,
  getFragmentFromUrl
} from './index.mjs'

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
  })

  describe('isSupported', () => {
    beforeEach(() => {
      // Jest does not tidy the JSDOM document between tests
      // so we need to take care of that ourselves
      document.documentElement.innerHTML = ''
    })

    it('returns true if the govuk-frontend-supported class is set', () => {
      document.body.classList.add('govuk-frontend-supported')

      expect(isSupported(document.body)).toBe(true)
    })

    it('returns false if the govuk-frontend-supported class is not set', () => {
      expect(isSupported(document.body)).toBe(false)
    })

    it('returns false when `document.body` is not set', () => {
      // For example, running `initAll()` in `<head>` without `type="module"`
      // will see support checks run when document.body is still `null`
      expect(isSupported(null)).toBe(false)
    })
  })

  describe('getFragmentFromUrl', () => {
    it.each([
      {
        url: 'https://www.gov.uk/#content',
        fragment: 'content'
      },
      {
        url: 'https://www.gov.uk/example/#content',
        fragment: 'content'
      },
      {
        url: 'https://www.gov.uk/example/?keywords=123#content',
        fragment: 'content'
      },
      {
        url: '/#content',
        fragment: 'content'
      },
      {
        url: '/example/#content',
        fragment: 'content'
      },
      {
        url: '/?keywords=123#content',
        fragment: 'content'
      },
      {
        url: '#content',
        fragment: 'content'
      },
      {
        url: '/',
        fragment: undefined
      },
      {
        url: '',
        fragment: undefined
      }
    ])("returns '$fragment' for '$url'", ({ url, fragment }) => {
      expect(getFragmentFromUrl(url)).toBe(fragment)
    })
  })
})
