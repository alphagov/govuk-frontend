import { outdent } from 'outdent'

import {
  mergeConfigs,
  extractConfigByNamespace,
  isSupported,
  getFragmentFromUrl,
  getBreakpoint
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

    it('ignores a single object', () => {
      const config = mergeConfigs(config1)
      expect(config).toEqual({
        a: 'antelope',
        c: { a: 'camel' }
      })
    })

    it('merges two objects', () => {
      const config = mergeConfigs(config1, config2)
      expect(config).toEqual({
        a: 'aardvark',
        b: 'bee',
        c: { a: 'cat', o: 'cobra' }
      })
    })

    it('merges three objects', () => {
      const config = mergeConfigs(config1, config2, config3)
      expect(config).toEqual({
        a: 'aardvark',
        b: 'bat',
        c: { a: 'cat', o: 'cow' },
        d: 'dog',
        e: {
          l: {
            e: 'elephant'
          }
        }
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
        c: { a: 'camel', o: 'cow' },
        d: 'dog',
        e: {
          l: {
            e: 'elephant'
          }
        }
      })
    })

    it('prioritises the last parameter provided (different types)', () => {
      const config = mergeConfigs(config1, config2, config3, {
        c: 'jellyfish', // Replaces top-level object with string
        e: { l: 'shark' } // Replaces nested object with string
      })
      expect(config).toEqual({
        a: 'aardvark',
        b: 'bat',
        c: 'jellyfish',
        d: 'dog',
        e: {
          l: 'shark'
        }
      })
    })

    it('returns an empty object if no parameters are provided', () => {
      const config = mergeConfigs()
      expect(config).toEqual({})
    })
  })

  describe('extractConfigByNamespace', () => {
    class Component {
      /**
       * @satisfies {Schema}
       */
      static schema = {
        properties: {
          a: { type: 'string' },
          b: { type: 'object' },
          c: { type: 'object' },
          d: { type: 'string' },
          e: { type: 'string' },
          f: { type: 'object' }
        }
      }
    }

    /** @type {HTMLElement} */
    let $element

    beforeEach(() => {
      document.body.outerHTML = outdent`
        <div id="app-example"
          data-a="aardvark"
          data-b.a="bat"
          data-b.e="bear"
          data-b.o="boar"
          data-c.a="camel"
          data-c.o="cow"
          data-d="dog"
          data-e="element">
        </div>
      `

      $element = document.getElementById('app-example')
    })

    it('defaults to empty config for known namespaces only', () => {
      const { dataset } = $element

      const nonObject1 = extractConfigByNamespace(Component, dataset, 'a')
      const nonObject2 = extractConfigByNamespace(Component, dataset, 'd')
      const nonObject3 = extractConfigByNamespace(Component, dataset, 'e')

      const namespaceKnown = extractConfigByNamespace(Component, dataset, 'f')
      const namespaceUnknown = extractConfigByNamespace(
        Component,
        dataset,
        'unknown'
      )

      // With known namespace but non-object type, default to no config
      expect(nonObject1).toBeUndefined()
      expect(nonObject2).toBeUndefined()
      expect(nonObject3).toBeUndefined()

      // With known namespace, default to empty config
      expect(namespaceKnown).toEqual({})

      // With unknown namespace, default to no config
      expect(namespaceUnknown).toBeUndefined()
    })

    it('can extract config from key-value pairs', () => {
      const result = extractConfigByNamespace(Component, $element.dataset, 'b')
      expect(result).toEqual({ a: 'bat', e: 'bear', o: 'boar' })
    })

    it('can extract config from key-value pairs (with invalid namespace, first)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example2"
          data-i18n
          data-i18n.key1="One"
          data-i18n.key2="Two"
          data-i18n.key3="Three">
        </div>
      `

      const { dataset } = document.getElementById('app-example2')
      const result = extractConfigByNamespace(
        class Component {
          /**
           * @satisfies {Schema}
           */
          static schema = {
            properties: {
              i18n: { type: 'object' }
            }
          }
        },
        dataset,
        'i18n'
      )

      expect(result).toEqual({ key1: 'One', key2: 'Two', key3: 'Three' })
    })

    it('can extract config from key-value pairs (with invalid namespace, last)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example2"
          data-i18n.key1="One"
          data-i18n.key2="Two"
          data-i18n.key3="Three"
          data-i18n>
        </div>
      `

      const { dataset } = document.getElementById('app-example2')
      const result = extractConfigByNamespace(
        class Component {
          /**
           * @satisfies {Schema}
           */
          static schema = {
            properties: {
              i18n: { type: 'object' }
            }
          }
        },
        dataset,
        'i18n'
      )

      expect(result).toEqual({ key1: 'One', key2: 'Two', key3: 'Three' })
    })

    it('handles when both shallow and deep keys are set (namespace collision)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example"
          data-a="aardvark"
          data-b="bat"
          data-c="jellyfish"
          data-c.a="cat"
          data-c.o="cow"
          data-d="dog"
          data-e="element"
          data-f.e="elk"
          data-f.e.l="elephant">
        </div>
      `

      const { dataset } = document.getElementById('app-example')
      const result = extractConfigByNamespace(Component, dataset, 'c')

      expect(result).toEqual({ a: 'cat', o: 'cow' })
    })

    it('handles when both shallow and deep keys are set (namespace collision + key collision in namespace)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example"
          data-a="aardvark"
          data-b="bat"
          data-c.c="crow"
          data-c="jellyfish"
          data-c.a="cat"
          data-c.o="cow"
          data-d="dog"
          data-e="element"
          data-f.e="elk"
          data-f.e.l="elephant">
        </div>
      `

      const { dataset } = document.getElementById('app-example')
      const result = extractConfigByNamespace(Component, dataset, 'c')

      expect(result).toEqual({ a: 'cat', c: 'crow', o: 'cow' })
    })

    it('handles when both shallow and deep keys are set (namespace collision + key collision in namespace after shallow)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example"
          data-a="aardvark"
          data-b="bat"
          data-c="jellyfish"
          data-c.a="cat"
          data-c.c="crow"
          data-c.o="cow"
          data-d="dog"
          data-e="element"
          data-f.e="elk"
          data-f.e.l="elephant">
        </div>
      `

      const { dataset } = document.getElementById('app-example')
      const result = extractConfigByNamespace(Component, dataset, 'c')

      expect(result).toEqual({ a: 'cat', c: 'crow', o: 'cow' })
    })

    it('handles when both shallow and deep keys are set (deeper collision)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example"
          data-a="aardvark"
          data-b="bat"
          data-c="jellyfish"
          data-c.a="cat"
          data-c.o="cow"
          data-d="dog"
          data-f.e="elk"
          data-f.e.l="elephant">
        </div>
      `

      const { dataset } = document.getElementById('app-example')
      const result = extractConfigByNamespace(Component, dataset, 'f')

      expect(result).toEqual({ e: { l: 'elephant' } })
    })

    it('can handle multiple levels of nesting', () => {
      document.body.outerHTML = outdent`
        <div id="app-example2"
          data-i18n.key1="This, That"
          data-i18n.key2.one="The"
          data-i18n.key2.other="Other">
        </div>
      `

      const { dataset } = document.getElementById('app-example2')
      const result = extractConfigByNamespace(
        class Component {
          /**
           * @satisfies {Schema}
           */
          static schema = {
            properties: {
              i18n: { type: 'object' }
            }
          }
        },
        dataset,
        'i18n'
      )

      expect(result).toEqual({
        key1: 'This, That',
        key2: {
          one: 'The',
          other: 'Other'
        }
      })
    })

    it('can handle multiple levels of nesting (prioritises the last parameter provided)', () => {
      document.body.outerHTML = outdent`
        <div id="app-example2"
          data-i18n.key1.one="This"
          data-i18n.key1.other="That"
          data-i18n.key2.one="The"
          data-i18n.key2.other="Other"
          data-i18n.key1="This, That"
          data-i18n.key2="The Other">
        </div>
      `

      const { dataset } = document.getElementById('app-example2')
      const result = extractConfigByNamespace(
        class Component {
          /**
           * @satisfies {Schema}
           */
          static schema = {
            properties: {
              i18n: { type: 'object' }
            }
          }
        },
        dataset,
        'i18n'
      )

      expect(result).toEqual({
        key1: 'This, That',
        key2: 'The Other'
      })
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

  describe('getBreakpoint', () => {
    beforeAll(() => {
      // Reset the state of the DOM to cleanup after other tests
      document.documentElement.innerHTML = ''

      const stylesheet = document.createElement('style')
      stylesheet.innerHTML = outdent`
        :root {
          --govuk-frontend-breakpoint-mobile: 40em;
          --govuk-frontend-breakpoint-tablet: 80em;
        }

        body {
          --govuk-frontend-breakpoint-tablet: 90em;
        }
      `
      document.body.appendChild(stylesheet)
    })

    it('returns the breakpoint value if it exists', () => {
      expect(getBreakpoint('mobile')).toEqual({
        property: '--govuk-frontend-breakpoint-mobile',
        value: '40em'
      })
    })

    it('returns the value as set on the HTML (root) element', () => {
      expect(getBreakpoint('tablet')).toEqual({
        property: '--govuk-frontend-breakpoint-tablet',
        value: '80em'
      })
    })

    it('returns an undefined value if the breakpoint does not exist', () => {
      expect(getBreakpoint('giant-video-wall')).toEqual({
        property: '--govuk-frontend-breakpoint-giant-video-wall',
        value: undefined
      })
    })
  })
})

/**
 * @typedef {import('./index.mjs').Schema} Schema
 */
