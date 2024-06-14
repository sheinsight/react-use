import { useEventListener } from '../use-event-listener'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'

export interface UseActiveElementOptions {
  /**
   * Whether to traverse the shadow DOM to find the active element
   *
   * @default true
   */
  deep?: boolean
}

/**
 * use the active element, optionally traversing the shadow DOM
 */
export function useActiveElement(options: UseActiveElementOptions = {}): Element | null {
  const [element, setElement] = useSafeState<Element | null>(null)

  function updateElement() {
    setElement(getActiveElement(options.deep))
  }

  function blurHandler(event: FocusEvent) {
    if (event.relatedTarget === null) {
      updateElement()
    }
  }

  useMount(updateElement)

  useEventListener(() => window, 'focus', updateElement, true)
  useEventListener(() => window, 'blur', blurHandler, true)

  return element
}

/**
 * find the active element, optionally traversing the shadow DOM
 */
function getActiveElement(deep = false): Element | null {
  let element = document.activeElement

  if (deep) {
    while (element?.shadowRoot) {
      element = element.shadowRoot.activeElement
    }
  }

  return element as Element
}
