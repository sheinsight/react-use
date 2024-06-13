import { useWebObserver } from '../use-web-observer'

import type { UseWebObserverOptions, UseWebObserverReturn } from '../use-web-observer'

export interface UseReportingObserverOptions extends UseWebObserverOptions, ReportingObserverOptions {}
export interface UseReportingObserverReturn extends UseWebObserverReturn<ReportingObserver> {}

export function useReportingObserver(
  callback: ReportingObserverCallback,
  options: UseReportingObserverOptions = {},
): UseReportingObserverReturn {
  const { immediate = true, ...initOptions } = options
  return useWebObserver('ReportingObserver', undefined, callback, { immediate }, initOptions)
}
