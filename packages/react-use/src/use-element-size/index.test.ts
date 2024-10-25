import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useElementSize } from './index'

describe('useElementSize', () => {
  let cb: ResizeObserverCallback

  beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        cb = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    // @ts-ignore for test
    // biome-ignore lint/performance/noDelete: for test
    delete global.ResizeObserver
  })

  it('should defined', () => {
    expect(useElementSize).toBeDefined()
  })

  it('should return initial size', () => {
    const { result } = renderHook(() => useElementSize('body'))

    act(() => {
      // @ts-ignore for test
      cb([{ contentRect: { width: 100, height: 200 } }], result.current.observerRef.current)
    })

    expect(result.current.width).toBe(100)
    expect(result.current.height).toBe(200)
    expect(result.current.isSupported).toBe(true)
    expect(result.current.observerRef.current).toBeInstanceOf(global.ResizeObserver)
  })

  it('should handle SVG element', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const mockGetComputedStyle = vi.spyOn(window, 'getComputedStyle')
    // @ts-ignore for test
    mockGetComputedStyle.mockReturnValue({ width: '100.5px', height: '200px' })

    const { result } = renderHook(() => useElementSize('svg'))

    act(() => {
      // @ts-ignore for test
      cb([{ contentRect: {} }], result.current.observerRef.current)
    })

    expect(result.current.width).toBe(100.5)
    expect(result.current.height).toBe(200)
    expect(result.current.isSupported).toBe(true)
    expect(result.current.observerRef.current).toBeInstanceOf(global.ResizeObserver)

    mockGetComputedStyle.mockReset()
    svg.remove()
  })
})
