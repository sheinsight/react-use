import { describe, expect, it, vi } from 'vitest'
import { ensureSSRSecurity, isClient } from './basic'

// @vitest-environment node
describe('ensureSSRSecurity', () => {
  it('should return the fallback value on the server', () => {
    const fn = vi.fn(() => 'client')
    const result = ensureSSRSecurity(fn, 'server')
    expect(result).toBe('server')
  })

  it('should `isClient` return false', () => {
    expect(isClient).toBe(false)
  })
})
