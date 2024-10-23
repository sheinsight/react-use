import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useBattery } from './index'

describe('useBattery', () => {
  it('should defined', () => {
    expect(useBattery).toBeDefined()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useBattery())

    expect(result.current.level).toBe(1)
    expect(result.current.charging).toBe(false)
    expect(result.current.chargingTime).toBe(0)
    expect(result.current.dischargingTime).toBe(0)
  })
})
