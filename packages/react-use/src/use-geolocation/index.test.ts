import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useGeolocation } from './index'

describe('useGeolocation', () => {
  it('should defined', () => {
    expect(useGeolocation).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useGeolocation())

    expect(result.current.latitude).toBe(null)
    expect(result.current.longitude).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.isLocating).toBe(false)
  })
})
