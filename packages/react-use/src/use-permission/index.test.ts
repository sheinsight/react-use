import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePermission } from './index'

describe('usePermission', () => {
  let originalNavigator: any
  let mockQuery: Mock

  beforeEach(() => {
    mockQuery = vi.fn()
    originalNavigator = navigator
    // Mock navigator.permissions.query
    globalThis.navigator = {
      ...originalNavigator,
      permissions: {
        query: mockQuery,
      },
    }
  })

  afterEach(() => {
    globalThis.navigator = originalNavigator
    vi.restoreAllMocks()
    mockQuery.mockReset()
  })

  it('should return stateRef and isSupported', async () => {
    mockQuery.mockResolvedValue({ state: 'granted' })
    const { result } = renderHook(() => usePermission('notifications', { controls: true }))
    expect(result.current).toHaveProperty('isSupported')
    expect(result.current).toHaveProperty('stateRef')
  })

  it('should query permission status immediately if immediate is true', async () => {
    mockQuery.mockResolvedValue({ state: 'granted' })
    const { result } = renderHook(() => usePermission('notifications', { immediate: true, controls: true }))

    await act(async () => {
      await result.current.query()
    })

    expect(navigator.permissions.query).toHaveBeenCalled()
  })
})
