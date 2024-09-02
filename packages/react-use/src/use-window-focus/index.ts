import { useEventListener } from '../use-event-listener'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'

/**
 * A React Hook that helps to detect whether the window is focused or not.
 */
export function useWindowFocus(): boolean {
  const [isFocused, setIsFocused] = useSafeState(false)

  useMount(() => setIsFocused(document.hasFocus()))

  // biome-ignore format: no wrap
  useEventListener(() => window, 'blur', () => setIsFocused(false))
  // biome-ignore format: no wrap
  useEventListener(() => window, 'focus', () => setIsFocused(true))

  return isFocused
}
