import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useClipboardItems } from './index'

describe('useClipboardItems', () => {
  it('should defined', () => {
    expect(useClipboardItems).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useClipboardItems())

    expect(result.current.isSupported).toEqual(false)
    expect(result.current.content).toEqual([])
    expect(result.current.copied).toEqual(false)
    expect(result.current.copy).toBeInstanceOf(Function)
    expect(result.current.clear).toBeInstanceOf(Function)
  })
})
