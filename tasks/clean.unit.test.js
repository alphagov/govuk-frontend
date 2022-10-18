describe('Clean task', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it.each(
    [
      {
        destination: 'public',
        paths: ['public/**/*']
      },
      {
        destination: 'package',
        paths: [
          'package/**/*',
          '!package/',
          '!package/package.json',
          '!package/govuk-prototype-kit.config.json',
          '!package/README.md'
        ]
      },
      {
        destination: 'dist',
        paths: ['dist/**/*']
      },
      {
        destination: 'custom/location/here',
        paths: ['custom/location/here/**/*']
      }
    ]
  )('cleans destination "$destination"', async ({ destination: mockDestination, paths }) => {
    jest.mock('./task-arguments.js', () => ({ destination: mockDestination }))
    const clean = await import('./clean.js')
    expect(clean.paths()).toEqual(paths)
  })
})
