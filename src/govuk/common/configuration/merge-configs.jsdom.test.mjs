import { mergeConfigs } from '../configuration.mjs'

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
