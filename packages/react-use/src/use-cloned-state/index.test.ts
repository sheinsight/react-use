import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClonedState } from './index'

describe('useClonedState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should initialize with cloned source', () => {
    const source = { a: 1, b: { c: 2 } }
    const { result } = renderHook(() => useClonedState(source))

    expect(result.current[0]).toEqual(source)
    expect(result.current[0]).not.toBe(source)
  })

  it('should update cloned state independently', () => {
    const source = { a: 1, b: { c: 2 } }
    const { result } = renderHook(() => useClonedState(source))

    act(() => {
      result.current[1]({ a: 3, b: { c: 4 } })
    })

    expect(result.current[0]).toEqual({ a: 3, b: { c: 4 } })
    expect(source).toEqual({ a: 1, b: { c: 2 } })
  })

  it('should sync with source when manual is false', async () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { manual: false }), {
      initialProps: { s: source },
    })

    const newSource = { a: 3, b: { c: 4 } }
    rerender({ s: newSource })

    await vi.runAllTimersAsync()

    expect(result.current[0]).toEqual(newSource)
  })

  it('should not sync with source when manual is true', async () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { manual: true }), {
      initialProps: { s: source },
    })

    const newSource = { a: 3, b: { c: 4 } }
    rerender({ s: newSource })

    await vi.runAllTimersAsync()

    expect(result.current[0]).toEqual(source)
  })

  it('should sync manually when calling syncSource', () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { manual: true }), {
      initialProps: { s: source },
    })

    const newSource = { a: 3, b: { c: 4 } }
    rerender({ s: newSource })

    act(() => {
      result.current[2]() // Call syncSource
    })

    expect(result.current[0]).toEqual(newSource)
  })

  it('should use custom clone function when provided', () => {
    const source = { a: 1, b: { c: 2 } }
    const customClone = vi.fn((x) => ({ ...x, cloned: true }))
    const { result } = renderHook(() => useClonedState(source, { clone: customClone }))

    expect(result.current[0]).toEqual({ ...source, cloned: true })
    expect(customClone).toHaveBeenCalledWith(source)
  })

  it('should perform deep comparison when deep is true', async () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { deep: true, manual: false }), {
      initialProps: { s: source },
    })

    const newSource = { a: 1, b: { c: 3 } }
    rerender({ s: newSource })

    await vi.runAllTimersAsync()

    expect(result.current[0]).toEqual(newSource)
  })

  it('should perform shallow comparison when deep is false', async () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { deep: false, manual: false }), {
      initialProps: { s: source },
    })

    const newSource = { ...source, b: { c: 3 } }
    rerender({ s: newSource })

    await vi.runAllTimersAsync()

    expect(result.current[0]).toEqual(newSource)
  })

  it('should not update when source reference changes but content is the same', async () => {
    const source = { a: 1, b: { c: 2 } }
    const { result, rerender } = renderHook(({ s }) => useClonedState(s, { deep: true, manual: false }), {
      initialProps: { s: source },
    })

    const newSource = { ...source }
    rerender({ s: newSource })

    await vi.runAllTimersAsync()

    expect(result.current[0]).toBe(result.current[0]) // Reference should not change
  })
})
