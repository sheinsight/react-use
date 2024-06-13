import { useEffect } from 'react'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { ReactSetState, UseSafeStateOptions } from '../use-safe-state'
import type { Gettable } from '../utils'

export interface UseResetStateOptions extends UseSafeStateOptions {}

export function useResetState<T>(
  initialState: Gettable<T>,
  options?: UseResetStateOptions,
): [T, ReactSetState<T>, (initialState?: T) => void, T]
export function useResetState<T = undefined>(): [
  T | undefined,
  ReactSetState<T | undefined>,
  (initialState?: T) => void,
  T | undefined,
]
export function useResetState<T>(initialState?: Gettable<T>, options?: UseResetStateOptions) {
  const [init, setInit] = useSafeState(initialState, options)
  const latest = useLatest({ init })
  const [state, setState] = useSafeState<T | undefined>(init)

  const reset = useStableFn((newVal: T | undefined = latest.current.init) => {
    setInit(newVal)
    setState(newVal)
  })

  useEffect(() => setInit(initialState), [initialState])

  return [state, setState, reset, init] as const
}
