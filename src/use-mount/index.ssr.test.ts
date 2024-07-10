import { renderHookServer } from '@/test'
import { describe, expect, test, vi } from 'vitest'
import { useMount } from './index'

// @vitest-environment node
describe('useMount SSR', () => {
  test('should not call the callback function in SSR', () => {
    const callback = vi.fn()
    renderHookServer(() => useMount(callback))

    expect(callback).toHaveBeenCalledTimes(0)
  })
})
