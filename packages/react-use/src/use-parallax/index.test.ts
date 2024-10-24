import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useParallax } from './index'

describe('useParallax', () => {
  it('should defined', () => {
    expect(useParallax).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useParallax('body'))

    expect(result.current.roll).toBe(0)
    expect(result.current.tilt).toBe(0)
    expect(result.current.elementStyle).toBeInstanceOf(Function)
    expect(result.current.containerStyle).toBeInstanceOf(Function)
  })
})
