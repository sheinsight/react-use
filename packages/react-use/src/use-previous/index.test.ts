import { configure, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { usePrevious } from './index'

describe('usePrevious', () => {
  it('should return undefined as the previous value when first mount', () => {
    const { result } = renderHook(() => usePrevious(10))
    expect(result.current).toBeUndefined()
  })

  it('should return the previous value when a new state is provided', () => {
    const { result, rerender } = renderHook((state) => usePrevious(state), { initialProps: 0 })
    expect(result.current).toBeUndefined()

    rerender(1)
    expect(result.current).toBe(0)

    rerender(2)
    expect(result.current).toBe(1)
  })

  it('should use the custom isEqual function to compare previous and current values', () => {
    const { result, rerender } = renderHook(
      (state) =>
        usePrevious(state, {
          // odd number will be as the same, NOT trigger the update
          isEqual: (prev: number | undefined, curr: number) => curr % 2 === 0,
        }),
      { initialProps: 0 },
    )

    expect(result.current).toBeUndefined()

    rerender(1) // even will trigger the update
    expect(result.current).toBe(0)

    rerender(2) // odd NOT update
    expect(result.current).toBe(0)

    rerender(3) // even will trigger the update
    expect(result.current).toBe(2)

    rerender(4) // odd NOT update
    expect(result.current).toBe(2)

    rerender(5) // even will trigger the update
    expect(result.current).toBe(4)
  })

  it('should compare deeply when the `deep` option is enabled', () => {
    const { result, rerender } = renderHook((state) => usePrevious(state, { deep: true }), {
      initialProps: { count: 0 },
    })

    expect(result.current?.count).toBeUndefined()

    rerender({ count: 1 })
    expect(result.current?.count).toBe(0)

    rerender({ count: 1 })
    expect(result.current?.count).toBe(0)

    rerender({ count: 2 })
    expect(result.current?.count).toBe(1)

    rerender({ count: 2 })
    expect(result.current?.count).toBe(1)

    rerender({ count: 2 })
    expect(result.current?.count).toBe(1)
  })

  it('should work with multiple previous values', () => {
    const { result, rerender } = renderHook(
      (state) => {
        const p1 = usePrevious(state)
        const p2 = usePrevious(p1)
        const p3 = usePrevious(p2)
        return [p1, p2, p3]
      },
      { initialProps: 0 },
    )

    expect(result.current).toEqual([undefined, undefined, undefined])

    rerender(1)
    expect(result.current).toEqual([0, undefined, undefined])

    rerender(2)
    expect(result.current).toEqual([1, 0, undefined])

    rerender(3)
    expect(result.current).toEqual([2, 1, 0])

    rerender(4)
    expect(result.current).toEqual([3, 2, 1])
  })

  it('should work in strict mode', () => {
    configure({ reactStrictMode: true })

    const { result, rerender } = renderHook(
      (state) => {
        const p1 = usePrevious(state)
        const p2 = usePrevious(p1)
        const p3 = usePrevious(p2)
        return [p1, p2, p3]
      },
      { initialProps: 0 },
    )

    expect(result.current).toEqual([undefined, undefined, undefined])

    rerender(1)
    expect(result.current).toEqual([0, undefined, undefined])

    rerender(2)
    expect(result.current).toEqual([1, 0, undefined])

    rerender(3)
    expect(result.current).toEqual([2, 1, 0])

    rerender(4)
    expect(result.current).toEqual([3, 2, 1])

    configure({ reactStrictMode: false })
  })
})
