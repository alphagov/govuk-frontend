const path = require('path')
const fileHelper = require('../lib/file-helper')

describe('getComponentData', () => {
  it('rejects if unable to load component data', async () => {
    await expect(fileHelper.getComponentData('not-a-real-component'))
      .rejects
      .toThrow('Error: ENOENT: no such file or directory')
  })

  it('looks up the correct component path', async () => {
    jest.spyOn(path, 'join')

    await fileHelper.getComponentData('accordion')

    expect(path.join).toHaveBeenCalledWith('src/govuk/components/', 'accordion', 'accordion.yaml')
  })

  it('outputs objects with an array of params and examples', async () => {
    const componentData = await fileHelper.getComponentData('accordion')

    expect(componentData).toEqual(expect.objectContaining({
      params: expect.any(Array),
      examples: expect.any(Array)
    }))
  })

  it('outputs a param for each object with the expected attributes', async () => {
    const componentData = await fileHelper.getComponentData('accordion')

    componentData.params.forEach((param) => {
      expect(param).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          required: expect.any(Boolean),
          description: expect.any(String)
        })
      )
    })
  })

  it('contains example objects with the expected attributes', async () => {
    const componentData = await fileHelper.getComponentData('accordion')

    componentData.examples.forEach((example) => {
      expect(example).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          data: expect.any(Object)
        })
      )
    })
  })
})

describe('getFullPageExamples', () => {
  it('contains name of each example', async () => {
    const examples = await fileHelper.getFullPageExamples()

    examples.forEach((example) => expect(example).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        path: expect.any(String)
      })
    ))
  })

  it('contains scenario front matter, for some examples', async () => {
    const examples = await fileHelper.getFullPageExamples()

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
    const examples = await fileHelper.getFullPageExamples()

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
