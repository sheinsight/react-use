import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTargetElement } from './index'

describe('useTargetElement', () => {
  let targetElement: HTMLElement | null = null

  beforeEach(() => {
    targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    if (targetElement) {
      document.body.removeChild(targetElement)
    }
  })

  it('should return a ref object', () => {
    const { result } = renderHook(() => useTargetElement(targetElement))
    expect(result.current).toBeDefined()
    expect(result.current.current).toBe(targetElement)
  })

  it('should update ref when target changes', () => {
    const { result, rerender } = renderHook(({ target }) => useTargetElement(target), {
      initialProps: { target: targetElement },
    })

    expect(result.current.current).toBe(targetElement)

    const newElement = document.createElement('span')
    rerender({ target: newElement })
    expect(result.current.current).toBe(newElement)
  })

  it('should handle null target', () => {
    const { result } = renderHook(() => useTargetElement(null))
    expect(result.current.current).toBeNull()
  })

  it('should handle string selector', () => {
    const { result } = renderHook(() => useTargetElement('div'))
    act(() => {
      const div = document.createElement('div')
      document.body.appendChild(div)
    })
    expect(result.current.current).toBeDefined()
  })

  it('should handle ref object', () => {
    const ref = { current: targetElement }
    const { result } = renderHook(() => useTargetElement(ref))
    expect(result.current.current).toBe(targetElement)
  })

  it('should handle undefined target', () => {
    const { result } = renderHook(() => useTargetElement(undefined))
    expect(result.current.current).toBeNull()
  })
})
