import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useStepper } from './index'

describe('useStepper', () => {
  let steps: string[]

  beforeEach(() => {
    steps = ['step1', 'step2', 'step3']
  })

  it('should initialize with the correct values', () => {
    const { result } = renderHook(() => useStepper(steps))

    expect(result.current.index).toBe(0)
    expect(result.current.current).toBe('step1')
    expect(result.current.isFirst).toBe(true)
    expect(result.current.isLast).toBe(false)
  })

  it('should go to the next step', () => {
    const { result } = renderHook(() => useStepper(steps))

    act(() => {
      result.current.goToNext()
    })

    expect(result.current.index).toBe(1)
    expect(result.current.current).toBe('step2')
  })

  it('should go to the previous step', () => {
    const { result } = renderHook(() => useStepper(steps))

    expect(result.current.index).toBe(0)

    act(() => {
      result.current.goToNext()
      result.current.goToPrevious()
    })

    expect(result.current.index).toBe(0)
    expect(result.current.current).toBe('step1')
  })

  it('should go to a specific step', () => {
    const { result } = renderHook(() => useStepper(steps))

    act(() => {
      result.current.goTo('step3')
    })

    expect(result.current.index).toBe(2)
    expect(result.current.current).toBe('step3')
  })

  it('should not go to a non-existent step', () => {
    const { result } = renderHook(() => useStepper(steps))

    act(() => {
      result.current.goTo('step4') // Non-existent step
    })

    expect(result.current.index).toBe(0) // Should remain at the initial step
  })

  it('should check if a step is next', () => {
    const { result } = renderHook(() => useStepper(steps))

    expect(result.current.isNext('step2')).toBe(true)
    expect(result.current.isNext('step3')).toBe(false)

    act(() => {
      result.current.goToNext()
    })

    expect(result.current.isNext('step2')).toBe(false)
    expect(result.current.isNext('step3')).toBe(true)
  })

  it('should check if a step is previous', () => {
    const { result } = renderHook(() => useStepper(steps))

    act(() => {
      result.current.goToNext()
    })

    expect(result.current.isPrevious('step1')).toBe(true)
    expect(result.current.isPrevious('step3')).toBe(false)
  })

  it('should check if a step is current', () => {
    const { result } = renderHook(() => useStepper(steps))

    expect(result.current.isCurrent('step1')).toBe(true)
    expect(result.current.isCurrent('step2')).toBe(false)

    act(() => {
      result.current.goToNext()
    })

    expect(result.current.isCurrent('step2')).toBe(true)
  })

  it('should check if the current step is first or last', () => {
    const { result } = renderHook(() => useStepper(steps))

    expect(result.current.isFirst).toBe(true)
    expect(result.current.isLast).toBe(false)

    act(() => {
      result.current.goTo('step3')
    })

    expect(result.current.isFirst).toBe(false)
    expect(result.current.isLast).toBe(true)
  })
})
