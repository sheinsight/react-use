import { act, renderHook } from '@/test'
import { useState } from 'react'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThrottledEffect } from './index'

describe('useThrottledEffect', () => {
  let callback: Mock

  beforeEach(() => {
    vi.useFakeTimers()
    callback = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call effect when first render', () => {
    renderHook(() => useThrottledEffect(callback, []))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should call effect when deps change', async () => {
    // biome-ignore lint/correctness/useExhaustiveDependencies: for test
    const { rerender } = renderHook(({ count }) => useThrottledEffect(callback, [count]), {
      initialProps: { count: 1 },
    })

    expect(callback).toHaveBeenCalledTimes(1)

    rerender({ count: 2 })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(1_000)
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should throttle effect', async () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      // biome-ignore lint/correctness/useExhaustiveDependencies: for test
      useThrottledEffect(callback, [count], { wait: 1_000 })
      return { count, setCount }
    })

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.setCount((c) => c + 1)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
      result.current.setCount((c) => c + 1)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should call effect immediate when leading is true', async () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      // biome-ignore lint/correctness/useExhaustiveDependencies: for test
      useThrottledEffect(callback, [count], { wait: 1_000, leading: true, trailing: false })
      return { count, setCount }
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })

    await act(async () => {
      result.current.setCount((c) => c + 1)
    })

    expect(callback).toHaveBeenCalledTimes(2)

    await act(async () => {
      result.current.setCount((c) => c + 1)
    })

    expect(callback).toHaveBeenCalledTimes(2)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })

    expect(callback).toHaveBeenCalledTimes(2)

    await act(async () => {
      result.current.setCount((c) => c + 1)
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('should call effect after trailing', async () => {
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)
      // biome-ignore lint/correctness/useExhaustiveDependencies: for test
      useThrottledEffect(callback, [count], { wait: 1_000, leading: false, trailing: true })
      return { count, setCount }
    })

    expect(callback).toHaveBeenCalledTimes(0)

    await act(async () => {
      result.current.setCount((c) => c + 1)
      await vi.advanceTimersByTimeAsync(1_200)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
      result.current.setCount((c) => c + 1)
    })

    expect(callback).toHaveBeenCalledTimes(2)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })

    expect(callback).toHaveBeenCalledTimes(3) // 3
  })
})
