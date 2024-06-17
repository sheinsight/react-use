import { useRef } from 'react'
import { useLatest } from '../use-latest'

import type { AnyFunc, WithThis } from '../utils/basic'

/**
 * Return a version of the function that is stable, which means its memory address will never change.
 */
export function useStableFn<T extends AnyFunc>(fn: T): T {
  const latestFn = useLatest(fn)

  const stableFnRef = useRef<WithThis<T>>(function (this, ...args) {
    return latestFn.current.apply(this, args)
  })

  return stableFnRef.current as T
}
