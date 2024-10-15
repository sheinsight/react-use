import { act, renderHook } from '@/test'
import { create } from '@shined/reactive'
import { describe, expect, it, vi } from 'vitest'
import { createSingleLoading } from './index'

describe('createSingleLoading', () => {
  it('should be defined and be a function', () => {
    expect(createSingleLoading).toBeDefined()
    expect(createSingleLoading).toBeInstanceOf(Function)
  })

  it('should throw an error if the create function is not provided', () => {
    expect(() => createSingleLoading({} as any)).toThrowError(
      'Please provide the `create` function from `@shined/reactive`',
    )
  })

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

  it('should set the loading state correctly', async () => {
    const loading = createSingleLoading({ create })

    const { result } = renderHook(() => loading.useLoading())
    expect(result.current).toBe(false)

    await act(async () => loading.set(true))
    expect(result.current).toBe(true)

    await act(async () => loading.set(false))
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
    const { result } = renderHook(() => loading.useAsyncFn(asyncFn))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(undefined)
    expect(result.current.value).toBe(undefined)

    asyncFn.mockResolvedValue('mock value')

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(undefined)
    expect(result.current.value).toBe('mock value')

    asyncFn.mockRejectedValue(new Error('mock error'))

    await act(async () => {
      try {
        await result.current.run()
      } catch {}
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toEqual(new Error('mock error'))
    expect(result.current.value).toBe('mock value')
  })
})
