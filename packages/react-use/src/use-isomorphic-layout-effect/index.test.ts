import { useLayoutEffect } from 'react'
import { describe, expect, test } from 'vitest'
import { useIsomorphicLayoutEffect } from './index'

describe('useIsomorphicLayoutEffect', () => {
  test('should use useLayoutEffect in Browser', () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect)
  })
})
