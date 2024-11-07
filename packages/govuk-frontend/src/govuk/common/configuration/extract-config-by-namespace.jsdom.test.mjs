import { outdent } from 'outdent'

import { extractConfigByNamespace } from '../configuration.mjs'

describe('extractConfigByNamespace', () => {
  /**
   * @satisfies {Schema}
   */
  const schema = {
    properties: {
      a: { type: 'string' },
      b: { type: 'object' },
      c: { type: 'object' },
      d: { type: 'string' },
      e: { type: 'string' },
      f: { type: 'object' }
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

    const nonObject1 = extractConfigByNamespace(schema, dataset, 'a')
    const nonObject2 = extractConfigByNamespace(schema, dataset, 'd')
    const nonObject3 = extractConfigByNamespace(schema, dataset, 'e')

    const namespaceKnown = extractConfigByNamespace(schema, dataset, 'f')
    const namespaceUnknown = extractConfigByNamespace(
      schema,
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
    const result = extractConfigByNamespace(schema, $element.dataset, 'b')
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
      {
        properties: {
          i18n: { type: 'object' }
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
      {
        properties: {
          i18n: { type: 'object' }
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
    const result = extractConfigByNamespace(schema, dataset, 'c')

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
    const result = extractConfigByNamespace(schema, dataset, 'c')

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
    const result = extractConfigByNamespace(schema, dataset, 'c')

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
    const result = extractConfigByNamespace(schema, dataset, 'f')

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
      {
        properties: {
          i18n: { type: 'object' }
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
      {
        properties: {
          i18n: { type: 'object' }
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

/**
 * @typedef {import('../configuration.mjs').Schema} Schema
 */
