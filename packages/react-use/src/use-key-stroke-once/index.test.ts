import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useKeyStrokeOnce } from './index'

describe('useKeyStrokeOnce', () => {
  it('should defined', () => {
    expect(useKeyStrokeOnce).toBeDefined()
  })

  it('should return initial value', () => {
    const callback = vi.fn()

    renderHook(() => useKeyStrokeOnce('a', callback))

    expect(callback).toHaveBeenCalledTimes(0)

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)
    })

    expect(callback).toHaveBeenCalledTimes(1) // should not be called again
  })
})
