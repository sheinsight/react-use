import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClickOutside } from './index'

describe('useClickOutside', () => {
  let container: HTMLDivElement
  let target: HTMLDivElement
  let outside: HTMLDivElement
  let handler: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    target = document.createElement('div')
    outside = document.createElement('div')
    container.appendChild(target)
    container.appendChild(outside)
    document.body.appendChild(container)
    handler = vi.fn()

    if (typeof PointerEvent === 'undefined') {
      class PointerEvent extends Event {
        constructor(type: string, props: PointerEventInit = {}) {
          super(type, { bubbles: true, ...props })
        }
      }
      global.PointerEvent = PointerEvent as any
    }
  })

  it('should call handler when clicking outside', () => {
    renderHook(() => useClickOutside(target, handler))

    act(() => {
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not call handler when clicking inside', () => {
    renderHook(() => useClickOutside(target, handler))

    act(() => {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should work with string selector', () => {
    target.id = 'target'
    renderHook(() => useClickOutside('#target', handler))

    act(() => {
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should ignore specified elements', () => {
    const ignore = document.createElement('div')
    container.appendChild(ignore)

    renderHook(() => useClickOutside(target, handler, { ignore: [ignore] }))

    act(() => {
      ignore.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should work with string selector for ignore', () => {
    const ignore = document.createElement('div')
    ignore.classList.add('ignore-me')
    container.appendChild(ignore)

    renderHook(() => useClickOutside(target, handler, { ignore: ['.ignore-me'] }))

    act(() => {
      ignore.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should handle multiple ignore elements', () => {
    const ignore1 = document.createElement('div')
    const ignore2 = document.createElement('div')
    container.appendChild(ignore1)
    container.appendChild(ignore2)

    renderHook(() => useClickOutside(target, handler, { ignore: [ignore1, ignore2] }))

    act(() => {
      ignore1.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      ignore2.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should work with PointerEvent', () => {
    renderHook(() => useClickOutside(target, handler))

    act(() => {
      outside.dispatchEvent(new PointerEvent('click', { bubbles: true }))
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should not call handler when target is null', () => {
    renderHook(() => useClickOutside(null, handler))

    act(() => {
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useClickOutside(target, handler))

    unmount()

    act(() => {
      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(handler).not.toHaveBeenCalled()
  })
})
