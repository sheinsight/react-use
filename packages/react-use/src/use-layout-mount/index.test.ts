import { renderHook } from '@/test'
import { describe, expect, test, vi } from 'vitest'
import { useLayoutMount } from './index'

describe('useLayoutMount', () => {
  test('should call the callback function when the component mounts', () => {
    const callback = vi.fn()
    renderHook(() => useLayoutMount(callback))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should call the callback function only once when strictOnce is true', () => {
    const callback = vi.fn()
    renderHook(() => useLayoutMount(callback, true))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should not call the callback function when it is not provided', () => {
    const callback = vi.fn()
    renderHook(() => useLayoutMount())

    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback function when strictOnce is true and the component re-renders', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(() => useLayoutMount(callback, true))

    rerender()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
