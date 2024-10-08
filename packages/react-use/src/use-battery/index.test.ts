import { describe, expect, it } from 'vitest'
import { useBattery } from './index'

describe('useBattery', () => {
  it('should defined', () => {
    expect(useBattery).toBeDefined()
  })
})
