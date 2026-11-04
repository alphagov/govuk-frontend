import { logErrors, name } from './task.mjs'

describe('logErrors', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('runs the task', async () => {
    const taskFn = jest.fn().mockResolvedValue(undefined)

    await logErrors(taskFn)()

    expect(taskFn).toHaveBeenCalledTimes(1)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('logs errors instead of rejecting', async () => {
    const error = new Error('Linting failed')
    const taskFn = jest.fn().mockRejectedValue(error)

    await expect(logErrors(taskFn)()).resolves.toBeUndefined()
    expect(console.error).toHaveBeenCalledWith(`${error}`)
  })

  it('keeps the display name of the task', () => {
    const taskFn = name('npm run lint:scss:cli', async () => {})

    expect(logErrors(taskFn)).toHaveProperty(
      'displayName',
      'npm run lint:scss:cli'
    )
  })
})
