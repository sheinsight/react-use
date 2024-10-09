import { useEffect } from 'react'
import { useSafeState } from '../use-safe-state'
import { normalizeElement, useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export type UseParentElementReturns = HTMLElement | null

/**
 * A React Hook that track the parent element of an element.
 */
export function useParentElement<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
): UseParentElementReturns {
  const el = useTargetElement<T>(target)
  const [parent, setParent] = useSafeState<HTMLElement | null>(null)

  useEffect(() => {
    setParent(el.current ? getParentElement(el.current) : null)
  }, [el.current])

  return parent
}

function getParentElement<T extends HTMLElement>(target: ElementTarget<T>): T | null {
  const el = normalizeElement(target)
  return (el?.parentElement ?? null) as T
}
