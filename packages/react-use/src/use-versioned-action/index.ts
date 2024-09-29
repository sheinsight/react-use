import { useRef } from 'react'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export type UseVersionedActionReturns = readonly [
  /**
   * Increase the version
   */
  incVersion: () => object,
  /**
   * Run the action with the specified version
   */
  runVersionedAction: <T extends AnyFunc>(version: object, handler: T) => ReturnType<T> | undefined,
]

export function useVersionedAction(): UseVersionedActionReturns {
  const versionRef = useRef({})

  const incVersion = useStableFn(() => {
    versionRef.current = {}
    return versionRef.current
  })

  const runVersionedAction = useStableFn(<T extends AnyFunc>(version: object, handler: T) => {
    if (version !== versionRef.current) return
    return handler() as ReturnType<T>
  })

  return [incVersion, runVersionedAction] as const
}
