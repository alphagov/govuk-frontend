import { normaliseDataset, normaliseString } from './normalise-dataset.mjs'

describe('normaliseString', () => {
  it('does not normalise non-strings', () => {
    // @ts-expect-error Parameter 'value' not a string
    expect(normaliseString(100)).toEqual(100)
    // @ts-expect-error Parameter 'value' not a string
    expect(normaliseString(false)).toEqual(false)
    // @ts-expect-error Parameter 'value' not a string
    expect(normaliseString({})).toEqual({})
    // @ts-expect-error Parameter 'value' not a string
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
    expect(normaliseString(`${biggestNumber}`)).toEqual(biggestNumber)
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
