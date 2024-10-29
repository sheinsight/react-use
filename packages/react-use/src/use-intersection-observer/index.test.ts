import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useIntersectionObserver } from './index'

describe('useIntersectionObserver', () => {
  it('should defined', () => {
    expect(useIntersectionObserver).toBeDefined()
  })

  it('should return initial values', () => {
    const { result } = renderHook(() => useIntersectionObserver('body', () => {}))

    expect(result.current.isSupported).toBe(false)
    expect(result.current.observerRef.current).toBe(null)
  })
})
