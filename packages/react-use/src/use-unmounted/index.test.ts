import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useUnmounted } from './index'

describe('useUnmounted', () => {
  it('should return false when the component is mounted', () => {
    const { result } = renderHook(() => useUnmounted())
    expect(result.current()).toBe(false)
  })

  it('should return true after the component is unmounted', () => {
    const { unmount, result } = renderHook(() => useUnmounted())
    unmount()
    expect(result.current()).toBe(true)
  })

  it('should maintain unmounted state across multiple unmounts', () => {
    const { unmount, result } = renderHook(() => useUnmounted())
    unmount()
    expect(result.current()).toBe(true)
    unmount()
    expect(result.current()).toBe(true)
  })
})
