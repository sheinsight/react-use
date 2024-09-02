import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { isFunction } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

/**
 * A React Hook that runs a function only once when the component mounts.
 *
 * `strictOnce` option is **NOT** recommended as it [damages](https://react.dev/learn/synchronizing-with-effects#dont-use-refs-to-prevent-effects-from-firing) the original intention of the **Strict Mode** of React 18.
 *
 * @param callback The callback to run when the component is mounted.
 * @param strictOnce If `true`, the callback will only be executed once. NOTE: **NOT** recommended.
 * @returns {void} `void`
 *
 */
export function useMount(callback?: AnyFunc | null | undefined | false, strictOnce = false): void {
  const isMountedOnceRef = useRef(false)
  const latest = useLatest({ callback })

  useEffectOnce(() => {
    if (!latest.current) return

    if (strictOnce) {
      /**
       * use `ref` to mark to prevent effect re-executed in the `strict mode` of React 18.
       *
       * @see https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
       */
      if (!isMountedOnceRef.current) {
        isMountedOnceRef.current = true

        if (isFunction(latest.current.callback)) {
          latest.current.callback()
        }
      }
    } else {
      if (isFunction(latest.current.callback)) {
        latest.current.callback()
      }
    }
  })
}
