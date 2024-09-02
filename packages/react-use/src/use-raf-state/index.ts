import { useRafFn } from '../use-raf-fn'
import { useSafeState } from '../use-safe-state'

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
  return [state, useRafFn(setState)] as const
}
