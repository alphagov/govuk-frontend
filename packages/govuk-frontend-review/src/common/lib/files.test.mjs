import { getFullPageExamples } from './files.mjs'

describe('getFullPageExamples', () => {
  it('contains name of each example', async () => {
    const examples = await getFullPageExamples()

    examples.forEach((example) => expect(example).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        path: expect.any(String)
      })
    ))
  })

  it('contains scenario front matter, for some examples', async () => {
    const examples = await getFullPageExamples()

    // At least 1x example with { name, path, scenario }
    expect(examples).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: expect.any(String),
        path: expect.any(String),
        scenario: expect.any(String)
      })
    ]))
  })

  it('contains notes front matter, for some examples', async () => {
    const examples = await getFullPageExamples()

    // At least 1x example with { name, path, notes }
    expect(examples).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: expect.any(String),
        path: expect.any(String),
        notes: expect.any(String)
      })
    ]))
  })
})
