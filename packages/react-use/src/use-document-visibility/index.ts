import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'

export type UseDocumentVisibilityCallback = (state: string, event: Event) => void

/**
 * A React Hook that returns `document.visibilityState`.
 */
export function useDocumentVisibility(callback?: UseDocumentVisibilityCallback): DocumentVisibilityState {
  const latest = useLatest({ callback })

  const [visibility, setVisibility] = useSafeState<DocumentVisibilityState>('visible')

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
