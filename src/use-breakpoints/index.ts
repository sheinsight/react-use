import { useCreation } from '../use-creation'
import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { useLatest } from '../use-latest'
import { useMediaQuery } from '../use-media-query'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { increaseWithUnit, isNumber } from '../utils'

export type Breakpoints<K extends string = string> = Record<K, number | string>

export interface UseBreakpointsOptions {
  /**
   * The query strategy to use for the generated shortcut methods like `.lg`
   *
   * 'min-width' - .lg will be true when the viewport is greater than or equal to the lg breakpoint (mobile-first)
   * 'max-width' - .lg will be true when the viewport is smaller than the xl breakpoint (desktop-first)
   *
   * @default "min-width"
   */
  strategy?: 'min-width' | 'max-width'
}

export type useBreakpointsReturn<K extends string> = Record<K, boolean> & {
  /**
   * The current breakpoints states
   */
  breakpoints: Record<K, boolean>
  /**
   * Check if the viewport is greater than the given breakpoint
   */
  isGreater: (k: K) => boolean
  /**
   * Check if the viewport is greater or equal to the given breakpoint
   */
  isGreaterOrEqual: (k: K) => boolean
  /**
   * Check if the viewport is smaller than the given breakpoint
   */
  isSmaller: (k: K) => boolean
  /**
   * Check if the viewport is smaller or equal to the given breakpoint
   */
  isSmallerOrEqual: (k: K) => boolean
  /**
   * Check if the viewport is between the given breakpoints
   */
  isInBetween: (a: K, b: K) => boolean
  /**
   * The current matched breakpoints
   */
  currents: K[]
}

/**
 * five breakpoints by default, align with tailwindcss breakpoints
 *
 * @see https://tailwindcss.com/docs/responsive-design
 * */
export const defaultBreakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }

export function useBreakpoints<K extends string>(
  breakpoints: Breakpoints<K> = defaultBreakpoints as Breakpoints<K>,
  options: UseBreakpointsOptions = {},
): useBreakpointsReturn<K> {
  const { strategy = 'min-width' } = options
  const latest = useLatest({ breakpoints, strategy, ...options })

  const calcValue = useStableFn((k: K, delta?: number) => {
    let v = latest.current.breakpoints[k]
    if (delta) v = increaseWithUnit(v, delta)
    if (isNumber(v)) v = `${v}px`
    return v
  })

  const transformQueries = useStableFn(() => {
    return Object.keys(latest.current.breakpoints).map((k) => {
      const isMinWidth = strategy === 'min-width'
      return [k, isMinWidth ? `(min-width: ${calcValue(k as K)})` : `(max-width: ${calcValue(k as K)})`] as [K, string]
    })
  })

  const [queries, setQueries] = useSafeState<[Key: K, Query: string][]>(transformQueries)

  const matches = useMediaQuery(queries.map((e) => e[1]))
  const match = useStableFn((query: string) => Boolean(window?.matchMedia(query).matches))

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when breakpoints changes
  useDeepCompareEffect(() => setQueries(transformQueries()), [breakpoints])

  const isGreater = useStableFn((k: K) => match(`(min-width: ${calcValue(k)})`))
  const isSmaller = useStableFn((k: K) => match(`(max-width: ${calcValue(k, -0.1)})`))
  const isGreaterOrEqual = useStableFn((k: K) => match(`(min-width: ${calcValue(k, 0.1)})`))
  const isSmallerOrEqual = useStableFn((k: K) => match(`(max-width: ${calcValue(k)})`))
  const isInBetween = useStableFn((a: K, b: K) =>
    match(`(min-width: ${calcValue(a)}) and (max-width: ${calcValue(b, -0.1)})`),
  )

  const { bps, currents } = useCreation(() => {
    const bps = Object.keys(breakpoints).reduce(
      (shortcuts, key) => {
        shortcuts[key as K] = matches[queries.findIndex(([k]) => k === key)] ?? false
        return shortcuts
      },
      {} as Record<K, boolean>,
    )

    const currents = Object.entries(bps)
      .filter(([_, v]) => v)
      .map(([k]) => k as K)

    return { bps, currents }
  }, [breakpoints, matches])

  return {
    ...bps,
    breakpoints: bps,
    isGreater,
    isGreaterOrEqual,
    isSmaller,
    isSmallerOrEqual,
    isInBetween,
    currents,
  }
}
