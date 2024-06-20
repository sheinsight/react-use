import { useRef } from 'react'
import { useAsyncEffect } from '../use-async-effect'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePermission } from '../use-permission'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'

export interface UseDeviceListOptions {
  /**
   * Callback when devices are updated
   */
  onUpdated?: (devices: MediaDeviceInfo[]) => void
  /**
   * Request for permissions immediately if it's not granted,
   * otherwise label and deviceIds could be empty
   *
   * @defaultValue false
   */
  requestPermissions?: boolean
  /**
   * Request for types of media permissions
   *
   * @defaultValue { audio: true, video: true }
   */
  constraints?: MediaStreamConstraints
}

export interface UseDeviceListReturns {
  /**
   * List of all devices
   */
  devices: MediaDeviceInfo[]
  /**
   * a getter to get all video inputs
   */
  videoInputs: MediaDeviceInfo[]
  /**
   * a getter to get all audio inputs
   */
  audioInputs: MediaDeviceInfo[]
  /**
   * a getter to get all audio outputs
   */
  audioOutputs: MediaDeviceInfo[]
  /**
   * a boolean to check if permission is granted
   */
  isPermissionGranted: boolean
  /**
   * a function to check if the browser supports the API
   */
  isSupported: boolean
  /**
   * a function to request for permissions to access the media devices
   */
  ensurePermission(): Promise<boolean>
  /**
   * a function to update the list of devices
   */
  update(): Promise<void>
}

export function useDeviceList(options: UseDeviceListOptions = {}): UseDeviceListReturns {
  const { requestPermissions = false, constraints = { audio: true, video: true }, onUpdated } = options

  const [state, setState] = useSetState({
    devices: [] as MediaDeviceInfo[],
    isPermissionGranted: false as boolean,
  })

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices#browser_compatibility
  const isSupported = useSupported(() => 'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices)
  const latest = useLatest({ ...state, isSupported, onUpdated, constraints })
  const streamRef = useRef<MediaStream | null>(null)

  const update = useStableFn(async () => {
    if (!latest.current.isSupported) return

    const devices = (await navigator.mediaDevices.enumerateDevices()) || []

    setState({ devices })

    latest.current.onUpdated?.(devices)

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }
      streamRef.current = null
    }
  })

  const permission = usePermission('camera', { immediate: false, controls: true })

  const ensurePermission = useStableFn(async () => {
    const { isSupported, isPermissionGranted, constraints } = latest.current

    if (!isSupported) return false
    if (isPermissionGranted) return true

    await permission.query()

    if (permission.stateRef.current !== 'granted') {
      streamRef.current = await navigator.mediaDevices.getUserMedia(constraints)
    }

    setState({ isPermissionGranted: true })

    await update()

    return true
  })

  useEventListener(isSupported ? () => navigator.mediaDevices : null, 'devicechange', update)

  useAsyncEffect(async () => {
    if (isSupported && requestPermissions) {
      await ensurePermission()
    }
  }, [isSupported, requestPermissions])

  return {
    ...state,
    videoInputs: filterDevice(state.devices, 'videoinput'),
    audioInputs: filterDevice(state.devices, 'audioinput'),
    audioOutputs: filterDevice(state.devices, 'audiooutput'),
    ensurePermission,
    isSupported,
    update,
  }
}

function filterDevice(devices: MediaDeviceInfo[], type: string) {
  return devices.filter((i) => i.kind === type)
}
