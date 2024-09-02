import { useWebObserver } from '../use-web-observer'
import { isDev } from '../utils/basic'

import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UsePerformanceObserverOptions
  extends UseWebObserverOptions,
    Omit<PerformanceObserverInit, 'entryTypes'> {
  entryTypes: string[]
}

export interface UsePerformanceObserverReturns extends UseWebObserverReturns<PerformanceObserver> {}

/**
 * A React Hook that helps to use [PerformanceObserver API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) with ease.
 */
export function usePerformanceObserver(
  callback: PerformanceObserverCallback,
  options: Omit<UsePerformanceObserverOptions, 'supported'>,
): UsePerformanceObserverReturns {
  const { immediate = true, ...observerOptions } = options

  if (isDev) {
    if (!options.entryTypes || !Array.isArray(options.entryTypes) || options.entryTypes.length === 0) {
      throw new Error('usePerformanceObserver: entryTypes must be an array and not empty.')
    }
  }

  return useWebObserver(
    'PerformanceObserver',
    undefined,
    callback,
    {
      immediate,
      supported() {
        const isSupportedEntryTypesSupported = 'supportedEntryTypes' in PerformanceObserver

        return options.entryTypes.every((e) => {
          return isSupportedEntryTypesSupported && PerformanceObserver.supportedEntryTypes.includes(e)
        })
      },
    },
    undefined,
    observerOptions,
  )
}
