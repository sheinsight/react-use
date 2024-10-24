import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useDraggable } from './index'

describe('useDraggable', () => {
  it('should defined', () => {
    expect(useDraggable).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useDraggable('body'))

    expect(result.current.isDragging).toEqual(false)
    expect(result.current.x).toEqual(0)
    expect(result.current.y).toEqual(0)
    expect(result.current.style).toMatchInlineSnapshot(`
      {
        "left": 0,
        "position": "fixed",
        "top": 0,
      }
    `)
    expect(result.current.position).toEqual({ x: 0, y: 0 })
    expect(result.current.containerStyle).toMatchInlineSnapshot(`
      {
        "position": "relative",
      }
    `)
  })
})
