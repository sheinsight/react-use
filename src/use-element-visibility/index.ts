import { useIntersectionObserver } from '../use-intersection-observer'
import { useSafeState } from '../use-safe-state'
import { useTargetElement } from '../use-target-element'

import type { UseIntersectionObserverOptions } from '../use-intersection-observer'
import type { ElementTarget } from '../use-target-element'

export interface UseElementVisibilityOptions extends Pick<UseIntersectionObserverOptions, 'threshold'> {
  /**
   * The root passed to the IntersectionObserver
   */
  scrollTarget?: ElementTarget
  /**
   * A callback function that will be called when the visibility of the target element changes
   */
  onChange?: (visibility: boolean) => void
}

export function useElementVisibility(target: ElementTarget, options: UseElementVisibilityOptions = {}): boolean {
  const { scrollTarget, threshold = 0, onChange } = options

  const scrollEl = useTargetElement(scrollTarget)
  const [visibility, setVisibility] = useSafeState(false)

  useIntersectionObserver(
    target,
    (intersectionObserverEntries) => {
      let time = 0
      let isIntersecting = false
      for (const entry of intersectionObserverEntries) {
        if (entry.time >= time) {
          time = entry.time
          isIntersecting = entry.isIntersecting
        }
      }
      onChange?.(isIntersecting)
      setVisibility(isIntersecting)
    },
    { root: scrollEl.current, threshold },
  )

  return visibility
}
