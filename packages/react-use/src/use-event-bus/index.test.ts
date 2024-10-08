import { act, renderHook } from '@/test'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventBus } from './index'

describe('useEventBus', () => {
  let key: symbol
  let listener: Mock

  beforeEach(() => {
    key = Symbol('testEvent')
    listener = vi.fn()
  })

  it('should subscribe to an event', () => {
    const { result } = renderHook(() => useEventBus(key))

    act(() => {
      result.current.on(listener)
    })

    act(() => {
      result.current.emit('testData')
    })

    expect(listener).toHaveBeenCalledWith('testData', undefined)
  })

  it('should unsubscribe from an event', () => {
    const { result } = renderHook(() => useEventBus(key))

    let clean: any

    act(() => {
      clean = result.current.on(listener)
    })

    act(() => {
      clean()
      result.current.emit('testData')
    })

    expect(listener).not.toHaveBeenCalled()
  })

  it('should call listener only once with once method', () => {
    const { result } = renderHook(() => useEventBus(key))

    act(() => {
      result.current.once(listener)
    })

    act(() => {
      result.current.emit('testData1')
      result.current.emit('testData2')
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith('testData1', undefined)
  })

  it('should clean up listeners on component unmount', () => {
    const { result, unmount } = renderHook(() => useEventBus(key))

    act(() => {
      result.current.on(listener)
    })

    unmount()

    act(() => {
      result.current.emit('testData')
    })

    expect(listener).not.toHaveBeenCalled()
  })

  it('should reset all listeners', () => {
    const { result } = renderHook(() => useEventBus(key))

    act(() => {
      result.current.on(listener)
    })

    act(() => {
      result.current.reset()
    })

    act(() => {
      result.current.emit('testData')
    })

    expect(listener).not.toHaveBeenCalled()
  })

  it('should handle multiple listeners', () => {
    const { result } = renderHook(() => useEventBus(key))
    const listener2 = vi.fn()

    act(() => {
      result.current.on(listener)
      result.current.on(listener2)
    })

    act(() => {
      result.current.emit('testData')
    })

    expect(listener).toHaveBeenCalledWith('testData', undefined)
    expect(listener2).toHaveBeenCalledWith('testData', undefined)
  })
})
