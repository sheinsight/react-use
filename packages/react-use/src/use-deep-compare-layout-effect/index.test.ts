import { act, renderHook } from '@/test'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { useDeepCompareLayoutEffect } from './index'

describe('useDeepCompareLayoutEffect', () => {
  it('should defined', () => {
    expect(useDeepCompareLayoutEffect).toBeDefined()
  })

  it('should run when dep changed', async () => {
    const runCount = { value: 0 }

    const result = renderHook(() => {
      const [value, setValue] = useState({ count: 1 })

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useDeepCompareLayoutEffect(() => {
        runCount.value++
      }, [value])
      return [value, setValue] as const
    })

    expect(runCount.value).toBe(1) // first mount

    await act(async () => {
      result.result.current[1]((c) => ({ ...c, count: c.count + 1 }))
    })
    expect(runCount.value).toBe(2) // changed!

    await act(async () => {
      result.result.current[1]((c) => ({ ...c, count: c.count + 1 }))
    })
    expect(runCount.value).toBe(3) // changed!

    await act(async () => {
      result.result.current[1]((c) => ({ ...c, count: c.count + 1 }))
    })
    expect(runCount.value).toBe(4) // changed!
  })

  it('should not run when deps do not changed', () => {
    const runCount = { value: 0 }

    const result = renderHook(() => {
      const [value, setValue] = useState({ count: 1 })

      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useDeepCompareLayoutEffect(() => {
        runCount.value++
      }, [value])
      return [value, setValue] as const
    })

    expect(runCount.value).toBe(1) // first mount

    act(() => {
      result.result.current[1]((v) => v)
    })

    expect(runCount.value).toBe(1) // not changed!

    act(() => {
      result.result.current[1]((v) => v)
    })

    expect(runCount.value).toBe(1) // not changed!

    act(() => {
      result.result.current[1]((v) => ({ count: v.count + 1 }))
    })

    expect(runCount.value).toBe(2) // changed!
  })
})
