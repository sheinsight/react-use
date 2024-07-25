import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useAsyncLock } from './index'

describe('useAsyncLock', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useAsyncLock(async () => {}))
    expect(typeof result.current).toBe('function')
  })

  it('should execute the async function', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useAsyncLock(asyncFn))
    await act(async () => {
      await result.current()
    })
    expect(asyncFn).toHaveBeenCalled()
  })

  it('should return the result of the async function', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useAsyncLock(asyncFn))
    let resultValue: string | undefined
    await act(async () => {
      resultValue = await result.current()
    })
    expect(resultValue).toBe('result')
  })

  it('should execute the onMeetLock callback when lock is met', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result')
    const onMeetLock = vi.fn()
    const { result } = renderHook(() => useAsyncLock(asyncFn, onMeetLock))
    await act(async () => {
      result.current()
      result.current()
      result.current()
      result.current()
    })
    expect(onMeetLock).toHaveBeenCalledTimes(3)
  })

  it('should return the result of the onMeetLock callback', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result')
    const onMeetLock = vi.fn().mockReturnValue('callback result')
    const { result } = renderHook(() => useAsyncLock(asyncFn, onMeetLock))
    let resultValue: Promise<string | undefined> | string | undefined
    await act(async () => {
      result.current()
      result.current()
      resultValue = result.current()
    })
    resultValue = resultValue instanceof Promise ? await resultValue : resultValue
    expect(resultValue).toBe('callback result')
  })
})
