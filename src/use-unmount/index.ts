import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { isFunction } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

export function useUnmount(callback?: AnyFunc | null | undefined | false) {
  const latest = useLatest(callback)

  useEffectOnce(() => {
    return () => {
      if (isFunction(latest.current)) {
        latest.current()
      }
    }
  })
}
