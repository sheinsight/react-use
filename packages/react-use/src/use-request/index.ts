import { useQuery } from '../use-query'

import type { UseQueryOptions, UseQueryReturns } from '../use-query'
import type { AnyFunc } from '../utils/basic'

export interface UseRequestOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseQueryOptions<T, D, E> {}
export interface UseRequestReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseQueryReturns<T, D, E> {}

/**
 *
 * A hook that helps you manage the request status, including loading, refreshing, initializing, error, etc.
 *
 * @since 1.4.0
 *
 * @deprecated deprecated since `1.5.0`, use `useQuery` instead
 *
 */
export function useRequest<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fetcher: T,
  options: UseQueryOptions<T, D, E> = {},
): UseRequestReturns<T, D, E> {
  return useQuery(fetcher, options)
}
