import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'
import { isFunction } from '../utils/basic'

import type { WindowEventName } from '../utils/basic'

export type KeyModifier =
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Symbol'
  | 'SymbolLock'

const defaultEvents: WindowEventName[] = ['mousedown', 'mouseup', 'keydown', 'keyup']

export interface UseModifierOptions<Initial> {
  /**
   * Event names that will prompt update to modifier states
   *
   * @defaultValue ['mousedown', 'mouseup', 'keydown', 'keyup']
   */
  events?: WindowEventName[]
  /**
   * Initial value of the returned ref
   *
   * @defaultValue null
   */
  initial?: Initial
}

export type UseKeyModifierReturns<Initial> = Initial extends boolean ? boolean : boolean | null

export function useKeyModifier<Initial extends boolean | null>(
  modifier: KeyModifier,
  options: UseModifierOptions<Initial> = {},
): UseKeyModifierReturns<Initial> {
  const { events = defaultEvents, initial = null } = options
  const [state, setState] = useSafeState(initial as boolean)

  useEventListener(
    () => document,
    events,
    (evt: KeyboardEvent | MouseEvent | Event) => {
      if ('getModifierState' in evt && isFunction(evt.getModifierState)) {
        setState(evt.getModifierState(modifier))
      }
    },
  )

  return state
}
