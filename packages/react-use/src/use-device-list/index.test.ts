import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useDeviceList } from './index'

describe('useDeviceList', () => {
  it('should defined', () => {
    expect(useDeviceList).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useDeviceList())

    expect(result.current.isSupported).toEqual(false)
    expect(result.current.devices).toEqual([])
    expect(result.current.audioInputs).toEqual([])
    expect(result.current.audioOutputs).toEqual([])
    expect(result.current.videoInputs).toEqual([])
    expect(result.current.update).toBeInstanceOf(Function)
    expect(result.current.isPermissionGranted).toBe(false)
    expect(result.current.ensurePermission).toBeInstanceOf(Function)
  })
})
