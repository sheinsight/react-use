import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useWebSocket } from './index'

describe('useWebSocket', () => {
  it('should defined', () => {
    expect(useWebSocket).toBeDefined()
  })

  it('should return initial value', async () => {
    const { result } = renderHook(() => useWebSocket('ws://this.is.not.exist'))

    expect(result.current.send).toBeInstanceOf(Function)
    expect(result.current.close).toBeInstanceOf(Function)
  })
})
