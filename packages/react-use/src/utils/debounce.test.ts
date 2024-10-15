import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type DebouncedFn, debounce } from './debounce'

import type { Mock } from 'vitest'
import type { AnyFunc } from './basic'

describe('debounce', () => {
  let fn: Mock
  let debounced: DebouncedFn<AnyFunc>

  beforeEach(() => {
    fn = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should invoke the function after the wait time', () => {
    debounced = debounce(fn, { wait: 100 })
    debounced()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalled()
  })

  it('should invoke leading function when leading is true', () => {
    debounced = debounce(fn, { wait: 100, leading: true })
    debounced()
    expect(fn).toHaveBeenCalled()
  })

  it('should support a `maxWait` option', () => {
    const debounced = debounce(fn, { maxWait: 64, wait: 32 })
    debounced()
    debounced()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(128)
    expect(fn).toHaveBeenCalledTimes(1)
    debounced()
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(128)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should handle maxWait correctly', () => {
    const debounced = debounce(fn, {
      wait: 200,
      maxWait: 200,
      leading: false,
      trailing: true,
    })

    debounced()

    vi.advanceTimersByTime(190)
    debounced()

    vi.advanceTimersByTime(10)
    debounced()

    vi.advanceTimersByTime(10)
    debounced()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should cancel `maxDelayed` when `delayed` is invoked', () => {
    const debounced = debounce(fn, {
      wait: 32,
      maxWait: 64,
      leading: false,
      trailing: true,
    })

    debounced()

    vi.advanceTimersByTime(128)
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(64)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should not invoke leading function when leading is false', () => {
    debounced = debounce(fn, { wait: 100, leading: false })
    debounced()
    expect(fn).not.toHaveBeenCalled()
  })

  it('should invoke trailing function when trailing is true', () => {
    debounced = debounce(fn, { wait: 100, trailing: true })
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalled()
  })

  it('should not invoke trailing function when trailing is false', () => {
    debounced = debounce(fn, { wait: 100, trailing: false })
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should clear timeout when clear is called', () => {
    debounced = debounce(fn, { wait: 100 })
    debounced()
    debounced.clear()
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should flush pending calls when flush is called', () => {
    debounced = debounce(fn, { wait: 100 })
    debounced()
    debounced.flush()
    expect(fn).toHaveBeenCalled()
  })

  it('should handle multiple calls correctly', () => {
    debounced = debounce(fn, { wait: 100 })
    debounced()
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should invoke immediately if leading is true and wait is 0', () => {
    debounced = debounce(fn, { wait: 0, leading: true })
    debounced()
    expect(fn).toHaveBeenCalled()
  })

  it('should not invoke if both leading and trailing are false', () => {
    debounced = debounce(fn, { wait: 100, leading: false, trailing: false })
    debounced()
    expect(fn).not.toHaveBeenCalled()
  })
})
