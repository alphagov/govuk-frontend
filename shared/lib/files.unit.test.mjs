import { slash } from './files.js'

describe('slash', () => {
  test('convert backwards-slash paths to forward slash paths', () => {
    expect(slash('c:/aaaa\\bbbb')).toBe('c:/aaaa/bbbb')
    expect(slash('c:\\aaaa\\bbbb')).toBe('c:/aaaa/bbbb')
    expect(slash('c:\\aaaa\\bbbb\\★')).toBe('c:/aaaa/bbbb/★')
  })
})
