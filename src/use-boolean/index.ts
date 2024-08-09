import { useCreation } from '../use-creation'
import { useToggle } from '../use-toggle'

import type { ReactSetState } from '../use-safe-state'

export type UseBooleanActions = {
  /**
   * Set the boolean state to `true`.
   */
  setTrue: () => void
  /**
   * Set the boolean state to `false`.
   */
  setFalse: () => void
  /**
   * Set the boolean state to the given value.
   */
  setState: ReactSetState<boolean>
  /**
   * Toggle the boolean state.
   */
  toggle: () => void
}

export type UseBooleanReturns = readonly [value: boolean, UseBooleanActions]

/**
 * A hook to manage a boolean state.
 *
 * @param {boolean} [initialValue=true] The initial value of the boolean state.
 *
 */
export function useBoolean(initialValue: boolean = true): UseBooleanReturns {
  const [value, _actions] = useToggle(initialValue)

  const actions = useCreation(() => ({
    setTrue: () => _actions.setState(true),
    setFalse: () => _actions.setState(false),
    setState: _actions.setState,
    toggle: _actions.toggle,
  }))

  return [value, actions] as const
}
