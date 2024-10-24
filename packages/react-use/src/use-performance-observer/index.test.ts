import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { usePerformanceObserver } from './index'

describe('usePerformanceObserver', () => {
  it('should defined', () => {
    expect(usePerformanceObserver).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() =>
      usePerformanceObserver(() => {}, {
        entryTypes: ['measure'], // newer node support `measure`
      }),
    )

    expect(result.current.isSupported).toBe(true) // this may be false in older node/browser
    expect(result.current.observerRef.current).toBeInstanceOf(PerformanceObserver)
  })

  it('should return initial value', () => {
    expect(() => {
      renderHook(() => usePerformanceObserver(() => {}, { entryTypes: [] }))
    }).toThrowErrorMatchingInlineSnapshot('[Error: usePerformanceObserver: entryTypes must be an array and not empty.]')
  })
})
