import { normaliseDataset } from './normalise-dataset.mjs'

describe('normaliseDataset', () => {
  it('normalises the entire dataset', () => {
    expect(
      normaliseDataset(
        class Component {
          /**
           * @satisfies {Schema}
           */
          static schema = {
            properties: {
              aNumber: { type: 'number' },
              aDecimalNumber: { type: 'number' },
              aBoolean: { type: 'boolean' },
              aString: { type: 'string' },
              aStringBoolean: { type: 'string' },
              aStringNumber: { type: 'string' },
              anOptionalString: { type: 'string' },
              anObject: { type: 'object' }
            }
          }
        },
        {
          aNumber: '1000',
          aDecimalNumber: '100.50',
          aBoolean: 'true',
          aString: 'Hello!',
          aStringBoolean: 'false',
          aStringNumber: '2024',
          anOptionalString: '',
          'anObject.one': '111',
          'anObject.two': '222',
          'anObject.three': '333'
        }
      )
    ).toEqual({
      aNumber: 1000,
      aDecimalNumber: 100.5,
      aBoolean: true,
      aString: 'Hello!',
      aStringBoolean: 'false',
      aStringNumber: '2024',
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
