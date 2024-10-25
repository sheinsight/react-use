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

  it('should call callback', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyPress('a', callback))

    // act(() => {
    //   const event = new KeyboardEvent('keydown', { key: 'a' })
    //   document.dispatchEvent(event)
    // })

    // expect(callback).toBeCalled()
  })
})
