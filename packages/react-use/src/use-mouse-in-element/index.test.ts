import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useMouseInElement } from './index'

describe('useMouseInElement', () => {
  it('should defined', () => {
    expect(useMouseInElement).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useMouseInElement('body'))

    expect(result.current.elementX).toBe(0)
    expect(result.current.elementY).toBe(0)
    expect(result.current.isOutside).toBe(true)
    expect(result.current.elementWidth).toBe(0)
    expect(result.current.elementHeight).toBe(0)
    expect(result.current.elementPositionX).toBe(0)
    expect(result.current.elementPositionY).toBe(0)
    expect(result.current.mouse.x).toBe(0)
    expect(result.current.mouse.y).toBe(0)
    expect(result.current.mouse.sourceType).toBe(null)
    expect(result.current.mouse.stop).toBeInstanceOf(Function)
  })
})
