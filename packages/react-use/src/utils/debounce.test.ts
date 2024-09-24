import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
  let fn: Mock
  let debounced: ((...args: any[]) => void) & { clear(): void }

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

  it('should handle multiple calls correctly', () => {
    debounced = debounce(fn, { wait: 100 })
    debounced()
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1) // Only the last call should be invoked
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
