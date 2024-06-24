import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isDefined } from '../utils/basic'
import { unwrapArrayable } from '../utils/unwrap'

import type { ReactSetState } from '../use-safe-state'

export interface UseToggleReturnActions<O, T> {
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

export type UseToggleReturns<O, T> = [O | T, () => void, UseToggleReturnActions<O, T>]

/**
 * A React Hook that helps to manage a togglable state.
 *
 * If you need to manage a state that alternates among several values, consider utilizing [useCircularList](https://sheinsight.github.io/react-use/reference/use-circular-list) as an alternative.
 */
export function useToggle(one: true): UseToggleReturns<true, false>
export function useToggle(one: false): UseToggleReturns<false, true>
export function useToggle(one: boolean, theOther?: boolean): UseToggleReturns<boolean, boolean>
export function useToggle<O, T>(maybeTuple: [one: O, theOther: T]): UseToggleReturns<O, T>
export function useToggle<O, T>(maybeTuple: O | T | [one: O, theOther: T]): UseToggleReturns<O, T> {
  const [one, theOther] = unwrapArrayable(maybeTuple) as [O, T]
  const [state, setState] = useSafeState<O | T>(one)
  const latest = useLatest({ one, theOther: isDefined(theOther) ? theOther : (!one as T) })

  const toggle = useStableFn(() => {
    const { one, theOther } = latest.current
    setState((prev) => (prev === one ? theOther : one))
  })

  const setLeft = useStableFn(() => setState(latest.current.one))
  const setRight = useStableFn(() => setState(latest.current.theOther))
  const actions = useCreation(() => ({ setLeft, setRight, setState }))

  return [state, toggle, actions] as const
}
