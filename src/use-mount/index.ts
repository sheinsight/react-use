import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'

import type { AnyFunc } from '../utils/basic'

/**
 * Run the callback when the component is mounted.
 *
 * @param callback The callback to run when the component is mounted.
 * @param strictOnce If `true`, the callback will only be executed once.
 *
 * **Strict Once** option is **NOT** recommended as it [damages](https://react.dev/learn/synchronizing-with-effects#dont-use-refs-to-prevent-effects-from-firing) the original intention of React 18's strict mode.
 */
export function useMount(callback?: AnyFunc | null | undefined | false, strictOnce = false) {
  const isMountedOnceRef = useRef(false)
  const latestCallback = useLatest(callback)

  useEffectOnce(() => {
    if (!latestCallback.current) return

    if (strictOnce) {
      /**
       * use `ref` to mark to prevent effect re-executed in the `strict mode` of React 18.
       *
       * @see https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
       */
      if (!isMountedOnceRef.current) {
        isMountedOnceRef.current = true
        latestCallback.current?.()
      }
    } else {
      latestCallback.current?.()
    }
  })
}
