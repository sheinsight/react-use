import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useReConnect } from './index'

describe('useReConnect', () => {
  let mockCallback: Mock
  let originalAddEventListener: typeof window.addEventListener
  let originalRemoveEventListener: typeof window.removeEventListener

  beforeEach(() => {
    mockCallback = vi.fn()
    originalAddEventListener = window.addEventListener
    originalRemoveEventListener = window.removeEventListener

    // Mock the event listener methods
    window.addEventListener = vi.fn()
    window.removeEventListener = vi.fn()
  })

  afterEach(() => {
    // Restore original methods
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
  })

  it('should register the reconnect event listener', () => {
    const { result } = renderHook(() => useReConnect(mockCallback))

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function), { passive: true })
  })

  it('should call the callback when the network is reconnected', () => {
    const { result } = renderHook(() => useReConnect(mockCallback))
    // Simulate the online event
    const onlineEvent = (window.addEventListener as Mock).mock.calls[0][1]
    act(() => {
      onlineEvent()
    })

    expect(mockCallback).toHaveBeenCalled()
  })

  it('should clean up the event listener on unmount', () => {
    const { unmount } = renderHook(() => useReConnect(mockCallback))

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
  })

  it('should use custom registerReConnect function', () => {
    const customRegister = vi.fn((cb) => {
      cb()
      return () => {}
    })

    renderHook(() => useReConnect(mockCallback, { registerReConnect: customRegister }))

    expect(customRegister).toHaveBeenCalled()
    expect(mockCallback).toHaveBeenCalled()
  })
})
