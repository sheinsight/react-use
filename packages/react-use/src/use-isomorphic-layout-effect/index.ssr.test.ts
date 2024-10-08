import { useEffect } from 'react'
import { describe, expect, test } from 'vitest'
import { useIsomorphicLayoutEffect } from './index'

// @vitest-environment node
describe('useIsomorphicLayoutEffect SSR', () => {
  test('should use useEffect in node/SSR', () => {
    expect(useIsomorphicLayoutEffect).toBe(useEffect)
  })
})
