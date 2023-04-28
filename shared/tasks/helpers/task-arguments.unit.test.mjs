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
    describe('Flag: isDev', () => {
      let argv

      beforeEach(() => {
        argv = args[key]
      })

      it('is flagged false', async () => {
        process.argv = [...argv]

        const { isDev } = await import('./task-arguments.mjs')
        expect(isDev).toBe(false)
      })

      it("is flagged false for 'gulp build:app'", async () => {
        process.argv = [...argv, 'build:app']

        const { isDev } = await import('./task-arguments.mjs')
        expect(isDev).toBe(false)
      })

      it("is flagged false for 'gulp build:package'", async () => {
        process.argv = [...argv, 'build:package']

        const { isDev } = await import('./task-arguments.mjs')
        expect(isDev).toBe(false)
      })

      it("is flagged false for 'gulp build:release'", async () => {
        process.argv = [...argv, 'build:release']

        const { isDev } = await import('./task-arguments.mjs')
        expect(isDev).toBe(false)
      })

      it("is flagged true for 'gulp dev'", async () => {
        process.argv = [...argv, 'dev']

        const { isDev } = await import('./task-arguments.mjs')
        expect(isDev).toBe(true)
      })
    })
  })
})
