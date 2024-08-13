import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'
import { isDefined } from '../utils/basic'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils/basic'

export interface UseResetStateOptions extends UseSafeStateOptions {}

/**
 * A React Hook similar to [React.useState](https://react.dev/reference/react/useState), but it additionally provides a `reset` function to reset the state back to the initial value.
 */
export function useResetState<T>(
  initialState: Gettable<T>,
  options?: UseResetStateOptions,
): readonly [T, ReactSetState<T>, (initialState?: T) => void, T]
export function useResetState<T = undefined>(): readonly [
  T | undefined,
  ReactSetState<T | undefined>,
  (initialState?: T) => void,
  T | undefined,
]
export function useResetState<T>(initialState?: Gettable<T>, options?: UseResetStateOptions) {
  const [init, setInit] = useSafeState(initialState, options)
  const latest = useLatest({ init })
  const [state, setState] = useSafeState<T | undefined>(init, options)

  const reset = useStableFn((newVal?: T) => {
    if (isDefined(newVal)) {
      setInit(newVal)
      setState(newVal)
    } else {
      setState(latest.current.init)
    }
  })

  useUpdateEffect(() => setInit(initialState), [initialState])

  return [state, setState, reset, init] as const
}
