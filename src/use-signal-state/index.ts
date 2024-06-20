import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils/basic'

export interface UseSignalStateOptions extends UseSafeStateOptions {}

export type UseSignalStateReturns<T> = [() => T, ReactSetState<T>]

export function useSignalState<T>(state: Gettable<T>, options: UseSignalStateOptions = {}): UseSignalStateReturns<T> {
  const [_state, setState] = useSafeState(state, options)
  const stateRef = useLatest(_state)
  const stateGetter = useStableFn(() => stateRef.current)
  return [stateGetter, setState] as const
}
