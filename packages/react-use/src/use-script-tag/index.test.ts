import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useScriptTag } from './index'

describe('useScriptTag', () => {
  it('should defined', () => {
    expect(useScriptTag).toBeDefined()
  })

  it('should return initial value', async () => {
    const { result } = renderHook(() => useScriptTag('#'))

    await act(async () => {})

    expect(result.current.load).toBeInstanceOf(Function)
    expect(result.current.unload).toBeInstanceOf(Function)
  })
})
