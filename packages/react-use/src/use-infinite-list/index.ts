import { useRef } from 'react'
import { useForm } from '../use-form'
import { useInfiniteScroll } from '../use-infinite-scroll'
import { useLatest } from '../use-latest'
import { useMultiSelect } from '../use-multi-select'
import { usePagination } from '../use-pagination'
import { useQuery } from '../use-query'
import { useSafeState } from '../use-safe-state'
import { shallowEqual } from '../utils/equal'

import type { UseFormOptions } from '../use-form'
import type { UseInfiniteScrollOptions } from '../use-infinite-scroll'
import type { UsePaginationOptions } from '../use-pagination'
import type { UseQueryOptions } from '../use-query'
import type { ElementTarget } from '../use-target-element'
import type { AnyFunc } from '../utils/basic'

export interface UseInfiniteListOptions<
  Fetcher extends AnyFunc,
  Data,
  FormState extends object,
  Container extends HTMLElement,
> {
  target?: ElementTarget<Container>
  fetcher?: Fetcher
  form?: UseFormOptions<FormState>
  query?: Omit<UseQueryOptions<Fetcher, Data>, 'initialParams'>
  pagination?: UsePaginationOptions<Data>
  canLoadMore?: (previousData: Data | undefined, dataList: Data[]) => boolean
  infiniteScroll?: Omit<UseInfiniteScrollOptions<Data>, 'canLoadMore'>
  immediateQueryKeys?: (keyof FormState)[]
}

export interface UseInfiniteListFetcherParams<FormState extends object, Data> {
  /**
   * previous data
   */
  previousData: Data | undefined
  /**
   * current page
   */
  page: number
  /**
   * page size
   */
  pageSize: number
  /**
   * form state
   */
  form: FormState
}

export type UseInfiniteListFetcher<FormState extends object, Data> = (
  params: UseInfiniteListFetcherParams<FormState, Data>,
) => Promise<Data>

// useInfiniteList = useInfiniteScroll + useForm + useQuery + usePagination + useMultiSelect

/**
 *
 * @since 1.7.0
 */
export function useInfiniteList<
  Data,
  FormState extends object = object,
  Fetcher extends UseInfiniteListFetcher<FormState, Data> = UseInfiniteListFetcher<FormState, Data>,
  Container extends HTMLElement = HTMLElement,
>(options: UseInfiniteListOptions<Fetcher, Data, FormState, Container> = {}) {
  const { target, fetcher = () => {} } = options

  const previousData = useRef<Data | undefined>(undefined)
  const previousFormRef = useRef<FormState>((options.form?.initialValue || {}) as FormState)

  const form = useForm<FormState>({
    ...options.form,
    onChange: (form, ...args) => {
      const nextForm = form
      const keys = options.immediateQueryKeys || []

      for (const key of keys) {
        const isChanged = !shallowEqual(previousFormRef.current[key], nextForm[key])

        if (isChanged) {
          startNewQuery()
          break
        }
      }

      previousFormRef.current = nextForm

      return latest.current.options.form?.onChange?.(form, ...args)
    },
    onSubmit: (form) => {
      startNewQuery()
      return latest.current.options.form?.onSubmit?.(form)
    },
    onReset: () => {
      startNewQuery()
      return latest.current.options.form?.onReset?.()
    },
  })

  const query = useQuery<Fetcher, Data, any>(fetcher as Fetcher, {
    ...options.query,
    immediate: options.query?.immediate ?? !options.target,
    initialParams: [
      {
        page: options.pagination?.page ?? 1,
        pageSize: options.pagination?.pageSize ?? 10,
        form: form.value,
        previousData: undefined,
      },
    ] as Parameters<Fetcher>,
    onSuccess(data, ...reset) {
      previousData.current = data
      setDataList((prev) => [...prev, data])
      paginationActions.next()
      latest.current.options.query?.onSuccess?.(data, ...reset)
    },
  })

  const [dataList, setDataList] = useSafeState<Data[]>([])

  const infiniteScroll = useInfiniteScroll<Data>(
    target,
    () => {
      return query.run({
        form: form.value,
        page: latest.current.paginationState.page ?? 10,
        pageSize: latest.current.paginationState.pageSize ?? 10,
        previousData: previousData.current,
      })
    },
    {
      ...options.infiniteScroll,
      canLoadMore: (pre) => {
        return latest.current.options.canLoadMore?.(pre, latest.current.dataList) ?? true
      },
    },
  )

  function startNewQuery() {
    setDataList([])
    paginationActions.go(1)
    previousData.current = undefined
    infiniteScroll.reset(true)
  }

  const [selectState, selectActions] = useMultiSelect<Data>(dataList)

  const [paginationState, paginationActions] = usePagination<Data>({
    ...options.pagination,
    onPageSizeChange: (paging) => {
      startNewQuery()
      latest.current.options.pagination?.onPageSizeChange?.(paging)
    },
  })

  const latest = useLatest({
    dataList,
    options,
    selectState,
    paginationState,
  })

  return {
    ...infiniteScroll,
    list: dataList,
    form,
    query,
    selection: {
      ...selectState,
      ...selectActions,
    },
    pagination: {
      ...paginationState,
      ...paginationActions,
    },
  }
}
