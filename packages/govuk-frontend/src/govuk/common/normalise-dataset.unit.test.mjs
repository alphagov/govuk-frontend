import { normaliseDataset } from './normalise-dataset.mjs'

describe('normaliseDataset', () => {
  it('normalises the entire dataset', () => {
    const schema = /** @type {Schema} */ ({
      properties: {
        aNumber: { type: 'number' },
        aDecimalNumber: { type: 'number' },
        aBoolean: { type: 'boolean' },
        aString: { type: 'string' },
        anOptionalString: { type: 'string' },
        anObject: { type: 'object' }
      }
    })

    expect(
      normaliseDataset(
        {
          aNumber: '1000',
          aDecimalNumber: '100.50',
          aBoolean: 'true',
          aString: 'Hello!',
          anOptionalString: '',
          'anObject.one': '111',
          'anObject.two': '222',
          'anObject.three': '333'
        },
        schema
      )
    ).toEqual({
      aNumber: 1000,
      aDecimalNumber: 100.5,
      aBoolean: true,
      aString: 'Hello!',
      anOptionalString: '',
      anObject: {
        one: 111,
        two: 222,
        three: 333
      }
    })
  })
})

/**
 * @typedef {import('./index.mjs').Schema} Schema
 */
