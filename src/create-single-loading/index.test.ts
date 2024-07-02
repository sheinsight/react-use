import { renderHook } from '@/test'
import { create } from '@shined/reactive'
import { describe, expect, it, vi } from 'vitest'
import { createSingleLoading } from './index'

describe('createSingleLoading', () => {
  it('should return an object with the correct shape', () => {
    const loading = createSingleLoading({ create })
    expect(loading).toEqual(
      expect.objectContaining({
        useAsyncFn: expect.any(Function),
        useLoading: expect.any(Function),
        set: expect.any(Function),
        get: expect.any(Function),
        bind: expect.any(Function),
      }),
    )
  })

  it('should set the loading state correctly', () => {
    const loading = createSingleLoading({ create })

    const { result, rerender } = renderHook(() => loading.useLoading())
    expect(result.current).toBe(false)

    loading.set(true)
    rerender()
    expect(result.current).toBe(true)

    loading.set(false)
    rerender()
    expect(result.current).toBe(false)
  })

  it('should bind the loading state to an async function correctly', () => {
    const loading = createSingleLoading({ create })
    const asyncFn = vi.fn()
    const boundFn = loading.bind(asyncFn)
    expect(boundFn).not.toBe(asyncFn)
    expect(asyncFn).not.toHaveBeenCalled()
    boundFn()
    expect(asyncFn).toHaveBeenCalled()
  })

  it('should return the loading state correctly', () => {
    const loading = createSingleLoading({ create })
    expect(loading.get()).toBe(false)
    loading.set(true)
    expect(loading.get()).toBe(true)
    loading.set(false)
    expect(loading.get()).toBe(false)
  })

  it('should reset the loading state on error if resetOnError option is true', async () => {
    const loading = createSingleLoading({ create, resetOnError: true })
    expect(loading.get()).toBe(false)
    loading.set(true)
    expect(loading.get()).toBe(true)

    try {
      const fetchWithError = loading.bind(async () => {
        throw new Error('mock error')
      })
      await fetchWithError()
    } catch {}

    expect(loading.get()).toBe(false)
  })

  it('should not reset the loading state on error if resetOnError option is false', async () => {
    const loading = createSingleLoading({ create, resetOnError: false })
    expect(loading.get()).toBe(false)
    loading.set(true)
    expect(loading.get()).toBe(true)

    try {
      const fetchWithError = loading.bind(async () => {
        throw new Error('mock error')
      })
      await fetchWithError()
    } catch {}

    expect(loading.get()).toBe(true)
  })

  it('should initialize the loading state correctly', () => {
    const loading = createSingleLoading({ create, initialState: true })
    expect(loading.get()).toBe(true)
  })

  it('should useAsyncFn correctly', async () => {
    const loading = createSingleLoading({ create })
    const asyncFn = vi.fn()
    const { result, rerender } = renderHook(() => loading.useAsyncFn(asyncFn))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.value).toBe(undefined)

    asyncFn.mockResolvedValue('mock value')

    await result.current.run()

    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.value).toBe('mock value')

    asyncFn.mockRejectedValue(new Error('mock error'))

    try {
      await result.current.run()
    } catch {}

    rerender()

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toEqual(new Error('mock error'))
    expect(result.current.value).toBe(undefined)
  })
})
