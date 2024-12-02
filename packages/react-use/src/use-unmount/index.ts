import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { isFunction } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

/**
 * A React Hook that helps to run a callback when the component unmounts.
 */
export function useUnmount(callback?: AnyFunc | null | undefined | false): void {
  const latest = useLatest(callback)

  useEffectOnce(() => {
    return () => {
      if (isFunction(latest.current)) {
        latest.current()
      }
    }
  })
}
