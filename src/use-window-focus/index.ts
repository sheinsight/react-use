import { useEventListener } from '../use-event-listener'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { ensureSSRSecurity } from '../utils'

export function useWindowFocus(): boolean {
  const [isFocused, setIsFocused] = useSafeState(ensureSSRSecurity(() => document.hasFocus(), false))

  useMount(() => setIsFocused(document.hasFocus()))

  // biome-ignore format: no wrap
  useEventListener(() => window,'blur',() => setIsFocused(false))
  // biome-ignore format: no wrap
  useEventListener(() => window,'focus',() => setIsFocused(true))

  return isFocused
}
