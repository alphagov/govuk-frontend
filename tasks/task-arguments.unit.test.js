describe('Task arguments', () => {
  let args

  beforeEach(() => {
    jest.resetModules()

    args = {
      posix: ['/usr/bin/node', '/path/to/project/node_modules/.bin/gulp'],
      windows: ['node.exe', 'C:\\path\\to\\project\\node_modules\\.bin\\gulp.cmd']
    }
  })

  describe.each(
    [
      { key: 'posix', description: 'Linux, macOS etc' },
      { key: 'windows', description: 'Windows only' }
    ]
  )('Platform: $description', ({ key }) => {
    describe('Build destination', () => {
      let argv

      beforeEach(() => {
        argv = args[key]
      })

      describe('Defaults', () => {
        it('defaults to ./public', async () => {
          process.argv = [...argv]

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual('public')
        })

        it('defaults to ./public for "gulp build:compile"', async () => {
          process.argv = [...argv, 'build:compile']

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual('public')
        })

        it('defaults to ./package for "gulp build:package"', async () => {
          process.argv = [...argv, 'build:package']

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual('package')
        })

        it('defaults to ./dist for "gulp build:dist"', async () => {
          process.argv = [...argv, 'build:dist']

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual('dist')
        })
      })

      describe.each(
        [
        // Override to public
          { flag: 'public', destination: 'public' },
          { flag: './public', destination: 'public' },

          // Override to package
          { flag: 'package', destination: 'package' },
          { flag: './package', destination: 'package' },

          // Override to dist
          { flag: 'dist', destination: 'dist' },
          { flag: './dist', destination: 'dist' },

          // Override to custom
          { flag: 'custom/location/here', destination: 'custom/location/here' },
          { flag: 'custom\\location\\here', destination: 'custom/location/here' },
          { flag: './custom/location/here', destination: 'custom/location/here' }
        ]
      )('Override --destination "$flag"', ({ flag, destination: expected }) => {
        it('uses flag by default', async () => {
          process.argv = [...argv, '--destination', flag]

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual(expected)
        })

        it('uses flag for "gulp build:compile"', async () => {
          process.argv = [...argv, 'build:compile', '--destination', flag]

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual(expected)
        })

        it('uses flag for "gulp build:package"', async () => {
          process.argv = [...argv, 'build:package', '--destination', flag]

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual(expected)
        })

        it('uses flag for "gulp build:dist"', async () => {
          process.argv = [...argv, 'build:dist', '--destination', flag]

          const { destination } = await import('./task-arguments.js')
          expect(destination).toEqual(expected)
        })
      })
    })
  })
})
