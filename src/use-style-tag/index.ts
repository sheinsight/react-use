import { useEffect, useRef } from 'react'
import { useCreation } from '../use-creation'
import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'
import { isClient } from '../utils/basic'

import type { MutableRefObject } from 'react'

export interface UseStyleTagReturns {
  /**
   * Unique identifier of the style tag
   */
  id: string
  /**
   * CSS content
   */
  css: string
  /**
   * Set CSS content
   */
  setCss: (newCss: string) => void
  /**
   * Reset CSS content to initial value
   */
  resetCss(): void
  /**
   * Load the style tag
   */
  load(): void
  /**
   * Unload the style tag
   */
  unload(): void
  /**
   * A ref that holds the style tag element
   */
  styleTag: MutableRefObject<HTMLStyleElement | null>
  /**
   * A ref that holds the loading state of the style tag
   */
  isLoaded: MutableRefObject<boolean>
}

export interface UseStyleTagOptions {
  /**
   * Media query for styles to apply
   */
  media?: string
  /**
   * Whether to load the style tag immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * Whether to manually load the style tag
   *
   * @defaultValue false
   */
  manual?: boolean
  /**
   * Unique identifier of the style tag
   *
   * @defaultValue auto-incremented
   */
  id?: string
}

const globalState = /* #__PURE__ */ { id: 0 }

/**
 * A React Hook that helps to apply a style tag to the document with ease in React.
 */
export function useStyleTag(initialCss = '', options: UseStyleTagOptions = {}): UseStyleTagReturns {
  const isLoaded = useRef(false)
  const styleTag = useRef<HTMLStyleElement | null>(null)

  // rewrite via `React.useId` in next major version
  const defaultId = useCreation(() => {
    const id = (++globalState.id).toString().padStart(3, '0')
    return `use-style-tag__id-${id}`
  })

  const latestOptions = useLatest(options)
  const [css, setCss] = useSafeState(initialCss)

  const load = useStableFn(() => {
    if (!isClient) return
    const { id = defaultId, media } = latestOptions.current
    styleTag.current = (document.getElementById(id) || document.createElement('style')) as HTMLStyleElement
    if (!styleTag.current.isConnected) {
      styleTag.current.id = id
      if (media) styleTag.current.media = media
      document.head.appendChild(styleTag.current)
    }
    styleTag.current.textContent = css
    isLoaded.current = true
  })

  const unload = useStableFn(() => {
    if (!document || !isLoaded.current) return
    const id = latestOptions.current.id || defaultId
    document.head.removeChild(document.getElementById(id) as HTMLStyleElement)
    isLoaded.current = false
  })

  const resetCss = useStableFn(() => setCss(initialCss))

  useEffect(() => {
    if (!styleTag.current || !isLoaded.current) return
    styleTag.current.textContent = css
  }, [css])

  useUpdateEffect(() => void (initialCss && setCss(initialCss)), [initialCss])

  useEffectOnce(() => {
    const { immediate = true, manual = false } = latestOptions.current
    immediate && !manual && load()

    return () => {
      const { manual = false } = latestOptions.current
      !manual && unload()
    }
  })

  return {
    id: latestOptions.current.id || defaultId,
    css,
    setCss,
    resetCss,
    load,
    unload,
    styleTag: styleTag,
    isLoaded: isLoaded,
  }
}
