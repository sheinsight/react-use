import { useCreation } from '../use-creation'
import { useEventListener } from '../use-event-listener'
import { useLayoutMount } from '../use-layout-mount'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { normalizeElement, useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export interface UseFocusOptions {
  /**
   * initial focus state
   *
   * @defaultValue false
   */
  initialValue?: boolean
}

export type UseFocusReturns = readonly [
  /**
   * focus state
   */
  focused: boolean,
  /**
   * focus actions
   */
  actions: {
    /**
     * focus the target element
     */
    focus(): void
    /**
     * blur the target element
     */
    blur(): void
  },
]

/**
 * A React Hook that allows you to focus on an element when it is mounted.
 */
export function useFocus<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  options: UseFocusOptions = {},
): UseFocusReturns {
  const el = useTargetElement<T>(target)
  const [focused, setFocused] = useSafeState(options?.initialValue ?? false)

  useEventListener(el, 'focus', () => setFocused(true))
  useEventListener(el, 'blur', () => setFocused(false))

  useLayoutMount(() => {
    const isCurrentFocused = isElActive(el)

    if (focused && !isCurrentFocused) focus()
    if (!focused && isCurrentFocused) setFocused(true)
  })

  const focus = useStableFn(() => el.current?.focus())
  const blur = useStableFn(() => el.current?.blur())
  const actions = useCreation(() => ({ focus, blur }))

  return [focused, actions] as const
}

function isElActive<T extends HTMLElement>(target: ElementTarget<T>) {
  return normalizeElement(target) === document.activeElement
}
