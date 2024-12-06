import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useUnmountedRef } from './index'

describe('useUnmountedRef', () => {
  let hook: any

  beforeEach(() => {
    hook = renderHook(() => useUnmountedRef())
  })

  afterEach(() => {
    hook.unmount()
  })

  it('should initially be false', () => {
    const { result } = hook
    expect(result.current.current).toBe(false)
  })

  it('should be false after mount', () => {
    const { result } = hook
    expect(result.current.current).toBe(false)
  })

  it('should be true after unmount', () => {
    const { result } = hook
    hook.unmount()
    expect(result.current.current).toBe(true)
  })

  it('should remain true after unmounting multiple times', () => {
    const { result } = hook
    hook.unmount()
    expect(result.current.current).toBe(true)
    hook.unmount() // Unmount again
    expect(result.current.current).toBe(true)
  })
})
