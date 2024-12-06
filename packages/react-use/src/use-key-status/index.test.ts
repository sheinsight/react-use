import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useKeyStatus } from './index'

describe('useKeyStatus', () => {
  let key: string
  let handler: Mock

  beforeEach(() => {
    key = 'a'
    handler = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should defined', () => {
    expect(useKeyStatus).toBeDefined()
  })

  it('should return false when key is not pressed', () => {
    const { result } = renderHook(() => useKeyStatus(key, handler))
    expect(result.current).toBe(false)
  })

  it('should return true when key is pressed', () => {
    const { result } = renderHook(() => useKeyStatus(key, handler))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })

    expect(result.current).toBe(true)
    expect(handler).toHaveBeenCalled()
  })

  it('should return false when key is released', () => {
    const { result } = renderHook(() => useKeyStatus(key, handler))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })

    expect(result.current).toBe(true)
    expect(handler).toHaveBeenCalledTimes(1)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }))
    })

    expect(result.current).toBe(false)
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple key presses', () => {
    const { result } = renderHook(() => useKeyStatus(key, handler))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })

    expect(result.current).toBe(true)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }))
    })

    expect(result.current).toBe(false)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })

    expect(result.current).toBe(true)
  })

  it('should call handler on key down', () => {
    renderHook(() => useKeyStatus(key, handler))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })

    expect(handler).toHaveBeenCalled()
  })

  it('should call handler on key up', () => {
    renderHook(() => useKeyStatus(key, handler))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
    })
    expect(handler).toHaveBeenCalledTimes(1)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key }))
    })
    expect(handler).toHaveBeenCalledTimes(2)
  })
})
