import { useCallback, useRef } from 'react'
import { useRafFn } from '../use-raf-fn'
import { useSafeState } from '../use-safe-state'
import { isFunction } from '../utils/basic'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils/basic'

export interface UseRafStateOptions extends UseSafeStateOptions {}

/**
 * A React Hook that uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to update the state in the next frame for better performance.
 *
 * This Hook works similarly to [React.useState](https://react.dev/reference/react/useState), except for the timing of updates.
 */
export function useRafState<T>(initialState: Gettable<T>, options?: UseRafStateOptions): readonly [T, ReactSetState<T>]
export function useRafState<T = undefined>(): readonly [T | undefined, ReactSetState<T | undefined>]
export function useRafState<T>(initialState?: Gettable<T>, options?: UseRafStateOptions) {
  const [state, setState] = useSafeState(initialState, options)
  const stateRef = useRef(state)

  const scheduleSet = useRafFn(setState, true)

  const set = useCallback<typeof setState>(
    (value) => {
      stateRef.current = isFunction(value) ? value(stateRef.current) : value
      scheduleSet(() => stateRef.current)
    },
    [scheduleSet],
  )

  return [state, set] as const
}
