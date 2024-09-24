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

  it('should not invoke the function again until the wait time has passed', () => {
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(20)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should invoke the function at the end of the wait period if trailing is true', () => {
    throttledFn()
    vi.advanceTimersByTime(50)
    throttledFn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should clear the timeout when clear is called', () => {
    throttledFn()
    throttledFn.clear()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    vi.advanceTimersByTime(200)

    expect(fn).toHaveBeenCalledTimes(3)

    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn.clear()
    vi.advanceTimersByTime(200)

    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('should handle leading and trailing options correctly', () => {
    throttledFn = throttle(fn, { wait: 100, leading: true, trailing: false })
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(100)
    throttledFn()
    expect(fn).toHaveBeenCalledTimes(3)
  })
})
