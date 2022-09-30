const path = require('path')
const fileHelper = require('../lib/file-helper')

describe('getComponentData', () => {
  it('returns an error if unable to load component data', () => {
    expect(() => { fileHelper.getComponentData('not-a-real-component') }).toThrow(Error)
  })

  it('looks up the correct component path', () => {
    jest.spyOn(path, 'join')

    fileHelper.getComponentData('accordion')

    expect(path.join).toHaveBeenCalledWith('src/govuk/components/', 'accordion', 'accordion.yaml')
  })

  it('outputs objects with an array of params and examples', () => {
    const componentData = fileHelper.getComponentData('accordion')

    expect(componentData).toEqual(expect.objectContaining({
      params: expect.any(Array),
      examples: expect.any(Array)
    }))
  })

  it('outputs a param for each object with the expected attributes', () => {
    const componentData = fileHelper.getComponentData('accordion')

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

  it('contains example objects with the expected attributes', () => {
    const componentData = fileHelper.getComponentData('accordion')

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

describe('fullPageExamples', () => {
  it('contains name and path of each example, at a minimum', () => {
    const fullPageExamples = fileHelper.fullPageExamples()

    fullPageExamples.forEach((example) => {
      expect(example).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          path: expect.any(String)
        })
      )
    })
  })
})
