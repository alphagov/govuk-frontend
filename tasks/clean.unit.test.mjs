import { paths } from './clean.mjs'

describe('Clean task', () => {
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
  )('cleans destination "$destination"', async ({ destination, paths: pathsExpected }) => {
    expect(paths(destination)).toEqual(pathsExpected)
  })
})
