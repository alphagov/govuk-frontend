import { normaliseDataset } from './normalise-dataset.mjs'

describe('normaliseDataset', () => {
  it('normalises the entire dataset', () => {
    expect(
      normaliseDataset(
        {
          aNumber: '1000',
          aDecimalNumber: '100.50',
          aBoolean: 'true',
          aString: 'Hello!',
          anOptionalString: ''
        },
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
              anOptionalString: { type: 'string' }
            }
          }
        }
      )
    ).toEqual({
      aNumber: 1000,
      aDecimalNumber: 100.5,
      aBoolean: true,
      aString: 'Hello!',
      anOptionalString: ''
    })
  })
})

/**
 * @typedef {import('./index.mjs').Schema} Schema
 */
