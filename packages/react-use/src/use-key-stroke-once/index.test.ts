import { describe, expect, it } from 'vitest'
import { useKeyStrokeOnce } from './index'

describe('useKeyStrokeOnce', () => {
  it('should defined', () => {
    expect(useKeyStrokeOnce).toBeDefined()
  })
})
