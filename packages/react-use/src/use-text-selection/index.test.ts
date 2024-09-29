import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextSelection } from './index'

describe('useTextSelection', () => {
  let originalGetSelection: () => Selection | null

  beforeEach(() => {
    originalGetSelection = window.getSelection
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    window.getSelection = originalGetSelection
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useTextSelection())
    expect(result.current.text).toBe('')
    expect(result.current.rects).toEqual([])
    expect(result.current.ranges).toEqual([])
  })

  it('should update state on selection change', () => {
    const { result } = renderHook(() => useTextSelection())

    const mockSelection = {
      toString: () => 'selected text',
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 20 }),
      }),
    } as unknown as Selection

    window.getSelection = () => mockSelection

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
    })

    expect(result.current.text).toBe('selected text')
    expect(result.current.rects).toEqual([{ top: 0, left: 0, width: 100, height: 20 }])
    expect(result.current.ranges).toHaveLength(1)
  })

  it('should handle multiple ranges', () => {
    const { result } = renderHook(() => useTextSelection())

    const mockSelection = {
      toString: () => 'selected text',
      rangeCount: 2,
      getRangeAt: (index: number) => ({
        getBoundingClientRect: () => ({ top: index * 10, left: 0, width: 100, height: 20 }),
      }),
    } as Selection

    window.getSelection = () => mockSelection

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
    })

    expect(result.current.text).toBe('selected text')
    expect(result.current.rects).toEqual([
      { top: 0, left: 0, width: 100, height: 20 },
      { top: 10, left: 0, width: 100, height: 20 },
    ])
    expect(result.current.ranges).toHaveLength(2)
  })

  it('should handle no selection', () => {
    const { result } = renderHook(() => useTextSelection())

    window.getSelection = () =>
      ({
        toString: () => '',
        rangeCount: 0,
        getRangeAt: () => {
          throw new Error('No ranges')
        },
      }) as unknown as Selection

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
    })

    expect(result.current.text).toBe('')
    expect(result.current.rects).toEqual([])
    expect(result.current.ranges).toEqual([])
  })
})
