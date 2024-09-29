import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTrackedRefState } from './index'

describe('useTrackedRefState', () => {
  let initialState: { count: number; name: string }

  beforeEach(() => {
    initialState = { count: 0, name: 'test' }
  })

  it('should initialize state correctly', () => {
    const { result } = renderHook(() => useTrackedRefState(initialState))
    const [getters] = result.current

    expect(getters.count).toBe(0)
    expect(getters.name).toBe('test')
  })

  it('should update state correctly', () => {
    const { result } = renderHook(() => useTrackedRefState(initialState))
    const [, actions] = result.current

    act(() => {
      actions.updateRefState('count', 1)
    })

    const [getters] = result.current
    expect(getters.count).toBe(1)
  })

  it('should not update state if value is the same', () => {
    const { result } = renderHook(() => useTrackedRefState(initialState))
    const [, actions] = result.current

    act(() => {
      actions.updateRefState('count', 0) // Same value
    })

    const [getters] = result.current
    expect(getters.count).toBe(0)
  })

  it('should mark key as used', () => {
    const { result } = renderHook(() => useTrackedRefState(initialState))
    const [, actions] = result.current

    act(() => {
      actions.markKeyAsUsed('count')
    })

    const [, , stateRef] = result.current
    expect(stateRef.count.used).toBe(true)
  })

  it('should handle multiple updates', () => {
    const { result } = renderHook(() => useTrackedRefState(initialState))
    const [, actions] = result.current

    act(() => {
      actions.updateRefState('count', 1)
      actions.updateRefState('name', 'updated')
    })

    const [getters] = result.current
    expect(getters.count).toBe(1)
    expect(getters.name).toBe('updated')
  })

  it('should not re-render if value is not used', () => {
    const renderCount = { value: 0 }

    const { result } = renderHook(() => {
      renderCount.value++
      return useTrackedRefState(initialState)
    })

    expect(renderCount.value).toBe(1)

    const [, actions] = result.current

    act(() => {
      actions.updateRefState('count', 1)
    })

    expect(renderCount.value).toBe(1)

    act(() => {
      actions.updateRefState('count', 1)
    })

    expect(renderCount.value).toBe(1)

    act(() => {
      actions.updateRefState('count', 2)
      actions.updateRefState('count', 2)
    })

    expect(renderCount.value).toBe(1)
  })

  it('should re-render if value is used', () => {
    const renderCount = { value: 0 }

    const { result } = renderHook(() => {
      renderCount.value++
      const [{ count }, actions] = useTrackedRefState(initialState)
      return [{ count }, actions] as const
    })

    expect(renderCount.value).toBe(1)

    const [, actions] = result.current

    act(() => {
      actions.updateRefState('count', 1)
    })

    expect(renderCount.value).toBe(2)

    act(() => {
      actions.updateRefState('count', 1)
    })

    expect(renderCount.value).toBe(2)

    act(() => {
      actions.updateRefState('count', 2)
      actions.updateRefState('count', 2)
    })

    expect(renderCount.value).toBe(3)
  })
})
