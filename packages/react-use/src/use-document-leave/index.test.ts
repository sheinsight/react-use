import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useDocumentLeave } from './index'

describe('useDocumentLeave', () => {
  it('should return false when mouse is inside the document', () => {
    const { result } = renderHook(() => useDocumentLeave())

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mouseenter', {
          relatedTarget: document.createElement('div'),
        }),
      )
    })

    expect(result.current).toBe(false)
  })

  it('should return true when mouse leaves the document', () => {
    const { result } = renderHook(() => useDocumentLeave())

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseout', { relatedTarget: null }))
    })

    expect(result.current).toBe(true)
  })

  it('should return false when mouse enters back into the document', () => {
    const { result } = renderHook(() => useDocumentLeave())

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mouseenter', {
          relatedTarget: document.createElement('div'),
        }),
      )
    })

    expect(result.current).toBe(false)
  })

  it('should handle multiple mouse events correctly', () => {
    const { result } = renderHook(() => useDocumentLeave())

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseout', { relatedTarget: null }))
    })

    expect(result.current).toBe(true)

    act(() => {
      document.dispatchEvent(
        new MouseEvent('mouseenter', {
          relatedTarget: document.createElement('div'),
        }),
      )
    })
    expect(result.current).toBe(false)

    act(() => {
      window.dispatchEvent(new MouseEvent('mouseout', { relatedTarget: null }))
    })

    expect(result.current).toBe(true)
  })
})
