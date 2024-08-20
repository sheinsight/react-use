import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useLayoutEffectOnce } from '../use-layout-effect-once'
import { isFunction } from '../utils/basic'

import type { AnyFunc } from '../utils/basic'

/**
 * A React Hooks that is similar to <Link to="/reference/use-mount">`useMount`</Link> but use <Link to="/reference/use-isomorphic-layout-effect">`useIsomorphicLayoutEffect`</Link> under the hood.
 *
 * Usually, you should use `useLayoutMount` instead of `useMount` if you want to run some code that may affect the layout in the next frame.
 *
 * `strictOnce` option is **NOT** recommended as it [damages](https://react.dev/learn/synchronizing-with-effects#dont-use-refs-to-prevent-effects-from-firing) the original intention of the **Strict Mode** of React 18.
 *
 * @param callback The callback to run when the component is mounted (useLayoutEffect).
 * @param strictOnce If `true`, the callback will only be executed once. NOTE: **NOT** recommended.
 * @returns {void} `void`
 *
 */
export function useLayoutMount(callback?: AnyFunc | null | undefined | false, strictOnce = false): void {
  const isMountedOnceRef = useRef(false)
  const latest = useLatest({ callback })

  useLayoutEffectOnce(() => {
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
