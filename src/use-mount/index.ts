import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'

import type { AnyFunc } from '../utils/basic'

/**
 * A React Hook that runs a function only once when the component mounts.
 *
 * **Strict Once** option is **NOT** recommended as it [damages](https://react.dev/learn/synchronizing-with-effects#dont-use-refs-to-prevent-effects-from-firing) the original intention of React 18's strict mode.
 *
 * @param callback The callback to run when the component is mounted.
 * @param strictOnce If `true`, the callback will only be executed once.
 * @returns {void} `void`
 *
 */
export function useMount(callback?: AnyFunc | null | undefined | false, strictOnce = false): void {
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
