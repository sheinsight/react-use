import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBluetooth } from '../index'

describe('useBluetooth', () => {
  let mockBluetooth: {
    requestDevice: any
  }

  beforeEach(() => {
    mockBluetooth = {
      requestDevice: vi.fn(),
    }

    // Mock navigator.bluetooth
    Object.defineProperty(global.navigator, 'bluetooth', {
      value: mockBluetooth,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return isSupported as true when bluetooth is available', () => {
    const { result } = renderHook(() => useBluetooth())
    expect(result.current.isSupported).toBe(true)
  })

  it('should return isSupported as false when bluetooth is not available', () => {
    // @ts-ignore
    // biome-ignore lint/performance/noDelete: <explanation>
    delete global.navigator.bluetooth

    const { result } = renderHook(() => useBluetooth())
    expect(result.current.isSupported).toBe(false)
  })

  it('should call requestDevice with correct options', async () => {
    const options = {
      filters: [{ services: ['heart_rate'] }],
      optionalServices: ['battery_service'],
    }

    const { result } = renderHook(() => useBluetooth(options))

    mockBluetooth.requestDevice.mockResolvedValue({ gatt: { connect: vi.fn() } })

    await act(async () => {
      await result.current.requestDevice()
    })

    expect(mockBluetooth.requestDevice).toHaveBeenCalledWith({
      acceptAllDevices: false,
      filters: options.filters,
      optionalServices: options.optionalServices,
    })
  })

  it('should update state after successful device request', async () => {
    const mockDevice = { gatt: { connect: vi.fn() } }
    mockBluetooth.requestDevice.mockResolvedValue(mockDevice)

    const { result } = renderHook(() => useBluetooth())

    await act(async () => {
      await result.current.requestDevice()
    })

    expect(result.current.device).toBe(mockDevice)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors during device request', async () => {
    const mockError = new Error('Device request failed')
    mockBluetooth.requestDevice.mockRejectedValue(mockError)

    const { result } = renderHook(() => useBluetooth())

    await act(async () => {
      await result.current.requestDevice()
    })

    expect(result.current.device).toBeUndefined()
    expect(result.current.error).toBe(mockError)
  })

  it('should connect to GATT server when immediate is true', async () => {
    const mockGATTServer = { connected: true, disconnect: vi.fn() }
    const mockDevice = {
      gatt: {
        connect: vi.fn().mockResolvedValue(mockGATTServer),
      },
    }
    mockBluetooth.requestDevice.mockResolvedValue(mockDevice)

    const { result } = renderHook(() => useBluetooth({ immediate: true }))

    await act(async () => {
      await result.current.requestDevice()
    })

    expect(result.current.isConnected).toBe(true)
    expect(result.current.server).toBe(mockGATTServer)
  })

  it('should not connect to GATT server when immediate is false', async () => {
    const mockDevice = {
      gatt: {
        connect: vi.fn(),
      },
    }
    mockBluetooth.requestDevice.mockResolvedValue(mockDevice)

    const { result } = renderHook(() => useBluetooth({ immediate: false }))

    await act(async () => {
      await result.current.requestDevice()
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.server).toBeUndefined()
    expect(mockDevice.gatt.connect).not.toHaveBeenCalled()
  })

  it('should disconnect from GATT server', async () => {
    const mockDisconnect = vi.fn()
    const mockGATTServer = { connected: true, disconnect: mockDisconnect }
    const mockDevice = {
      gatt: {
        connect: vi.fn().mockResolvedValue(mockGATTServer),
        disconnect: mockDisconnect,
      },
    }
    mockBluetooth.requestDevice.mockResolvedValue(mockDevice)

    const { result } = renderHook(() => useBluetooth())

    await act(async () => {
      await result.current.requestDevice()
      await result.current.connect()
    })

    act(() => {
      result.current.disconnect()
    })

    expect(mockDisconnect).toHaveBeenCalled()
    expect(result.current.isConnected).toBe(false)
    expect(result.current.server).toBeUndefined()
  })

  it('should handle errors during connection', async () => {
    const mockError = new Error('Connection failed')
    const mockDevice = {
      gatt: {
        connect: vi.fn().mockRejectedValue(mockError),
      },
    }
    mockBluetooth.requestDevice.mockResolvedValue(mockDevice)

    const { result } = renderHook(() => useBluetooth())

    await act(async () => {
      await result.current.requestDevice()
      await result.current.connect()
    })

    expect(result.current.error).toBe(mockError)
    expect(result.current.isConnected).toBe(false)
    expect(result.current.isConnecting).toBe(false)
  })
})
