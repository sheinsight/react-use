import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useToggle } from './index'

describe('useToggle', () => {
  it('should initialize with the correct state', () => {
    const result = renderHook(() => useToggle(true))
    expect(result.result.current[0]).toBe(true)
  })

  it('should toggle state', () => {
    const result = renderHook(() => useToggle(true))
    const { toggle } = result.result.current[1]
    act(() => {
      toggle()
    })
    expect(result.result.current[0]).toBe(false)

    act(() => {
      toggle()
    })
    expect(result.result.current[0]).toBe(true)
  })

  it('should set left state', () => {
    const result = renderHook(() => useToggle(true))
    const { setLeft } = result.result.current[1]
    act(() => {
      setLeft()
    })
    expect(result.result.current[0]).toBe(true)
  })

  it('should set right state', () => {
    const result = renderHook(() => useToggle(true))
    const { setRight } = result.result.current[1]
    act(() => {
      setRight()
    })
    expect(result.result.current[0]).toBe(false)
  })

  it('should handle initial false state', () => {
    const { result } = renderHook(() => useToggle(false))
    expect(result.current[0]).toBe(false)
  })

  it('should handle custom values', () => {
    const { result } = renderHook(() => useToggle(['on', 'off']))
    expect(result.current[0]).toBe('on')

    const { toggle } = result.current[1]
    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe('off')

    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe('on')
  })

  it('should handle undefined second value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)

    const { toggle } = result.current[1]
    act(() => {
      toggle()
    })
    expect(result.current[0]).toBe(false)
  })
})
