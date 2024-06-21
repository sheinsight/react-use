import { useRafFn } from '../use-raf-fn'
import { useSafeState } from '../use-safe-state'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils/basic'

export interface UseRafStateOptions extends UseSafeStateOptions {}

/**
 * A React Hook like [React.useState](https://react.dev/reference/react/useState),
 * but the state will only update on the next frame using [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for better performance.
 */
export function useRafState<T>(initialState: Gettable<T>, options?: UseRafStateOptions): [T, ReactSetState<T>]
export function useRafState<T = undefined>(): [T | undefined, ReactSetState<T | undefined>]
export function useRafState<T>(initialState?: Gettable<T>, options?: UseRafStateOptions) {
  const [state, setState] = useSafeState(initialState, options)
  return [state, useRafFn(setState)] as const
}
