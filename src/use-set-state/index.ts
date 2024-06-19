import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isFunction } from '../utils/basic'

import type { UseSafeStateOptions } from '../use-safe-state'
import type { Gettable, PureObject } from '../utils/basic'

export type UseSetStateSetMergedState<T extends PureObject> = <K extends keyof T>(
  state: Partial<Pick<T, K>> | null | ((pre: Readonly<T>) => Partial<Pick<T, K>> | T | null),
) => void

export interface UseSetStateOptions extends UseSafeStateOptions {}

export function useSetState<T extends PureObject>(
  initialState: Gettable<T>,
  options: UseSetStateOptions = {},
): [T, UseSetStateSetMergedState<T>] {
  const [state, _setState] = useSafeState<T>(initialState, options)

  const setState: UseSetStateSetMergedState<T> = useStableFn((patch) => {
    return _setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch
      return newState ? Object.assign({}, prevState, newState) : prevState
    })
  })

  return [state, setState] as const
}
