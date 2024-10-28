import { act, renderHook } from '@/test'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useForm } from './index'

describe('useForm', () => {
  const initialValue = { name: '', email: '' }

  let onChangeMock: Mock
  let onSubmitMock: Mock
  let onResetMock: Mock

  beforeEach(() => {
    onChangeMock = vi.fn()
    onSubmitMock = vi.fn()
    onResetMock = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useForm({ initialValue }))

    expect(result.current.value).toEqual(initialValue)
    expect(result.current.initialValue).toEqual(initialValue)
  })

  it('should call onChange when value changes', () => {
    const { result } = renderHook(() => useForm({ initialValue, onChange: onChangeMock }))

    act(() => {
      result.current.setFieldValue('name', 'John Doe')
    })

    expect(onChangeMock).toHaveBeenCalledWith({ name: 'John Doe', email: '' })
    expect(result.current.value).toEqual({ name: 'John Doe', email: '' })
  })

  it('should call onSubmit when form is submitted', async () => {
    onSubmitMock.mockResolvedValue('ok')
    const { result } = renderHook(() => useForm({ initialValue, onSubmit: onSubmitMock }))
    expect(result.current.submitting).toBe(false)

    await act(async () => {
      result.current.submit()
      expect(result.current.submitting).toBe(true)
    })

    expect(result.current.submitting).toBe(false)
    expect(onSubmitMock).toHaveBeenCalledWith(initialValue)
  })

  it('should call onReset when form is reset', () => {
    const { result } = renderHook(() => useForm({ initialValue, onReset: onResetMock }))

    act(() => {
      result.current.reset()
    })

    expect(onResetMock).toHaveBeenCalled()
    expect(result.current.value).toEqual(initialValue)
  })

  it('should prevent default when submitting if preventDefaultWhenSubmit is true', () => {
    const { result } = renderHook(() => useForm({ initialValue, preventDefaultWhenSubmit: true }))

    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() }
    act(() => {
      result.current.nativeProps.onSubmit(event as never)
    })

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
  })

  it('should check form validity', () => {
    const { result } = renderHook(() => useForm({ initialValue }))

    act(() => {
      result.current.checkValidity()
    })

    expect(result.current.checkValidity()).toBe(false) // Assuming the form is invalid initially
  })

  it('should report form validity', () => {
    const { result } = renderHook(() => useForm({ initialValue }))

    act(() => {
      result.current.reportValidity()
    })

    expect(result.current.reportValidity()).toBe(false) // Assuming the form is invalid initially
  })

  it('should handle chechValidity and reportValidity', () => {
    const checkFn = vi.fn().mockReturnValue(false)
    const { result } = renderHook(() => useForm({ initialValue }))

    // @ts-ignore for test
    result.current.nativeProps.ref.current = {
      checkValidity: checkFn,
      reportValidity: checkFn,
    }

    expect(checkFn).toHaveBeenCalledTimes(0)

    expect(result.current.checkValidity()).toBe(false)
    expect(checkFn).toHaveBeenCalledTimes(1)

    expect(result.current.reportValidity()).toBe(false)
    expect(checkFn).toHaveBeenCalledTimes(2)
  })

  it('should handle triggerOnChangeWhenReset true', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValue,
        onChange: onChangeMock,
        triggerOnChangeWhenReset: true,
      }),
    )

    act(() => {
      result.current.setFieldValue('name', 'John Doe')
    })

    expect(onChangeMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.reset()
    })

    expect(onChangeMock).toHaveBeenCalledTimes(3)
  })

  it('should handle triggerOnChangeWhenReset false', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValue,
        onChange: onChangeMock,
        triggerOnChangeWhenReset: false,
      }),
    )

    act(() => {
      result.current.setFieldValue('name', 'John Doe')
    })

    expect(onChangeMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.reset()
    })

    expect(onChangeMock).toHaveBeenCalledTimes(2)
  })
})
