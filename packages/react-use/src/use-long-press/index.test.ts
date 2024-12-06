import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLongPress } from './index'

describe('useLongPress', () => {
  let target: HTMLElement

  beforeEach(() => {
    // for test
    ;(window as any).PointerEvent = MouseEvent
    target = document.createElement('div')
    document.body.appendChild(target)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.removeChild(target)
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useLongPress).toBeDefined()
  })

  it('should trigger handler on long press', async () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useLongPress(target, handler))

    await act(async () => {
      target.dispatchEvent(new PointerEvent('pointerdown'))
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(handler).toHaveBeenCalled()
    expect(result.current.isLongPressed).toBe(true)
  })

  it('should not trigger handler if moved beyond threshold', () => {
    const handler = vi.fn()
    const { result } = renderHook(() => useLongPress(target, handler, { distanceThreshold: 10 }))

    act(() => {
      target.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      target.dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20 }))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(handler).not.toHaveBeenCalled()
    expect(result.current.isMeetThreshold).toBe(false)
  })

  it('should prevent default behavior when preventDefault is true', () => {
    const handler = vi.fn()
    renderHook(() => useLongPress(target, handler, { modifiers: { preventDefault: true } }))
    const preventDefault = vi.fn()

    act(() => {
      const event = new PointerEvent('pointerdown')
      event.preventDefault = preventDefault
      target.dispatchEvent(event)
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(preventDefault).toHaveBeenCalled()
  })

  it('should stop propagation when stopPropagation is true', () => {
    const handler = vi.fn()
    renderHook(() => useLongPress(target, handler, { modifiers: { stopPropagation: true } }))
    const stopPropagation = vi.fn()

    act(() => {
      const event = new PointerEvent('pointerdown')
      event.stopPropagation = stopPropagation
      target.dispatchEvent(event)
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(stopPropagation).toHaveBeenCalled()
  })

  it('should handle multiple events correctly', () => {
    const handler = vi.fn()
    renderHook(() => useLongPress(target, handler))

    act(() => {
      target.dispatchEvent(new PointerEvent('pointerdown'))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(handler).toHaveBeenCalled()

    act(() => {
      target.dispatchEvent(new PointerEvent('pointerdown'))
      target.dispatchEvent(new PointerEvent('pointermove', { clientX: 15, clientY: 15 }))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new PointerEvent('pointerup'))
    })

    expect(handler).not.toHaveBeenCalledTimes(2) // Should not be called again
  })
})
