import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLatest } from './index'

describe('useLatest', () => {
  let hookResult: any

  beforeEach(() => {
    hookResult = renderHook((props) => useLatest(props))
  })

  afterEach(() => {
    hookResult.unmount()
  })

  it('should return the default value', () => {
    expect(hookResult.result.current.current).toBe(undefined)
  })

  it('should update the ref when the value changes', () => {
    act(() => {
      hookResult.rerender(1)
    })
    expect(hookResult.result.current.current).toBe(1)
  })

  it('should not update the ref if the value is the same', () => {
    act(() => {
      hookResult.rerender(0)
    })
    expect(hookResult.result.current.current).toBe(0)
  })

  it('should handle different types of values', () => {
    act(() => {
      hookResult.rerender('test')
    })
    expect(hookResult.result.current.current).toBe('test')

    act(() => {
      hookResult.rerender({ key: 'value' })
    })
    expect(hookResult.result.current.current).toEqual({ key: 'value' })
  })

  it('should handle complex objects', () => {
    const obj = { a: 1 }
    act(() => {
      hookResult.rerender(obj)
    })
    expect(hookResult.result.current.current).toEqual(obj)

    act(() => {
      obj.a = 2
      hookResult.rerender(obj)
    })
    expect(hookResult.result.current.current).toEqual(obj)
  })
})
