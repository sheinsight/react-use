import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { throttle } from './throttle'

import type { Mock } from 'vitest'

describe('throttle', () => {
  let fn: Mock
  let throttledFn: any

  beforeEach(() => {
    fn = vi.fn()
    vi.useFakeTimers()
    throttledFn = throttle(fn, { wait: 100 })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should invoke the function immediately on the first call', () => {
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not invoke the function again until the wait time has passed', async () => {
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(20)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should invoke the function at the end of the wait period if trailing is true', async () => {
    throttledFn()
    await vi.advanceTimersByTimeAsync(50)
    expect(fn).toHaveBeenCalledTimes(1)

    throttledFn()
    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should clear the timeout when clear is called', async () => {
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    throttledFn.clear()
    throttledFn()
    await vi.advanceTimersByTimeAsync(20)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(3)

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    await vi.advanceTimersByTimeAsync(200)

    expect(fn).toHaveBeenCalledTimes(5)

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn.clear()
    expect(fn).toHaveBeenCalledTimes(6)
    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(6)
  })

  it('should handle `leading` `true` and `trailing` `false` correctly', async () => {
    throttledFn = throttle(fn, { wait: 100, leading: true, trailing: false })
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(200)
    throttledFn()
    await vi.advanceTimersByTimeAsync(10)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should handle `leading` `false` and `trailing` `true` correctly', async () => {
    throttledFn = throttle(fn, { wait: 100, leading: false, trailing: true })
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(1)

    throttledFn()
    await vi.advanceTimersByTimeAsync(10)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle system time changes', async () => {
    const spyDateNow = vi.spyOn(Date, 'now')
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)
    spyDateNow.mockReturnValueOnce(0)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(3)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(3)
    await vi.advanceTimersByTimeAsync(1_000)
    expect(fn).toHaveBeenCalledTimes(4)
  })
})
