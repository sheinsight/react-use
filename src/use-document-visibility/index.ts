import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { ensureSSRSecurity } from '../utils'

export type UseDocumentVisibilityCallback = (state: string, event: Event) => void

export function useDocumentVisibility(callback?: UseDocumentVisibilityCallback): DocumentVisibilityState {
  const latest = useLatest({ callback })

  const [visibility, setVisibility] = useSafeState<DocumentVisibilityState>(
    ensureSSRSecurity(getVisibilityState, 'visible'),
  )

  useEventListener(
    () => document,
    'visibilitychange',
    (e: Event) => {
      const state = document.visibilityState
      setVisibility(state)
      latest.current.callback?.(state, e)
    },
  )

  return visibility
}

function getVisibilityState(): DocumentVisibilityState {
  return document.visibilityState
}
