import { useWebObserver } from '../use-web-observer'

import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UseReportingObserverOptions extends UseWebObserverOptions, ReportingObserverOptions {}
export interface UseReportingObserverReturns extends UseWebObserverReturns<ReportingObserver> {}

/**
 * A React Hook that helps to use [ReportingObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver) to report errors and warnings with ease.
 */
export function useReportingObserver(
  callback: ReportingObserverCallback,
  options: UseReportingObserverOptions = {},
): UseReportingObserverReturns {
  const { immediate = true, ...initOptions } = options
  return useWebObserver('ReportingObserver', undefined, callback, { immediate }, initOptions)
}
