import { useRef } from 'react'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export function useVersionedAction() {
  const versionRef = useRef(0)

  const incVersion = useStableFn(() => ++versionRef.current)

  const runVersionedAction = useStableFn((version: number, handler: AnyFunc) => {
    if (version !== versionRef.current) return
    return handler()
  })

  return [incVersion, runVersionedAction] as const
}
