import { useEffect } from 'react'
import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { usePrevious } from '../use-previous'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
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
  /**
   * Restore the previous favicon on unmount
   *
   * @defaultValue false
   */
  restoreOnUnmount?: boolean
}

export interface UseFaviconReturns {
  /**
   * The current favicon URL
   */
  href: string | null
  /**
   * Set the favicon URL
   */
  setFavicon: ReactSetState<string | null>
  /**
   * Sync the favicon in document `<link rel='icon' />` to hooks state
   */
  syncFavicon(isInitial?: boolean): void
  /**
   * Set the favicon to an emoji
   */
  setEmojiFavicon: (emoji: string) => void
  /**
   * Set the favicon to the previous favicon
   */
  setPreviousFavicon(): void
}

function emojiSvgHref(emoji: string): string {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="1em" font-size="90">${emoji}</text></svg>`
}

function getFavicon(rel = 'icon'): string {
  const elements = document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
  const href = Array.from(elements)
    .filter((el) => el.href)
    .map((el) => el.href)[0]
  return href
}

/**
 * A React Hook that allows you to change the favicon of the page.
 */
export function useFavicon(newIcon: FaviconType = null, options: UseFaviconOptions = {}): UseFaviconReturns {
  const { baseUrl = '', rel = 'icon', restoreOnUnmount = false, syncOnMount = true } = options
  const [faviconHref, setFaviconHref] = useSafeState(newIcon ?? null)
  const previousFavicon = usePrevious(faviconHref)

  const [initialFaviconRef, initialFavicon] = useGetterRef<string>('')
  const latest = useLatest({ restoreOnUnmount, faviconHref, previousFavicon })

  const applyIcon = useStableFn((icon: string) => {
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
      for (const el of Array.from(elements)) {
        el.href = iconHref
        el.type = iconType
      }
    }
  })

  const syncFavicon = useStableFn((isInitial: boolean = false) => {
    const href = getFavicon(rel)

    if (href && href !== latest.current.faviconHref) {
      if (isInitial) {
        initialFaviconRef.current = href
      }

      setFaviconHref(href)
    }
  })

  useMount(() => !faviconHref && syncOnMount && syncFavicon(true))

  useEffect(() => {
    const isUpdatedIcon = isString(faviconHref) && faviconHref !== latest.current.previousFavicon
    isUpdatedIcon && applyIcon(faviconHref)
  }, [faviconHref])

  useUpdateEffect(() => void setFaviconHref(newIcon), [newIcon])

  useUnmount(() => {
    if (latest.current.restoreOnUnmount) {
      applyIcon(initialFavicon())
    }
  })

  const setPreviousFavicon = useStableFn(() => {
    const { previousFavicon } = latest.current
    if (!previousFavicon) return
    applyIcon(previousFavicon)
    setFaviconHref(previousFavicon)
  })

  const setEmojiFavicon = useStableFn((emoji: string) => {
    setFaviconHref(emojiSvgHref(encodeURIComponent(emoji)))
  })

  return {
    href: faviconHref,
    setFavicon: setFaviconHref,
    syncFavicon,
    setEmojiFavicon,
    setPreviousFavicon,
  }
}
