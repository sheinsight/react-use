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
    expect(fn).toHaveBeenCalledTimes(2) // 1 + leading call

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(3) // 2 + trailing call

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    await vi.advanceTimersByTimeAsync(200)

    expect(fn).toHaveBeenCalledTimes(5) // 3 + leading call + trailing calls

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn.clear()
    expect(fn).toHaveBeenCalledTimes(6) // 5 + leading call
    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(6) // 6
  })

  it('should handle leading and trailing options correctly', async () => {
    throttledFn = throttle(fn, { wait: 100, leading: true, trailing: false })
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(200)
    throttledFn()
    await vi.advanceTimersByTimeAsync(10)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2) // 1 + leading call

    await vi.advanceTimersByTimeAsync(200)
    expect(fn).toHaveBeenCalledTimes(2) // 2

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(3) // 2 + leading call
  })
})
