import { describe, expect, it } from 'vitest'
import { useLoadingSlowFn } from './index'

describe('useLoadingSlowFn', () => {
  it('should defined', () => {
    expect(useLoadingSlowFn).toBeDefined()
  })
})
