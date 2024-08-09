import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncFn } from './index'

describe('useAsyncFn', () => {
  it('should run the async function and return the result', async () => {
    const asyncFn = async () => 'result'
    const { result } = renderHook(() => useAsyncFn(asyncFn))

    expect(result.current.value).toBe(undefined)

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.value).toBe('result')
  })

  it('should store errors thrown by the async function', async () => {
    const asyncFn = async () => {
      throw new Error('error')
    }

    const { result } = renderHook(() => useAsyncFn(asyncFn))

    await act(async () => {
      try {
        await result.current.run()
      } catch {}
    })

    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('should return loading state properly', async () => {
    const asyncFn = async () => 'result'
    const { result } = renderHook(() => useAsyncFn(asyncFn))

    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.run()
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.loading).toBe(false)
  })

  it('should clear the error when running the async function again', async () => {
    let errorThrown = false

    const asyncFn = async () => {
      if (!errorThrown) {
        errorThrown = true
        throw new Error('error')
      }
    }

    const { result } = renderHook(() => useAsyncFn(asyncFn))

    await act(async () => {
      try {
        await result.current.run()
      } catch {}
    })

    expect(result.current.error).toBeInstanceOf(Error)

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.error).toBe(undefined)
  })
})
