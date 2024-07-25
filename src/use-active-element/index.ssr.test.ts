import { renderHookServer } from '@/test'
import { describe, expect, it } from 'vitest'
import { useActiveElement } from './index'

// @vitest-environment node
describe('useActiveElement SSR', () => {
  it('should return null when in SSR', () => {
    const { result } = renderHookServer(() => useActiveElement())
    expect(result.current).toBeNull()
  })
})
