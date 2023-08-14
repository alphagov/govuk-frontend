const { getComponentFixtures } = require('./components.js')

describe('getComponentFixtures', () => {
  it('rejects if unable to load component fixtures', async () => {
    await expect(getComponentFixtures('not-a-real-component')).rejects.toThrow(
      /Cannot find module/
    )
  })

  it('outputs object with an array of fixtures', async () => {
    const componentName = 'accordion'
    const componentFixtures = await getComponentFixtures(componentName)

    expect(componentFixtures).toEqual(
      expect.objectContaining({
        component: componentName,
        fixtures: expect.arrayContaining([expect.any(Object)])
      })
    )
  })

  it('contains fixture objects with the expected attributes', async () => {
    const componentName = 'accordion'
    const { fixtures } = await getComponentFixtures(componentName)

    fixtures.forEach((fixture) =>
      expect(fixture).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          options: expect.any(Object),
          hidden: expect.any(Boolean),
          html: expect.any(String)
        })
      )
    )
  })
})
