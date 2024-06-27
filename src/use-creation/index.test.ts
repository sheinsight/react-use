import { renderHook } from '@/test'
import { describe, expect, test } from 'vitest'
import { useCreation } from './index'

describe('useCreation', () => {
  test('useCreation should return the same value when dependencies do not change', () => {
    const { result, rerender } = renderHook(() => useCreation(() => Math.random()))

    const initialValue = result.current

    rerender()

    expect(result.current).toBe(initialValue)
  })

  test('useCreation should re-create the value when dependencies change', () => {
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => Math.random(), [dep]), {
      initialProps: { dep: 1 },
    })

    const initialValue = result.current

    rerender({ dep: 2 })

    expect(result.current).not.toBe(initialValue)
  })

  test('useCreation should memoize the value when dependencies do not change', () => {
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => ({ value: Math.random() }), [dep]), {
      initialProps: { dep: 1 },
    })

    const initialValue = result.current

    rerender({ dep: 1 })

    expect(result.current).toBe(initialValue)
  })

  test('useCreation should memoize the value when dependencies do not deep compare change', () => {
    const { result, rerender } = renderHook(({ dep }) => useCreation(() => ({ value: Math.random() }), [dep]), {
      initialProps: { dep: { value: 1 } },
    })

    const initialValue = result.current

    rerender({ dep: { value: 1 } })

    expect(result.current).toBe(initialValue)
  })
})
