import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMounted } from './index'

describe('useMounted', () => {
  let result: any

  beforeEach(() => {
    result = renderHook(() => useMounted())
  })

  afterEach(() => {
    result.unmount()
  })

  it('should defined', () => {
    expect(useMounted).toBeDefined()
  })

  it('should return true when mount', () => {
    expect(result.result.current()).toBe(true)
  })

  it('should return false after unmount', () => {
    expect(result.result.current()).toBe(true)
    result.unmount()
    expect(result.result.current()).toBe(false)
  })
})
