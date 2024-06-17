import { useRafFn } from '../use-raf-fn'
import { useSafeState } from '../use-safe-state'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils/basic'

export interface UseRafStateOptions extends UseSafeStateOptions {}

export function useRafState<T>(initialState: Gettable<T>, options?: UseRafStateOptions): [T, ReactSetState<T>]
export function useRafState<T = undefined>(): [T | undefined, ReactSetState<T | undefined>]
export function useRafState<T>(initialState?: Gettable<T>, options?: UseRafStateOptions) {
  const [state, setState] = useSafeState(initialState, options)
  return [state, useRafFn(setState)] as const
}
