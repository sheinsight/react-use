import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useVersionedAction } from './index'

describe('useVersionedAction', () => {
  let result: { current: ReturnType<typeof useVersionedAction> }

  beforeEach(() => {
    result = renderHook(() => useVersionedAction()).result
  })

  it('should initialize with {}', () => {
    expect(result.current[0]()).toEqual({})
  })

  it('should increment version correctly', () => {
    let version = {}
    act(() => {
      version = result.current[0]()
    })
    expect(result.current[0]()).not.toBe(version)
  })

  it('should run action with the correct version', () => {
    const handler = vi.fn()
    let version = {}
    act(() => {
      version = result.current[0]()
    })
    act(() => {
      result.current[1](version, handler)
    })
    expect(handler).toHaveBeenCalled()
  })

  it('should not run action with an incorrect version', () => {
    const handler = vi.fn()
    act(() => {
      result.current[0]()
    })
    act(() => {
      result.current[1]({}, handler)
    })
    expect(handler).not.toHaveBeenCalled()
  })

  it('should handle multiple actions correctly', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    let version = {}

    act(() => {
      version = result.current[0]()
    })
    act(() => {
      result.current[1](version, handler1)
    })
    expect(handler1).toHaveBeenCalled()

    act(() => {
      version = result.current[0]()
    })
    act(() => {
      result.current[1](version, handler2)
    })
    expect(handler2).toHaveBeenCalled()
  })

  it('should not run action if version is not changed', () => {
    const handler = vi.fn()
    act(() => {
      result.current[1]({}, handler)
    })
    expect(handler).not.toHaveBeenCalled()
  })
})
