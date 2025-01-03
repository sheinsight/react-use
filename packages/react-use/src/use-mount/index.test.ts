import { renderHook } from '@/test'
import { StrictMode } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { useMount } from './index'

describe('useMount', () => {
  test('should call the callback function when the component mounts', () => {
    const callback = vi.fn()
    renderHook(() => useMount(callback))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should handle `strictOnce`', () => {
    const callback = vi.fn()
    renderHook(() => useMount(callback, true), { wrapper: StrictMode })
    expect(callback).toHaveBeenCalledTimes(1)

    callback.mockReset()
    renderHook(() => useMount(callback, false), { wrapper: StrictMode })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('should call the callback function only once when strictOnce is true', () => {
    const callback = vi.fn()
    renderHook(() => useMount(callback, true))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should not call the callback function when it is not provided', () => {
    const callback = vi.fn()
    renderHook(() => useMount())

    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback function when strictOnce is true and the component re-renders', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(() => useMount(callback, true))

    rerender()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
