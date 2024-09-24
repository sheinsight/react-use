import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useControlledComponent } from '../index'

describe('useControlledComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with the given initial value', () => {
    const { result } = renderHook(() => useControlledComponent('initial'))
    expect(result.current.value).toBe('initial')
  })

  it('should update value when setValue is called', () => {
    const { result } = renderHook(() => useControlledComponent('initial'))
    act(() => {
      result.current.setValue('updated')
    })
    expect(result.current.value).toBe('updated')
  })

  it('should call onChange when value changes', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControlledComponent('initial' as string, { onChange }))
    act(() => {
      result.current.setValue('updated')
    })
    expect(onChange).toHaveBeenCalledWith('updated', 'initial')
  })

  it('should reset to initial value when reset is called', () => {
    const onReset = vi.fn()
    const { result } = renderHook(() => useControlledComponent('initial' as string, { onReset }))
    act(() => {
      result.current.setValue('updated')
      result.current.reset()
    })
    expect(result.current.value).toBe('initial')
    expect(onReset).toHaveBeenCalledWith('initial')
  })

  it('should handle event-like objects in onChange', () => {
    const { result } = renderHook(() => useControlledComponent('initial'))
    act(() => {
      result.current.props.onChange({ target: { value: 'event-value' } })
    })
    expect(result.current.value).toBe('event-value')
  })

  it('should use fallbackValue when value is undefined', () => {
    const { result } = renderHook(() => useControlledComponent('initial', { fallbackValue: 'fallback' }))
    act(() => {
      result.current.props.onChange(undefined)
    })
    expect(result.current.value).toBe('fallback')
  })

  it('should handle custom props function', () => {
    const customProps = (value: string) => ({ customProp: `custom-${value}` })
    const { result } = renderHook(() => useControlledComponent('initial' as string, { props: customProps }))
    expect(result.current.props.customProp).toBe('custom-initial')
    act(() => {
      result.current.setValue('updated')
    })
    expect(result.current.props.customProp).toBe('custom-updated')
  })

  it('should handle static custom props', () => {
    const customProps = { staticProp: 'static' }
    const { result } = renderHook(() => useControlledComponent('initial', { props: customProps }))
    expect(result.current.props.staticProp).toBe('static')
  })

  it('should work with non-string types', () => {
    const { result } = renderHook(() => useControlledComponent<number>(0))
    expect(result.current.value).toBe(0)
    act(() => {
      result.current.setValue(42)
    })
    expect(result.current.value).toBe(42)
  })

  it('should maintain stability of returned functions', () => {
    const { result, rerender } = renderHook(() => useControlledComponent('initial'))
    const initialSetValue = result.current.setValue
    const initialReset = result.current.reset
    rerender()
    expect(result.current.setValue).toBe(initialSetValue)
    expect(result.current.reset).toBe(initialReset)
  })
})
