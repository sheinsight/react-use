import { useRef } from 'react'
import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { ensureSSRSecurity, unwrapArrayable, unwrapGettable } from '../utils'

import type { Gettable, Arrayable } from '../utils'

export type UseMediaQueryType = Gettable<string>
export type MediaQueryChangeListener = (this: MediaQueryList, ev: MediaQueryListEvent) => void
export type UseMediaQueryReturn<T, R> = R extends T[] ? boolean[] : boolean

export interface UseMediaQueryOptions extends AddEventListenerOptions {}

/**
 * React hook to listen to media query changes.
 */
export function useMediaQuery<T extends UseMediaQueryType, R extends Arrayable<T> = Arrayable<T>>(
  query: R,
  options: UseMediaQueryOptions = {},
): UseMediaQueryReturn<T, R> {
  const { ...addEventListenerOptions } = options
  const queryStrings = unwrapArrayable(query).filter(Boolean).map(unwrapGettable)
  const mediaQueries = useRef<(MediaQueryList & { handler?: MediaQueryChangeListener })[]>([])

  const [matches, setMatches] = useSafeState(
    ensureSSRSecurity(() => getMatches(queryStrings), [false]),
    { deep: true },
  )

  const latest = useLatest(matches)

  useDeepCompareEffect(() => {
    if (!queryStrings.length) return

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia#browser_compatibility
    mediaQueries.current = queryStrings.map((query) => window.matchMedia(query))
    setMatches(getMatches(queryStrings))

    mediaQueries.current.map((mq, idx) => {
      mq.handler = (event: MediaQueryListEvent) => {
        const newMatches = [...latest.current]
        newMatches[idx] = event.matches
        setMatches(newMatches)
      }
      if (mq.handler) {
        if ('addEventListener' in mq) {
          mq.addEventListener('change', mq.handler, addEventListenerOptions)
        } else if ('addListener' in mq) {
          // @ts-expect-error for legacy browsers
          mq?.addListener(mq.handler)
        }
      }
    })

    return () => {
      mediaQueries.current.map((mq) => {
        if (mq.handler) {
          if ('removeEventListener' in mq) {
            mq.removeEventListener('change', mq.handler)
          } else if ('removeListener' in mq) {
            // @ts-expect-error for legacy browsers
            mq?.removeListener(mq.handler)
          }
        }
      })

      mediaQueries.current = []
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: deep compare
  }, [queryStrings, addEventListenerOptions])

  return (Array.isArray(query) ? matches : matches[0]) as R extends T[] ? boolean[] : boolean
}

function getMatches(queryStrings: string[]): boolean[] {
  return queryStrings.map((query) => Boolean(window.matchMedia(query).matches))
}
