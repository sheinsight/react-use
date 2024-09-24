import { useActiveElement } from '../use-active-element'
import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'
import { useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

/**
 * A React Hook that returns a boolean value indicating whether the component is focused or any of its children are focused.
 */
export function useFocusWithin(target: ElementTarget): boolean {
  const el = useTargetElement(target)
  const activeElement = useActiveElement()
  const [focused, setFocused] = useSafeState(false)

  useEventListener(el, 'focusin', () => setFocused(true))

  useEventListener(el, 'focusout', () => setFocused(false))

  return activeElement ? focused : false
}
