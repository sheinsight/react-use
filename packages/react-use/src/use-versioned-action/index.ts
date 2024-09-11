import { useRef } from 'react'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export type UseVersionedActionReturns = readonly [
  /**
   * Increase the version
   */
  incVersion: () => number,
  /**
   * Run the action with the specified version
   */
  runVersionedAction: <T extends AnyFunc>(version: number, handler: T) => ReturnType<T> | undefined,
]

export function useVersionedAction(): UseVersionedActionReturns {
  const versionRef = useRef(0)

  const incVersion = useStableFn(() => ++versionRef.current)

  const runVersionedAction = useStableFn(<T extends AnyFunc>(version: number, handler: T) => {
    if (version !== versionRef.current) return
    return handler() as ReturnType<T>
  })

  return [incVersion, runVersionedAction] as const
}
