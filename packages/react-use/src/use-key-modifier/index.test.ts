import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useKeyModifier } from './index'

describe('useKeyModifier', () => {
  let originalGetModifierState: (key: string) => boolean
  const mockGetModifierState = vi.fn()

  beforeEach(() => {
    mockGetModifierState.mockReturnValue(true)
    originalGetModifierState = KeyboardEvent.prototype.getModifierState
    KeyboardEvent.prototype.getModifierState = mockGetModifierState
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    KeyboardEvent.prototype.getModifierState = originalGetModifierState
  })

  it('should defined', () => {
    expect(useKeyModifier).toBeDefined()
  })

  it('should return initial value when no modifier is pressed', () => {
    const { result } = renderHook(() => useKeyModifier('Control', { initial: false }))
    expect(result.current).toBe(false)
  })

  it('should return true when Control key is pressed', () => {
    const { result } = renderHook(() => useKeyModifier('Control'))

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Control' })
      document.dispatchEvent(event)
    })

    expect(result.current).toBe(true)
  })

  it('should return false when Control key is released', () => {
    const { result } = renderHook(() => useKeyModifier('Control'))

    act(() => {
      const downEvent = new KeyboardEvent('keydown', { key: 'Control' })
      document.dispatchEvent(downEvent)
    })

    expect(result.current).toBe(true)

    mockGetModifierState.mockReturnValue(false)

    act(() => {
      const upEvent = new KeyboardEvent('keyup', { key: 'Control' })
      document.dispatchEvent(upEvent)
    })

    expect(result.current).toBe(false)
  })

  it('should handle multiple modifier keys', () => {
    const { result } = renderHook(() => useKeyModifier('Shift'))

    act(() => {
      const downEvent = new KeyboardEvent('keydown', { key: 'Shift' })
      document.dispatchEvent(downEvent)
    })

    expect(result.current).toBe(true)

    mockGetModifierState.mockReturnValue(false)

    act(() => {
      const upEvent = new KeyboardEvent('keyup', { key: 'Shift' })
      document.dispatchEvent(upEvent)
    })

    expect(result.current).toBe(false)
  })

  it('should respect custom events', () => {
    const { result } = renderHook(() => useKeyModifier('Alt', { events: ['mousedown', 'mouseup'] }))

    act(() => {
      const downEvent = new MouseEvent('mousedown', { button: 0 })
      document.dispatchEvent(downEvent)
    })

    expect(result.current).toBe(false)

    act(() => {
      const upEvent = new MouseEvent('mouseup', { button: 0 })
      document.dispatchEvent(upEvent)
    })

    expect(result.current).toBe(false)
  })

  it('should return initial value when no events are triggered', () => {
    const { result } = renderHook(() => useKeyModifier('Meta', { initial: true }))
    expect(result.current).toBe(true)
  })
})
