import { useQuery } from '../use-query'

import type { UseQueryOptions, UseQueryReturns } from '../use-query'
import type { AnyFunc } from '../utils/basic'

export interface UseRequestOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseQueryOptions<T, D, E> {}
export interface UseRequestReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseQueryReturns<T, D, E> {}

export function useRequest<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fetcher: T,
  options: UseQueryOptions<T, D, E> = {},
): UseRequestReturns<T, D, E> {
  return useQuery(fetcher, options)
}
