import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'
import { useUnmount } from '../use-unmount'

import type { ReactSetState } from '../use-safe-state'
import type { ElementTarget } from '../use-target-element'

export type UseScrollLockReturn = [
  /**
   * Whether the scroll is locked
   */
  isLocked: boolean,
  /**
   * Set the scroll lock
   */
  setLocked: ReactSetState<boolean>,
  {
    /**
     * Lock the scroll
     */
    lock(): void
    /**
     * Unlock the scroll
     */
    unlock(): void
    /**
     * Toggle the scroll lock
     */
    toggle(): void
  },
]

const globalOverflowCache = new WeakMap<Element, CSSStyleDeclaration['overflow']>()

export function useScrollLock<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  initialState = false,
): UseScrollLockReturn {
  const el = useTargetElement<T>(target)
  const [isLocked, setLocked] = useSafeState(initialState)

  const latest = useLatest({ isLocked })

  useMount(() => {
    if (!el.current) return
    globalOverflowCache.set(el.current, el.current.style.overflow)
    if (isLocked) el.current.style.overflow = 'hidden'
  })

  const lock = useStableFn(() => {
    if (!el.current || latest.current.isLocked) return
    globalOverflowCache.set(el.current, el.current.style.overflow)
    el.current.style.overflow = 'hidden'
    setLocked(true)
  })

  const unlock = useStableFn(() => {
    if (!el.current || !latest.current.isLocked) return
    el.current.style.overflow = globalOverflowCache.get(el.current) ?? ''
    globalOverflowCache.delete(el.current)
    setLocked(false)
  })

  const toggle = useStableFn(() => (latest.current.isLocked ? unlock() : lock()))
  const actions = useCreation(() => ({ lock, unlock, toggle }))

  useUnmount(unlock)

  return [isLocked, setLocked, actions]
}
