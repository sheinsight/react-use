import { act, renderHook } from '@/test'
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDocumentVisibility } from './index'

describe('useDocumentVisibility', () => {
  let mockDocumentVisibilityState: MockInstance<() => DocumentVisibilityState>

  beforeEach(() => {
    mockDocumentVisibilityState = vi.spyOn(document, 'visibilityState', 'get')
  })

  afterEach(() => {
    mockDocumentVisibilityState.mockReset()
  })

  it('should return "visible" when first render', async () => {
    const { result } = renderHook(() => useDocumentVisibility())
    expect(result.current).toBe('visible')
  })

  it('should call callback with correct state on visibility change', () => {
    const callback = vi.fn()
    mockDocumentVisibilityState.mockReturnValue('visible')
    const { result } = renderHook(() => useDocumentVisibility(callback))

    act(() => {
      mockDocumentVisibilityState.mockReturnValue('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current).toBe('hidden')
    expect(callback).toHaveBeenCalledWith('hidden', expect.any(Event))

    act(() => {
      mockDocumentVisibilityState.mockReturnValue('visible')
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current).toBe('visible')
    expect(callback).toHaveBeenCalledWith('visible', expect.any(Event))
  })

  it('should not call callback if it is not provided', () => {
    const { result } = renderHook(() => useDocumentVisibility())

    act(() => {
      mockDocumentVisibilityState.mockReturnValue('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(result.current).toBe('hidden')
  })
})
