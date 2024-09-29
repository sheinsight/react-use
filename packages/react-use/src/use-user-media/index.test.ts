import { renderHook } from '@/test'
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserMedia } from './index'

describe('useUserMedia', () => {
  let originalMediaDevices: any
  let mockGetUserMedia: MockInstance

  beforeEach(() => {
    navigator.mediaDevices
    originalMediaDevices = navigator.mediaDevices
    mockGetUserMedia = vi.fn()
    // @ts-ignore
    navigator.mediaDevices = { getUserMedia: mockGetUserMedia }
    vi.useFakeTimers()
  })

  afterEach(() => {
    // @ts-ignore
    navigator.mediaDevices = originalMediaDevices
    vi.useRealTimers()
  })

  it('should initialize with default options', () => {
    const { result } = renderHook(() => useUserMedia())
    expect(result.current.stream.current).toBeNull()
    expect(result.current.isSupported).toBe(true)
  })
})
