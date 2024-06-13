import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useUnmount } from '../use-unmount'
import { useUpdateEffect } from '../use-update-effect'

export interface BluetoothRequestDeviceOptions {
  /**
   * An array of filter objects indicating the properties of devices that will be matched.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice#filters
   */
  filters?: BluetoothLEScanFilter[] | undefined
  /**
   * A list of services that the application wishes to access on the remote device.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTService/uuid
   */
  optionalServices?: BluetoothServiceUUID[] | undefined
}

export interface UseBluetoothOptions extends BluetoothRequestDeviceOptions {
  /**
   * Whether to accept all devices
   *
   * @default false
   */
  acceptAllDevices?: boolean
  /**
   * Whether to connect immediately
   *
   * @default true
   */
  immediate?: boolean
}

export interface UseBlueToothReturn {
  /**
   * Whether the device is connected
   */
  isConnected: boolean
  /**
   * Whether the device is connecting
   */
  isConnecting: boolean
  /**
   * The error that occurred while connecting
   */
  error: unknown | null
  /**
   * The GATT server
   */
  server: BluetoothRemoteGATTServer | undefined
  /**
   * The device
   */
  device: BluetoothDevice | undefined
  /**
   * Connect to the Bluetooth GATT server
   */
  connect(): Promise<BluetoothRemoteGATTServer | undefined>
  /**
   * Disconnect from the Bluetooth GATT server
   */
  disconnect(): void
  /**
   * Whether the browser supports the Web Bluetooth API
   */
  isSupported: boolean
  /**
   * Request a Bluetooth device
   */
  requestDevice(): Promise<BluetoothDevice | undefined>
}

export function useBluetooth(options?: UseBluetoothOptions): UseBlueToothReturn {
  const { filters, immediate = true, optionalServices, acceptAllDevices = false } = options || {}

  const isSupported = useSupported(() => 'bluetooth' in navigator)

  const [state, setState] = useSetState(
    {
      isConnected: false,
      isConnecting: false,
      error: null as unknown | null,
      server: undefined as BluetoothRemoteGATTServer | undefined,
      device: undefined as BluetoothDevice | undefined,
    },
    { deep: true },
  )

  const latest = useLatest({ ...state, isSupported, immediate, acceptAllDevices, filters, optionalServices })

  const requestDevice = useStableFn(async () => {
    const { filters, isSupported, optionalServices, acceptAllDevices } = latest.current

    if (!isSupported) return

    let error: unknown | null = null
    let device = undefined

    const findAll = filters && filters.length > 0 ? false : acceptAllDevices

    setState({ error })

    try {
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: findAll,
        filters,
        optionalServices,
      })
    } catch (err) {
      error = err
    } finally {
      setState({ error, device })
    }

    return device
  })

  const connectToBluetoothGATTServer = useStableFn(async () => {
    const { device } = latest.current

    if (!device || !device.gatt) return

    let error = null
    let server = undefined

    setState({ error, isConnecting: true })

    try {
      server = await device.gatt.connect()
    } catch (err) {
      error = err
    } finally {
      setState({
        server,
        error,
        isConnecting: false,
        isConnected: !!server?.connected,
      })
    }

    return server
  })

  const disconnect = useStableFn(() => {
    latest.current.server?.disconnect()
    setState({ isConnected: false, server: undefined })
  })

  useUnmount(disconnect)

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when state.device changes
  useUpdateEffect(() => {
    immediate && connectToBluetoothGATTServer()

    return disconnect
  }, [state.device, immediate])

  return {
    ...state,
    connect: connectToBluetoothGATTServer,
    disconnect,
    isSupported,
    requestDevice,
  }
}
