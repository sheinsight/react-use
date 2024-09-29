import { describe, expect, it } from 'vitest'
import { usePerformanceObserver } from './index'

describe('usePerformanceObserver', () => {
  it('should defined', () => {
    expect(usePerformanceObserver).toBeDefined()
  })
})
