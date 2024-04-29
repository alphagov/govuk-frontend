import pkg from './package.json'

describe('package.json', () => {
  // The `sideEffects` field allows us to tell bundlers like Webpack or Rollup
  // that they can safely delete code that's not being imported because our
  // package has no code that executes when files are imported and modify the
  // global environment, (JavaScript built-ins or the DOM). Everything is
  // wrapped inside function or classes.
  it('announces that our package has no side effects', () => {
    expect(pkg.sideEffects).toBe(false)
  })
})
