import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePausable } from './index'

describe('usePausable', () => {
  let pauseCallback: Mock
  let resumeCallback: Mock

  beforeEach(() => {
    pauseCallback = vi.fn()
    resumeCallback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePausable())
    expect(result.current.isActive()).toBe(false)
  })

  it('should pause and resume correctly', async () => {
    const { result } = renderHook(() => usePausable(true, pauseCallback, resumeCallback))

    act(() => {
      result.current.pause(true)
    })
    expect(result.current.isActive()).toBe(false)
    expect(pauseCallback).toHaveBeenCalled()

    act(() => {
      result.current.resume(true)
    })
    expect(result.current.isActive()).toBe(true)
    expect(resumeCallback).toHaveBeenCalled()
  })

  it('should handle promises in pause and resume callbacks', async () => {
    pauseCallback.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 100)))
    resumeCallback.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 100)))

    const { result } = renderHook(() => usePausable(true, pauseCallback, resumeCallback))

    act(() => {
      result.current.pause(true)
    })
    expect(result.current.isActive()).toBe(false)

    await act(async () => {
      await pauseCallback.mock.results[0].value
    })
    expect(result.current.isActive()).toBe(false)

    act(() => {
      result.current.resume(true)
    })
    expect(result.current.isActive()).toBe(true)

    await act(async () => {
      await resumeCallback.mock.results[0].value
    })
    expect(result.current.isActive()).toBe(true)
  })

  it('should not trigger re-render if update is false', () => {
    const { result } = renderHook(() => usePausable(true, pauseCallback, resumeCallback))

    act(() => {
      result.current.pause(false)
    })
    expect(result.current.isActive()).toBe(false)
    expect(pauseCallback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.resume(false)
    })
    expect(result.current.isActive()).toBe(true)
    expect(resumeCallback).toHaveBeenCalledTimes(1)
  })
})
