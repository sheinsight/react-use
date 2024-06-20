import { useEffect } from 'react'
import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { usePrevious } from '../use-previous'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'
import { isString } from '../utils/basic'

import type { ReactSetState } from '../use-safe-state'

export type FaviconType = string | null | undefined

export interface UseFaviconOptions {
  /**
   * Base URL for the favicon
   *
   * @defaultValue ''
   */
  baseUrl?: string
  /**
   * The rel attribute of the favicon link element
   *
   * @defaultValue 'icon'
   */
  rel?: string
  /**
   * Sync the favicon in document `<link rel='icon' />` to hooks state on mount
   *
   * @defaultValue true
   */
  syncOnMount?: boolean
}

export type UseFaviconReturns = readonly [
  /**
   * The current favicon URL
   */
  favicon: string | null,
  {
    /**
     * Set the favicon URL
     */
    setFavicon: ReactSetState<string | null>
    /**
     * Sync the favicon in document `<link rel='icon' />` to hooks state
     */
    syncFavicon(): void
    /**
     * Set the favicon to an emoji
     */
    setEmojiFavicon: (emoji: string) => void
    /**
     * Set the favicon to the previous favicon
     */
    setPreviousFavicon(): void
  },
]

function emojiSvgHref(emoji: string): string {
  return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`
}

function getFavicon(rel = 'icon'): string | null {
  if (!document || !document.head) return null
  const elements = document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
  const href = Array.from(elements)
    .filter((el) => el.href)
    .map((el) => el.href)[0]
  return href
}

export function useFavicon(newIcon: FaviconType = null, options: UseFaviconOptions = {}): UseFaviconReturns {
  const { baseUrl = '', rel = 'icon', syncOnMount = true } = options
  const [favicon, setFavicon] = useSafeState(newIcon ?? null)
  const previousFavicon = usePrevious(favicon)

  const latest = useLatest({ favicon, previousFavicon })

  const applyIcon = useStableFn((icon: string) => {
    if (!document || !document.head) return

    const elements = document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
    const isDataUrl = icon.startsWith('data:')
    const iconType = isDataUrl ? icon.split('data:')[1].split(',')[0] : `image/${icon.split('.').pop() ?? 'png'}`
    const iconHref = isDataUrl ? icon : `${baseUrl}${icon}`

    if (!elements || elements.length === 0) {
      const link = document.createElement('link')
      link.rel = rel
      link.href = iconHref
      link.type = iconType
      document.head.append(link)
    } else {
      for (const el of elements) {
        el.href = iconHref
        el.type = iconType
      }
    }
  })

  const syncFavicon = useStableFn(() => {
    const href = getFavicon(rel)

    if (href && href !== latest.current.favicon) {
      setFavicon(href)
    }
  })

  useMount(() => !favicon && syncOnMount && syncFavicon())

  useEffect(() => {
    const isUpdatedIcon = isString(favicon) && favicon !== latest.current.previousFavicon
    isUpdatedIcon && applyIcon(favicon)
  }, [favicon])

  useUpdateEffect(() => void setFavicon(newIcon), [newIcon])

  const setPreviousFavicon = useStableFn(() => {
    const { previousFavicon } = latest.current
    if (!previousFavicon) return
    applyIcon(previousFavicon)
    setFavicon(previousFavicon)
  })

  const setEmojiFavicon = useStableFn((emoji: string) => {
    setFavicon(emojiSvgHref(encodeURIComponent(emoji)))
  })

  const actions = useCreation(() => ({
    setFavicon,
    syncFavicon,
    setEmojiFavicon,
    setPreviousFavicon,
  }))

  return [favicon, actions] as const
}
