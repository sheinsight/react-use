import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useReFocus } from './index'

describe('useReFocus', () => {
  let callback: Mock
  // const mockHidden = vi.spyOn(document, 'hidden', 'get')

  beforeEach(() => {
    callback = vi.fn()
    // Mock the window event listeners
    window.addEventListener = vi.fn()
    window.removeEventListener = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not call the callback when the window is not focused', async () => {
    renderHook(() => useReFocus(callback))

    await act(async () => {
      window.dispatchEvent(new Event('blur'))
    })

    expect(callback).toHaveBeenCalledTimes(0)
  })

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useReFocus(callback))

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('focus', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })

  it('should use custom registerReFocus function', async () => {
    const customRegister = vi.fn()
    const { result } = renderHook(() => useReFocus(callback, { registerReFocus: customRegister }))

    await act(async () => {
      customRegister.mock.calls[0][0]()
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
