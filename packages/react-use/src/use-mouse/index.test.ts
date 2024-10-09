import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMouse } from './index'

describe('useMouse', () => {
  let target: HTMLElement

  beforeEach(() => {
    target = document.createElement('div')
    document.body.appendChild(target)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.removeChild(target)
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useMouse).toBeDefined()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMouse())
    expect(result.current.position).toEqual({ x: 0, y: 0 })
    expect(result.current.sourceType).toBeNull()
  })

  it('should update position on mouse move', () => {
    const { result } = renderHook(() => useMouse({ target }))

    act(() => {
      const mouseEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 200 })
      target.dispatchEvent(mouseEvent)
    })

    expect(result.current.position).toEqual({ x: 100, y: 200 })
    expect(result.current.sourceType).toBe('mouse')
  })

  it('should update position on touch move', () => {
    const { result } = renderHook(() => useMouse({ target, type: 'client' }))

    act(() => {
      const touchEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 150, clientY: 250 } as never],
      })
      target.dispatchEvent(touchEvent)
    })

    expect(result.current.position).toEqual({ x: 150, y: 250 })
    expect(result.current.sourceType).toBe('touch')
  })

  it('should reset position on touch end if resetOnTouchEnds is true', () => {
    const { result } = renderHook(() => useMouse({ target, resetOnTouchEnds: true, type: 'client' }))

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 250 } as never],
      })
      target.dispatchEvent(touchStartEvent)
    })

    expect(result.current.position).toEqual({ x: 150, y: 250 })

    act(() => {
      const touchEndEvent = new TouchEvent('touchend')
      target.dispatchEvent(touchEndEvent)
    })

    expect(result.current.position).toEqual({ x: 0, y: 0 })
  })

  it('should not reset position on touch end if resetOnTouchEnds is false', () => {
    const { result } = renderHook(() => useMouse({ target, resetOnTouchEnds: false, type: 'client' }))

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 250 } as never],
      })
      target.dispatchEvent(touchStartEvent)
    })

    expect(result.current.position).toEqual({ x: 150, y: 250 })

    act(() => {
      const touchEndEvent = new TouchEvent('touchend')
      target.dispatchEvent(touchEndEvent)
    })

    expect(result.current.position).toEqual({ x: 150, y: 250 })
  })

  it('should stop event listeners when stop is called', () => {
    const { result } = renderHook(() => useMouse({ target }))

    act(() => {
      const mouseEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 200 })
      target.dispatchEvent(mouseEvent)
    })

    expect(result.current.position).toEqual({ x: 100, y: 200 })

    act(() => {
      result.current.stop()
    })

    act(() => {
      const mouseEvent = new MouseEvent('mousemove', { clientX: 200, clientY: 300 })
      target.dispatchEvent(mouseEvent)
    })

    expect(result.current.position).toEqual({ x: 100, y: 200 }) // Should not update
  })
})
