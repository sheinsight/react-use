import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLoremIpsum } from './index'

describe('useLoremIpsum', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should defined', () => {
    expect(useLoremIpsum).toBeDefined()
  })

  it('should return default lorem ipsum text when no arguments are provided', () => {
    const { result } = renderHook(() => useLoremIpsum())
    expect(result.current).toBeDefined()
  })

  it('should return lorem ipsum text with specified sentence ends', () => {
    const { result } = renderHook(() => useLoremIpsum({ length: 5, sentenceEnds: ['.', '!', '?'] }))
    expect(result.current).toMatch(/[.!?]$/)
  })

  it('should maintain stable value between renders when stable is true', () => {
    const { result, rerender } = renderHook(({ stable }) => useLoremIpsum({ stable }), {
      initialProps: { stable: true },
    })
    const initialValue = result.current
    rerender({ stable: true })
    expect(result.current).toBe(initialValue)
  })

  it('should not maintain stable value between renders when stable is false', () => {
    const { result, rerender } = renderHook(({ stable }) => useLoremIpsum({ stable }), {
      initialProps: { stable: false },
    })
    const initialValue = result.current
    rerender({ stable: false })
    expect(result.current).not.toBe(initialValue)
  })

  it('should handle invalid input gracefully', () => {
    const { result } = renderHook(() => useLoremIpsum({ length: -1 }))
    expect(result.current).toBeDefined() // Ensure it does not throw
  })
})
