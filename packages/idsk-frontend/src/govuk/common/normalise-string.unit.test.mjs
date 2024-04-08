import { normaliseString } from './normalise-string.mjs'

describe('normaliseString', () => {
  it('normalises the string "true" to boolean true', () => {
    expect(normaliseString('true')).toBe(true)
  })

  it('normalises the string "false" to boolean false', () => {
    expect(normaliseString('false')).toBe(false)
  })

  it('normalises the string " true " to boolean true', () => {
    expect(normaliseString(' true ')).toBe(true)
  })

  it('normalises the string " false " to boolean false', () => {
    expect(normaliseString(' false ')).toBe(false)
  })

  it('does not normalise non-lowercase booleans', () => {
    expect(normaliseString('TRUE')).toBe('TRUE')
    expect(normaliseString('True')).toBe('True')
    expect(normaliseString('FALSE')).toBe('FALSE')
    expect(normaliseString('False')).toBe('False')
  })

  it('does not normalise strings that contain booleans', () => {
    expect(normaliseString('true!')).toBe('true!')
  })

  it('normalises the string "0" to the number 0', () => {
    expect(normaliseString('0')).toBe(0)
  })

  it('normalises strings representing positive numbers to numbers', () => {
    expect(normaliseString('1337')).toBe(1337)
  })

  it('normalises strings representing negative numbers to numbers', () => {
    expect(normaliseString('-1337')).toBe(-1337)
  })

  it('converts strings representing decimal numbers to numbers', () => {
    expect(normaliseString('0.5')).toBe(0.5)
  })

  it('normalises strings representing decimal numbers with extra precision to numbers', () => {
    expect(normaliseString('100.500')).toBe(100.5)
  })

  it('normalises strings representing decimal numbers with no integer-part to numbers', () => {
    expect(normaliseString('.5')).toBe(0.5)
  })

  it('normalises strings representing numbers with whitespace to numbers', () => {
    expect(normaliseString('   1337   ')).toBe(1337)
  })

  it('does not normalise the string "NaN"', () => {
    expect(normaliseString('NaN')).toBe('NaN')
  })

  it('does not normalise the string "Infinity"', () => {
    expect(normaliseString('Infinity')).toBe('Infinity')
  })

  it('normalises strings that represent very big positive numbers to numbers', () => {
    const biggestNumber = Number.MAX_SAFE_INTEGER + 1
    expect(normaliseString(`${biggestNumber}`)).toEqual(biggestNumber)
  })

  it('does not normalise strings that contain numbers', () => {
    expect(normaliseString('100%')).toBe('100%')
  })

  it('does not normalise empty strings', () => {
    expect(normaliseString('')).toBe('')
  })

  it('does not normalise whitespace only strings', () => {
    expect(normaliseString('   ')).toBe('   ')
  })
})
