import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'

export interface UseDocumentLeaveEvent {
  relatedTarget?: EventTarget | null
  toElement?: EventTarget | null
}

export function useDocumentLeave() {
  const [isLeft, setIsLeft] = useSafeState(false)

  function handler(event: MouseEvent) {
    const evt = (event || window.event) as UseDocumentLeaveEvent
    const from = evt.relatedTarget || evt.toElement
    setIsLeft(!from)
  }

  useEventListener(() => window, 'mouseout', handler, { passive: true })
  useEventListener(() => document, ['mouseleave', 'mouseenter'], handler, { passive: true })

  return isLeft
}
