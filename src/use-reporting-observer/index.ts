import { useWebObserver } from '../use-web-observer'

import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UseReportingObserverOptions extends UseWebObserverOptions, ReportingObserverOptions {}
export interface UseReportingObserverReturns extends UseWebObserverReturns<ReportingObserver> {}

export function useReportingObserver(
  callback: ReportingObserverCallback,
  options: UseReportingObserverOptions = {},
): UseReportingObserverReturns {
  const { immediate = true, ...initOptions } = options
  return useWebObserver('ReportingObserver', undefined, callback, { immediate }, initOptions)
}
