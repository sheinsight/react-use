import { describe, expect, it } from 'vitest'
import { useBrowserMemory } from './index'

describe('useBrowserMemory', () => {
  it('should defined', () => {
    expect(useBrowserMemory).toBeDefined()
  })
})
