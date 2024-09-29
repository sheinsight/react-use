import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useUrlSearchParams } from './index'

describe('useUrlSearchParams', () => {
  let originalLocation: Location

  beforeEach(() => {
    originalLocation = window.location
    window.location = { ...originalLocation, search: '', hash: '' } as Location
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUrlSearchParams())
    expect(result.current[0]).toEqual({})
  })

  it('should update state with URLSearchParams', () => {
    window.location.search = '?a=1&b=2'
    const { result } = renderHook(() => useUrlSearchParams())
    expect(result.current[0]).toEqual({ a: '1', b: '2' })
  })

  it('should remove nullish values when configured', () => {
    window.location.search = '?a=1&b=null&c=undefined'
    const { result } = renderHook(() => useUrlSearchParams('history', { removeNullishValues: true }))
    act(() => {
      result.current[1]({ a: '1', b: null, c: undefined })
    })
    // state should contain nullish values, but not in url
    expect(result.current[0]).toEqual({ a: '1', b: null, c: undefined })
    // window.location.search should not contain nullish values

    // TODO: window.location.search should be updated, but now it cannot be detected
  })

  it('should not remove falsy values by default', () => {
    window.location.search = '?a=0&b=false&c='
    const { result } = renderHook(() => useUrlSearchParams())
    expect(result.current[0]).toEqual({ a: '0', b: 'false', c: '' })
  })

  it('should clear parameters', () => {
    window.location.search = '?a=1'
    const { result } = renderHook(() => useUrlSearchParams())
    expect(result.current[0]).toEqual({ a: '1' })

    act(() => {
      result.current[2]() // Clear params
    })

    expect(result.current[0]).toEqual({})
  })

  it('should handle hash mode correctly', () => {
    window.location.hash = '#?a=1&b=2'
    const { result } = renderHook(() => useUrlSearchParams('hash'))
    expect(result.current[0]).toEqual({ a: '1', b: '2' })
  })

  it('should handle hash-params mode correctly', () => {
    window.location.hash = '#a=1&b=2'
    const { result } = renderHook(() => useUrlSearchParams('hash-params'))
    expect(result.current[0]).toEqual({ a: '1', b: '2' })
  })

  it('should write back to history when enabled', () => {
    const { result } = renderHook(() => useUrlSearchParams('history', { write: true }))

    act(() => {
      result.current[1]({ a: '1' }) // Update state
    })

    expect(result.current[0]).toEqual({ a: '1' })

    // TODO: window.location.search should be updated, but now it cannot be detected
  })
})
