import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useMousePressed } from './index'

describe('useMousePressed', () => {
  it('should defined', () => {
    expect(useMousePressed).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useMousePressed())

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)
  })

  it('should return true when mouse is pressed', () => {
    const { result } = renderHook(() => useMousePressed())

    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'))
    })

    expect(result.current.pressed).toBe(true)
    expect(result.current.sourceType).toBe('mouse')
  })

  it("should return false when mouse isn't pressed", () => {
    const { result } = renderHook(() => useMousePressed())

    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'))
      window.dispatchEvent(new MouseEvent('mouseup'))
    })

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)
  })

  it('should not handle drag events when false', () => {
    const { result } = renderHook(() => useMousePressed(() => window, { drag: false }))

    act(() => {
      window.dispatchEvent(new MouseEvent('dragstart'))
    })

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)
  })

  it('should handle drag events', () => {
    const { result } = renderHook(() => useMousePressed())

    act(() => {
      window.dispatchEvent(new MouseEvent('dragstart'))
    })

    expect(result.current.pressed).toBe(true)
    expect(result.current.sourceType).toBe('mouse')
  })

  it('should handle touch events', () => {
    const { result } = renderHook(() => useMousePressed())

    act(() => {
      window.dispatchEvent(new TouchEvent('touchstart'))
    })

    expect(result.current.pressed).toBe(true)
    expect(result.current.sourceType).toBe('touch')

    act(() => {
      window.dispatchEvent(new TouchEvent('touchend'))
    })

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)
  })

  it('should not handle touch events when false', () => {
    const { result } = renderHook(() => useMousePressed(() => window, { touch: false }))

    act(() => {
      window.dispatchEvent(new TouchEvent('touchstart'))
    })

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)

    act(() => {
      window.dispatchEvent(new TouchEvent('touchend'))
    })

    expect(result.current.pressed).toBe(false)
    expect(result.current.sourceType).toBe(null)
  })
})
