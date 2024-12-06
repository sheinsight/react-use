import { useEffect, useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { createSingletonPromise, isString } from '../utils/basic'

import type { RefObject } from 'react'

type DescriptorNamePolyfill =
  | 'accelerometer'
  | 'accessibility-events'
  | 'ambient-light-sensor'
  | 'background-sync'
  | 'camera'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'gyroscope'
  | 'magnetometer'
  | 'microphone'
  | 'notifications'
  | 'payment-handler'
  | 'persistent-storage'
  | 'push'
  | 'speaker'

export type GeneralPermissionDescriptor = PermissionDescriptor | { name: DescriptorNamePolyfill }
export type PermissionDesc = GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'] | false

export interface UsePermissionOptions<Controls extends boolean> {
  /**
   * Expose more controls
   *
   * @defaultValue false
   */
  controls?: Controls
  /**
   * Whether to query immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   *
   */
  onStateChange?: (state: PermissionState) => void
}

export type UsePermissionReturns<Controls extends boolean> = Controls extends true
  ? {
      /**
       * if the permission is supported
       */
      isSupported: boolean
      /**
       * Query the permission status
       */
      stateRef: RefObject<PermissionState | null>
      /**
       * Query the permission status
       */
      query(): Promise<PermissionStatus | null>
    }
  : RefObject<PermissionState | null>

/**
 * A React Hook that helps to query the permission status of a browser feature.
 */
export function usePermission(
  permissionDesc: PermissionDesc,
  options?: UsePermissionOptions<false>,
): UsePermissionReturns<false>
export function usePermission(
  permissionDesc: PermissionDesc,
  options: UsePermissionOptions<true>,
): UsePermissionReturns<true>
export function usePermission(
  permissionDesc: PermissionDesc,
  options: UsePermissionOptions<boolean> = {},
): UsePermissionReturns<boolean> {
  const { controls: exposeControls = false, immediate = true, onStateChange } = options

  const desc = permissionDesc
    ? isString(permissionDesc)
      ? ({ name: permissionDesc } as PermissionDescriptor)
      : (permissionDesc as PermissionDescriptor)
    : false

  const isSupported = useSupported(() => 'permissions' in navigator)
  const permissionStatusRef = useRef<PermissionStatus | null>(null)
  const stateRef = useRef<PermissionState | null>(null)

  const latest = useLatest({ isSupported, desc: desc as PermissionDescriptor | false })

  const onPermissionStatusChange = useStableFn(() => {
    const { state } = permissionStatusRef.current || {}
    const preState = stateRef.current
    if (state && preState !== state) {
      stateRef.current = state
      onStateChange?.(stateRef.current)
    }
  })

  const requestPermission = useStableFn(
    createSingletonPromise(async () => {
      const { desc } = latest.current

      if (!desc) return null

      if (!permissionStatusRef.current) {
        try {
          permissionStatusRef.current = await navigator.permissions.query(desc)
          onPermissionStatusChange()
        } catch {
          stateRef.current = 'prompt'
          onPermissionStatusChange()
        }
      }

      return permissionStatusRef.current
    }),
  )

  const query = useStableFn(() => {
    const { desc, isSupported } = latest.current

    if (!isSupported || !desc) {
      return Promise.resolve(null)
    }

    return requestPermission()
  })

  useEffect(() => {
    if (isSupported) {
      immediate && query()
    }
  }, [isSupported, immediate])

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when desc changes
  useUpdateDeepCompareEffect(() => void query(), [desc])

  useEventListener(permissionStatusRef, 'change', onPermissionStatusChange)

  return exposeControls ? { stateRef, isSupported, query } : stateRef
}
