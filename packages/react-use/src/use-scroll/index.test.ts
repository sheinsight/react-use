import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useScroll } from './index'

describe('useScroll', () => {
  it('should defined', () => {
    expect(useScroll).toBeDefined()
  })

  it('should return initial value', async () => {
    const { result } = renderHook(() => useScroll('body'))
    expect(result.current.x).toBe(0)
    expect(result.current.y).toBe(0)
  })
})
