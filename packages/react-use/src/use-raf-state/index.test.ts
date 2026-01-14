import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRafState } from './index'

describe('useRafState', () => {
  const initialState = 0

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the correct initial state', () => {
    const { result } = renderHook(() => useRafState(initialState))
    expect(result.current[0]).toBe(initialState)
  })

  it('should update state correctly', async () => {
    const { result } = renderHook(() => useRafState(initialState))

    act(() => {
      result.current[1](1)
    })
    expect(result.current[0]).toBe(initialState)

    act(() => {
      vi.advanceTimersToNextFrame()
    })
    expect(result.current[0]).toBe(1)
  })

  it('should work with undefined initial state', () => {
    const { result } = renderHook(() => useRafState())
    expect(result.current[0]).toBeUndefined()
  })

  it.each([
    {
      name: 'value updates',
      updates: [2, 3],
      expected: 3,
    },
    {
      name: 'function updates',
      updates: [(prev: number) => prev + 2, (prev: number) => prev + 1],
      expected: 3,
    },
    {
      name: 'mixed updates',
      updates: [2, (prev: number) => prev + 1],
      expected: 3,
    },
  ])('should handle multiple updates correctly > $name', ({ updates, expected }) => {
    const { result } = renderHook(() => useRafState(initialState))

    act(() => {
      const [_, setState] = result.current
      for (const update of updates) {
        setState(update)
      }
    })
    act(() => {
      vi.advanceTimersToNextFrame()
    })

    expect(result.current[0]).toBe(expected)
  })
})
