import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useElementByPoint } from './index'

describe('useElementByPoint', () => {
  it('should defined', () => {
    expect(useElementByPoint).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useElementByPoint({ x: 0, y: 0 }))
    expect(result.current.element).toBe(null)
    expect(result.current.isSupported).toBe(false)
  })
})
