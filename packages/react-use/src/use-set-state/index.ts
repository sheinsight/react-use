import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isFunction } from '../utils/basic'

import type { UseSafeStateOptions } from '../use-safe-state'
import type { Gettable, PureObject } from '../utils/basic'

export type UseSetStateSetMergedState<T extends PureObject> = <K extends keyof T>(
  state: Partial<Pick<T, K>> | null | ((pre: Readonly<T>) => Partial<Pick<T, K>> | T | null),
) => void

export interface UseSetStateOptions extends UseSafeStateOptions {}

export type UseSetStateReturns<T extends PureObject> = readonly [T, UseSetStateSetMergedState<T>]

/**
 * A React Hook that uses the React Class Component's `this.setState` method for state management.
 */
export function useSetState<T extends PureObject>(
  initialState: Gettable<T>,
  options: UseSetStateOptions = {},
): UseSetStateReturns<T> {
  const [state, _setState] = useSafeState<T>(initialState, options)

  const setState: UseSetStateSetMergedState<T> = useStableFn((patch) => {
    return _setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch
      const isChanged = Boolean(newState && Object.keys(newState).length)
      return isChanged ? Object.assign({}, prevState, newState) : prevState
    })
  })

  return [state, setState] as const
}
