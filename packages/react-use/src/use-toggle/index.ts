import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isDefined } from '../utils/basic'
import { unwrapArrayable } from '../utils/unwrap'

import type { ReactSetState } from '../use-safe-state'

export interface UseToggleReturnsActions<O, T> {
  /**
   * Toggle the state between the left and right values.
   */
  toggle(): void
  /**
   * Set the state to the left value.
   */
  setLeft(): void
  /**
   * Set the state to the right value.
   */
  setRight(): void
  /**
   * Set the state to a new value.
   */
  setState: ReactSetState<O | T>
}

export type UseToggleReturns<O, T> = readonly [O | T, UseToggleReturnsActions<O, T>]

/**
 * A React Hook for managing togglable states.
 */
export function useToggle(one: true): UseToggleReturns<true, false>
export function useToggle(one: false): UseToggleReturns<false, true>
export function useToggle(one: boolean, theOther?: boolean): UseToggleReturns<boolean, boolean>
export function useToggle<O, T>(maybeTuple: readonly [one: O, theOther: T]): UseToggleReturns<O, T>
export function useToggle<O, T>(maybeTuple: O | T | readonly [one: O, theOther: T]): UseToggleReturns<O, T> {
  const [one, theOther] = unwrapArrayable(maybeTuple) as [O, T]
  const [state, setState] = useSafeState<O | T>(one)
  const latest = useLatest({ one, theOther: isDefined(theOther) ? theOther : (!one as T) })

  const toggle = useStableFn(() => {
    const { one, theOther } = latest.current
    setState((prev) => (prev === one ? theOther : one))
  })

  const setLeft = useStableFn(() => setState(latest.current.one))
  const setRight = useStableFn(() => setState(latest.current.theOther))
  const actions = useCreation(() => ({ setLeft, toggle, setRight, setState }))

  return [state, actions] as const
}
