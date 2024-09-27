import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSupported } from './index'

describe('useSupported', () => {
  let callback: Mock

  beforeEach(() => {
    callback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return false initially', () => {
    const { result } = renderHook(() => useSupported(callback))
    expect(result.current).toBe(false)
  })

  it('should return true when callback returns true', () => {
    callback.mockReturnValue(true)
    const { result } = renderHook(() => useSupported(callback))
    expect(result.current).toBe(true)
  })

  it('should return false when callback returns false', () => {
    callback.mockReturnValue(false)

    const { result, rerender } = renderHook(() => useSupported(callback))

    act(() => {
      rerender()
    })

    expect(result.current).toBe(false)
  })

  it('should update value when dependencies change', async () => {
    callback.mockReturnValue(false)

    const { result, rerender } = renderHook(({ deps }) => useSupported(callback, deps), {
      initialProps: { deps: [0] as number[] },
    })

    expect(result.current).toBe(false)

    await act(async () => {
      callback.mockResolvedValue(true)
      rerender({ deps: [1] })
    })

    callback.mockReturnValue(true)

    await act(async () => {
      rerender({ deps: [2] })
    })

    expect(result.current).toBe(true)

    callback.mockReturnValue(false)

    act(() => {
      rerender({ deps: [3] })
    })

    expect(result.current).toBe(false)
  })

  it('should not update if dependencies do not change', () => {
    callback.mockReturnValue(true)

    const { result, rerender } = renderHook(({ deps }) => useSupported(callback, deps), {
      initialProps: { deps: [1] },
    })

    callback.mockReturnValue(true)

    act(() => {
      callback.mockReturnValue(false)
      rerender({ deps: [1] })
    })

    expect(result.current).toBe(true)
  })
})
