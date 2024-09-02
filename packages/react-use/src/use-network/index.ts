import { useEffect, useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { now } from '../utils/basic'

export type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'
export type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined

export interface UseNetworkReturns {
  /**
   * Whether the browser supports the Network Information API.
   */
  isSupported: boolean
  /**
   * Whether the user is currently connected.
   */
  isOnline: boolean
  /**
   * The time since the user was last connected.
   */
  offlineAt: number | undefined
  /**
   * At this time, if the user is offline and reconnects.
   */
  onlineAt: number | undefined
  /**
   * download speed in Mbps.
   */
  downlink: number | undefined
  /**
   * The max reachable download speed in Mbps.
   */
  downlinkMax: number | undefined
  /**
   * The detected effective speed type.
   */
  effectiveType: NetworkEffectiveType | undefined
  /**
   * The estimated effective round-trip time of the current connection.
   */
  rtt: number | undefined
  /**
   * If the user activated data saver mode.
   */
  saveData: boolean | undefined
  /**
   * The detected connection/network type. Only supported in Web Worker in Chrome.
   *
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/NetworkInformation/type
   */
  type: NetworkType
}

interface ExtendedNavigator extends Navigator {
  connection?: {
    downlink: number
    downlinkMax: number
    effectiveType: NetworkEffectiveType
    rtt: number
    saveData: boolean
    type: NetworkType
    addEventListener: (type: 'change', listener: () => void) => void
    removeEventListener: (type: 'change', listener: () => void) => void
    dispatchEvent: (event: Event) => boolean
  }
}

/**
 * A React Hook that tracks network status.
 */
export function useNetwork(): UseNetworkReturns {
  const isSupported = useSupported(() => 'connection' in navigator)
  const connectionRef = useRef<ExtendedNavigator['connection'] | null>(null)

  const [state, setState] = useSetState({
    isOnline: true,
    offlineAt: undefined as number | undefined,
    onlineAt: 0 as number | undefined,
    downlink: undefined as number | undefined,
    downlinkMax: undefined as number | undefined,
    effectiveType: undefined as NetworkEffectiveType,
    rtt: undefined as number | undefined,
    saveData: undefined as boolean | undefined,
    type: 'unknown' as NetworkType,
  })

  const updateNetworkInformation = useStableFn(() => setState(getNetwork()))

  useEffect(() => {
    if (!isSupported) return
    connectionRef.current = (navigator as ExtendedNavigator)?.connection
    updateNetworkInformation()
  }, [isSupported])

  useEventListener(connectionRef, 'change', updateNetworkInformation, false)
  useEventListener(() => window, ['offline', 'online'], updateNetworkInformation)

  return { isSupported, ...state }
}

function getNetwork(): Omit<UseNetworkReturns, 'isSupported'> {
  return {
    isOnline: navigator.onLine,
    offlineAt: navigator.onLine ? undefined : now(),
    onlineAt: navigator.onLine ? now() : undefined,
    downlink: (navigator as ExtendedNavigator)?.connection?.downlink,
    downlinkMax: (navigator as ExtendedNavigator)?.connection?.downlinkMax,
    effectiveType: (navigator as ExtendedNavigator)?.connection?.effectiveType,
    rtt: (navigator as ExtendedNavigator)?.connection?.rtt,
    saveData: (navigator as ExtendedNavigator)?.connection?.saveData,
    type: (navigator as ExtendedNavigator)?.connection?.type ?? 'unknown',
  }
}
