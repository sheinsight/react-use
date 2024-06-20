import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isDefined } from '../utils/basic'

import type { ReactSetState } from '../use-safe-state'

export interface UseToggleReturnActions<O, T> {
  setLeft(): void
  setRight(): void
  setState: ReactSetState<O | T>
}

export type UseToggleReturns<O, T> = [O | T, () => void, UseToggleReturnActions<O, T>]

export function useToggle(one: true, theOther?: false): UseToggleReturns<true, false>
export function useToggle(one: false, theOther?: true): UseToggleReturns<false, true>
export function useToggle(one: boolean, theOther?: boolean): UseToggleReturns<boolean, boolean>
export function useToggle<O, T>(one: O, theOther: T): UseToggleReturns<O, T>
export function useToggle<O, T>(one: O, theOther: T): UseToggleReturns<O, T> {
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
