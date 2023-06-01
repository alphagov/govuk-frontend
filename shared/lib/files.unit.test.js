const { getComponentData } = require('./files.js')

describe('getComponentData', () => {
  it('rejects if unable to load component data', async () => {
    await expect(getComponentData('not-a-real-component'))
      .rejects
      .toThrow(/ENOENT: no such file or directory/)
  })

  it('outputs objects with an array of params and examples', async () => {
    const componentName = 'accordion'
    const componentData = await getComponentData(componentName)

    expect(componentData)
      .toEqual(expect.objectContaining({
        name: componentName,
        params: expect.arrayContaining([expect.any(Object)]),
        examples: expect.arrayContaining([expect.any(Object)])
      }))
  })

  it('outputs a param for each object with the expected attributes', async () => {
    const componentName = 'accordion'
    const { params } = await getComponentData(componentName)

    params.forEach((param) => expect(param).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        required: expect.any(Boolean),
        description: expect.any(String)
      })
    ))
  })

  it('contains example objects with the expected attributes', async () => {
    const componentName = 'accordion'
    const { examples } = await getComponentData(componentName)

    examples.forEach((example) => expect(example).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        data: expect.any(Object)
      })
    ))
  })
})
