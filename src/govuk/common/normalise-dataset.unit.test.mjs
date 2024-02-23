import { normaliseDataset } from './normalise-dataset.mjs'

describe('normaliseDataset', () => {
  it('normalises the entire dataset', () => {
    expect(
      normaliseDataset({
        aNumber: '1000',
        aDecimalNumber: '100.50',
        aBoolean: 'true',
        aString: 'Hello!',
        anOptionalString: ''
      })
    ).toEqual({
      aNumber: 1000,
      aDecimalNumber: 100.5,
      aBoolean: true,
      aString: 'Hello!',
      anOptionalString: ''
    })
  })
})
