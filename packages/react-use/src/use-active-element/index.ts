import { useEventListener } from '../use-event-listener'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'

export interface UseActiveElementOptions {
  /**
   * Whether to traverse the shadow DOM to find the active element
   *
   * @defaultValue false
   */
  deep?: boolean
}

/**
 * A React Hook that returns the currently **active element** (via `document.activeElement`), optionally traversing the shadow DOM.
 *
 * @param {UseActiveElementOptions} options - `UseActiveElementOptions`, options to configure the hook, see {@link UseActiveElementOptions}
 * @returns {Element | null} `Element | null`, the currently active element, `null` if there is none, see {@link Element}
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
 * Get the currently active element, optionally traversing the shadow DOM.
 *
 * @param {boolean} [deep=false] - `boolean`, Whether to traverse the shadow DOM to find the active element
 */
function getActiveElement(deep: boolean = false): Element | null {
  let element = document.activeElement

  if (deep) {
    while (element?.shadowRoot) {
      element = element.shadowRoot.activeElement
    }
  }

  return element as Element
}
