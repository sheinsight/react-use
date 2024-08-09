import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'
import { useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export interface UseInputCompositionState {
  /**
   * Whether the input is in the composition state.
   */
  isComposing: boolean
  /**
   * The composition data.
   */
  data: string
}

export interface UseInputCompositionReturns extends UseInputCompositionState {}

/**
 * A hook to get the composition state of an input element.
 *
 * @since 1.4.0
 */
export function useInputComposition<T extends HTMLElement>(target: ElementTarget<T>): UseInputCompositionReturns {
  const [state, setState] = useSafeState<UseInputCompositionState>({ isComposing: false, data: '' })

  const inputEl = useTargetElement(target)

  useEventListener(inputEl, ['compositionstart', 'compositionupdate'], (event: CompositionEvent) =>
    setState({ isComposing: true, data: event.data }),
  )

  useEventListener(inputEl, 'compositionend', () => setState({ isComposing: false, data: '' }))

  return state
}
