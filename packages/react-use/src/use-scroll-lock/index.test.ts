import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useScrollLock } from './index'

describe('useScrollLock', () => {
  let targetElement: HTMLElement

  beforeEach(() => {
    targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
    vi.useRealTimers()
  })

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    expect(result.current[0]).toBe(false) // isLocked
  })

  it('should lock the scroll', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].lock()
    })
    expect(result.current[0]).toBe(true) // isLocked
    expect(targetElement.style.overflow).toBe('hidden')
  })

  it('should unlock the scroll', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].lock()
    })
    act(() => {
      result.current[2].unlock()
    })
    expect(result.current[0]).toBe(false) // isLocked
    expect(targetElement.style.overflow).toBe('')
  })

  it('should toggle the scroll lock', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].toggle()
    })
    expect(result.current[0]).toBe(true) // isLocked
    act(() => {
      result.current[2].toggle()
    })
    expect(result.current[0]).toBe(false) // isLocked
  })

  it('should not lock if already locked', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].lock()
    })
    const initialOverflow = targetElement.style.overflow
    act(() => {
      result.current[2].lock()
    })
    expect(targetElement.style.overflow).toBe(initialOverflow) // should remain 'hidden'
  })

  it('should not unlock if not locked', () => {
    const { result } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].unlock()
    })
    expect(result.current[0]).toBe(false) // isLocked
  })

  it('should clean up on unmount', () => {
    const { result, unmount } = renderHook(() => useScrollLock(targetElement))
    act(() => {
      result.current[2].lock()
    })
    expect(targetElement.style.overflow).toBe('hidden')
    unmount()
    expect(targetElement.style.overflow).toBe('') // should be reset
  })
})
