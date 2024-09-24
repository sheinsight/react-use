import { useState } from 'react'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUnmounted } from '../use-unmounted'
import { isFunction, isReact18OrLater } from '../utils/basic'
import { deepEqual } from '../utils/equal'

import type { Dispatch, SetStateAction } from 'react'
import type { Gettable } from '../utils/basic'

export type ReactSetState<T> = Dispatch<SetStateAction<T>>

export type UseSafeStateOptions = {
  /**
   * Deeply compare the new state with the old state before updating.
   *
   * If true, only update the state when the new state is different from the old state.
   *
   * @defaultValue false
   */
  deep?: boolean
}

/**
 * A React Hook similar to [React.useState](https://react.dev/reference/react/useState), but suppresses false warning reports in `React <= 17`
 *
 * And includes an optional deep comparison feature (`deep`, default is `false`). It is designed as a safe and efficient alternative to `React.useState`.
 */
export function useSafeState<T>(
  initialState: Gettable<T>,
  options?: UseSafeStateOptions,
): readonly [T, ReactSetState<T>]
export function useSafeState<T = undefined>(): readonly [T | undefined, ReactSetState<T | undefined>]
export function useSafeState<T>(initialState?: Gettable<T>, options?: UseSafeStateOptions) {
  const { deep = false } = options ?? {}
  const isUnmounted = useUnmounted()
  const [state, setState] = useState<T | undefined>(initialState)
  const latest = useLatest({ deep })

  const setSafeState: ReactSetState<T | undefined> = useStableFn((action) => {
    /**
     * @see https://github.com/reactwg/react-18/discussions/82
     */
    if (!isReact18OrLater && isUnmounted()) return

    const { deep } = latest.current

    if (!deep) {
      setState(action)
    } else {
      setState((pre) => {
        const newState = isFunction(action) ? action(pre) : action
        return !deepEqual(pre, newState) ? newState : pre
      })
    }
  })

  return [state, setSafeState] as const
}
