import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useReportingObserver } from './index'

describe('useReportingObserver', () => {
  it('should defined', () => {
    expect(useReportingObserver).toBeDefined()
  })

  it('should return initial value', async () => {
    const { result } = renderHook(() => useReportingObserver(() => {}))

    expect(result.current.isSupported).toBe(false)
  })
})
