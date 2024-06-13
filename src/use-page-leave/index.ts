import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'

export interface UsePageLeaveEvent {
  relatedTarget?: EventTarget | null
  toElement?: EventTarget | null
}

export function usePageLeave() {
  const [isLeft, setIsLeft] = useSafeState(false)

  function handler(event: MouseEvent) {
    const evt = (event || window.event) as UsePageLeaveEvent
    const from = evt.relatedTarget || evt.toElement
    setIsLeft(!from)
  }

  useEventListener(() => window, 'mouseout', handler, { passive: true })
  useEventListener(() => document, ['mouseleave', 'mouseenter'], handler, { passive: true })

  return isLeft
}
