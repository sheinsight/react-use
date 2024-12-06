import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useKeyPress } from './index'

describe('useKeyPress', () => {
  it('should defined', () => {
    expect(useKeyPress).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useKeyPress('a'))
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should call callback', async () => {
    const callback = vi.fn()
    renderHook(() => useKeyPress('a', callback, { target: 'body' }))

    await act(async () => {
      const event = new KeyboardEvent('keypress', { key: 'a' })
      document.body.dispatchEvent(event)
    })

    expect(callback).toBeCalledTimes(1)
  })
})
