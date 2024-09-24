import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useInputComposition } from './index'

describe('useInputComposition', () => {
  let target: HTMLElement

  beforeEach(() => {
    target = document.createElement('input')
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.body.removeChild(target)
  })

  it('should initialize with isComposing as false and empty data', () => {
    const { result } = renderHook(() => useInputComposition(target))
    expect(result.current.isComposing).toBe(false)
    expect(result.current.data).toBe('')
  })

  it('should set isComposing to true and update data on compositionstart', () => {
    const { result } = renderHook(() => useInputComposition(target))
    act(() => {
      target.dispatchEvent(new CompositionEvent('compositionstart', { data: 'Hello' }))
    })
    expect(result.current.isComposing).toBe(true)
    expect(result.current.data).toBe('Hello')
  })

  it('should update data on compositionupdate', () => {
    const { result } = renderHook(() => useInputComposition(target))
    act(() => {
      target.dispatchEvent(new CompositionEvent('compositionstart', { data: 'Hello' }))
      target.dispatchEvent(new CompositionEvent('compositionupdate', { data: 'Hello, World' }))
    })
    expect(result.current.isComposing).toBe(true)
    expect(result.current.data).toBe('Hello, World')
  })

  it('should set isComposing to false and clear data on compositionend', () => {
    const { result } = renderHook(() => useInputComposition(target))
    act(() => {
      target.dispatchEvent(new CompositionEvent('compositionstart', { data: 'Hello' }))
      target.dispatchEvent(new CompositionEvent('compositionend'))
    })
    expect(result.current.isComposing).toBe(false)
    expect(result.current.data).toBe('')
  })
})
