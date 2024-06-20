import { useEffect } from 'react'
import { useSafeState } from '../use-safe-state'
import { normalizeElement, useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export type UseParentElementReturns = HTMLElement | null

export function useParentElement<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
): UseParentElementReturns {
  const el = useTargetElement<T>(target)
  const [parent, setParent] = useSafeState<HTMLElement | null>(null)

  useEffect(() => {
    if (!el.current) return
    setParent(getParentElement(el.current))
  }, [el.current])

  return parent
}

function getParentElement<T extends HTMLElement>(target: ElementTarget<T>): T | null {
  const el = normalizeElement(target)
  return (el?.parentElement ?? null) as T
}
