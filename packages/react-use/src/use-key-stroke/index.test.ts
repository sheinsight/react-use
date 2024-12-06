import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useKeyStroke } from './index'

describe('useKeyStroke', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useKeyStroke).toBeDefined()
  })

  it('should call handler on keydown event', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke('a', handler))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not call handler if key does not match', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke('a', handler))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'b' })
      window.dispatchEvent(event)
    })

    expect(handler).toHaveBeenCalledTimes(0)
  })

  it('should handle multiple keys', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke(['a', 'b'], handler))

    act(() => {
      const eventA = new KeyboardEvent('keydown', { key: 'a' })
      const eventB = new KeyboardEvent('keydown', { key: 'b' })
      window.dispatchEvent(eventA)
      window.dispatchEvent(eventB)
    })

    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('should ignore repeated events when dedupe is true', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke('a', handler, { dedupe: true }))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)

      const repeatEvent = new KeyboardEvent('keydown', { key: 'a', repeat: true })
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
      window.dispatchEvent(repeatEvent)
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should call handler only once if once is true', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke('a', handler, { once: true }))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
      window.dispatchEvent(event) // Repeat
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should work with passive event listeners', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke('a', handler, { passive: true }))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should handle undefined key gracefully', () => {
    const handler = vi.fn()
    renderHook(() => useKeyStroke(undefined, handler))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
