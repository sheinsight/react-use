import { act, renderHook } from '@/test'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedEffect } from './index'

describe('useDebouncedEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useDebouncedEffect).toBeDefined()
  })

  it('should debounce to run effect', async () => {
    const runCount = { value: 0 }

    const result = renderHook(() => {
      const [count, setCount] = useState(0)

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useDebouncedEffect(
        () => {
          runCount.value++
        },
        [count],
        { wait: 100 },
      )
      return [count, setCount] as const
    })

    expect(runCount.value).toBe(0)

    // reset first debounce
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(runCount.value).toBe(1)

    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1200)
    })
    expect(runCount.value).toBe(2)

    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    expect(runCount.value).toBe(2) // start debounce, not changed yet

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })
    expect(runCount.value).toBe(3) // changed

    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })
    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })
    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })
    await act(async () => {
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })
    expect(runCount.value).toBe(4) // debounced

    await act(async () => {
      result.result.current[1]((c) => c + 1)
      result.result.current[1]((c) => c + 1)
      result.result.current[1]((c) => c + 1)
      result.result.current[1]((c) => c + 1)
      result.result.current[1]((c) => c + 1)
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(runCount.value).toBe(5) // debounced
  })
})
