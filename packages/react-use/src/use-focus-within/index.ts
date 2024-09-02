import { useEffect } from 'react'
import { useActiveElement } from '../use-active-element'
import { useSafeState } from '../use-safe-state'
import { normalizeElement, useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

/**
 * A React Hook that returns a boolean value indicating whether the component is focused or any of its children are focused.
 */
export function useFocusWithin(target: ElementTarget): boolean {
  const el = useTargetElement(target)
  const activeElement = useActiveElement()
  const [focused, setFocused] = useSafeState(false)

  useEffect(() => {
    setFocused(!!(el.current && isFocusWithin(el.current, activeElement)))
  }, [activeElement, el.current])

  return focused
}

function isFocusWithin<T extends Element>(target: ElementTarget<T>, activeEl: Element | null) {
  return Boolean(activeEl && (normalizeElement(target)?.contains(activeEl) ?? false))
}
