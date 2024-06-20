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
   * If true, only update the state when the new state is different from the old state.
   *
   * @defaultValue false
   */
  deep?: boolean
}

export function useSafeState<T>(initialState: Gettable<T>, options?: UseSafeStateOptions): [T, ReactSetState<T>]
export function useSafeState<T = undefined>(): [T | undefined, ReactSetState<T | undefined>]
export function useSafeState<T>(initialState?: Gettable<T>, options?: UseSafeStateOptions) {
  const { deep = false } = options ?? {}
  const isUnmounted = useUnmounted()
  const [state, setState] = useState<T | undefined>(initialState)
  const latest = useLatest({ state, deep })

  const setSafeState: ReactSetState<T | undefined> = useStableFn((action) => {
    /**
     * @see https://github.com/reactwg/react-18/discussions/82
     */
    if (!isReact18OrLater && isUnmounted()) return

    const { state, deep } = latest.current

    if (!deep) {
      setState(action)
    } else {
      const newState = isFunction(action) ? action(state) : action
      !deepEqual(state, newState) && setState(newState)
    }
  })

  return [state, setSafeState] as const
}
