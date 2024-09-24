import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBeforeUnload } from '../index'

describe('useBeforeUnload', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add event listener on mount', () => {
    const callback = vi.fn()
    renderHook(() => useBeforeUnload(callback))

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function), { capture: true })
  })

  it('should remove event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useBeforeUnload(callback))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function), { capture: true })
  })

  it('should call the callback when beforeunload event is triggered', () => {
    const callback = vi.fn()
    renderHook(() => useBeforeUnload(callback))

    const event = new Event('beforeunload') as BeforeUnloadEvent
    window.dispatchEvent(event)

    expect(callback).toHaveBeenCalledWith(event)
  })

  it('should not prevent default behavior by default', () => {
    const callback = vi.fn()
    renderHook(() => useBeforeUnload(callback))

    const event = new Event('beforeunload') as BeforeUnloadEvent
    event.preventDefault = vi.fn()
    window.dispatchEvent(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.returnValue).toBe(true)
  })

  it('should prevent default behavior when preventDefault option is true', () => {
    const callback = vi.fn()
    renderHook(() => useBeforeUnload(callback, { preventDefault: true }))

    const event = new Event('beforeunload') as BeforeUnloadEvent
    event.preventDefault = vi.fn()
    window.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe(true)
  })

  it('should use the latest callback and options', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    const { rerender } = renderHook(({ cb, options }) => useBeforeUnload(cb, options), {
      initialProps: { cb: callback1, options: {} },
    })

    rerender({ cb: callback2, options: { preventDefault: true } })

    const event = new Event('beforeunload') as BeforeUnloadEvent
    event.preventDefault = vi.fn()
    window.dispatchEvent(event)

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledWith(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.returnValue).toBe(true)
  })

  it('should return a cleanup function', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useBeforeUnload(callback))

    expect(typeof result.current).toBe('function')

    act(() => {
      result.current()
    })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function), { capture: true })
  })
})
