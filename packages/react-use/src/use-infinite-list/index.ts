import { useMemo, useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useForm } from '../use-form'
import { useInfiniteScroll } from '../use-infinite-scroll'
import { useLatest } from '../use-latest'
import { useMultiSelect } from '../use-multi-select'
import { usePagination } from '../use-pagination'
import { useStableFn } from '../use-stable-fn'
import { useTrackedRefState } from '../use-tracked-ref-state'
import { shallowEqual } from '../utils/equal'

import type { UseAsyncFnOptions } from '../use-async-fn'
import type { UseFormOptions, UseFormReturns } from '../use-form'
import type { UseInfiniteScrollOptions, UseInfiniteScrollReturns } from '../use-infinite-scroll'
import type { UseMultiSelectReturnsActions, UseMultiSelectReturnsState } from '../use-multi-select'
import type { UsePaginationOptions, UsePaginationReturnsState } from '../use-pagination'
import type { ElementTarget } from '../use-target-element'
import type { AnyFunc } from '../utils/basic'

export interface UseInfiniteListOptions<
  Data,
  Item,
  FormState extends object,
  Fetcher extends AnyFunc,
  Container extends HTMLElement,
> {
  /**
   * The container element
   */
  target?: ElementTarget<Container>
  /**
   * The fetcher function, should return a object with data item list.
   */
  fetcher?: Fetcher
  /**
   * The map function to map each data to item list
   */
  mapFullList?: (data: Data) => Item[]
  /**
   * The form options
   *
   * see `useForm` for more details
   */
  form?: UseFormOptions<FormState>
  /**
   * The async function options
   *
   * see `useAsyncFn` for more details
   */
  asyncFn?: Omit<UseAsyncFnOptions<Fetcher, Data, any>, 'initialParams'>
  /**
   * The pagination options
   *
   * see `usePagination` for more details
   */
  pagination?: UsePaginationOptions<Data>
  /**
   * Whether can load more
   */
  canLoadMore?: (previousData: Data | undefined, dataList: Data[], fullList: Item[]) => boolean
  /**
   * The infinite scroll options
   *
   * see `useInfiniteScroll` for more details
   */
  infiniteScroll?: Omit<UseInfiniteScrollOptions<Data>, 'canLoadMore'>
  /**
   * The keys of form state that will trigger a new query when changed
   */
  immediateQueryKeys?: (keyof FormState)[]
}

export interface UseInfiniteListFetcherParams<Data, FormState extends object> {
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

export type UseInfiniteListFetcher<Data, FormState extends object> = (
  params: UseInfiniteListFetcherParams<Data, FormState>,
) => Promise<Data>

export interface UseInfiniteListReturns<Data, Item, FormState extends object>
  extends Omit<UseInfiniteScrollReturns, 'reset'> {
  /**
   * reset the list, form, pagination, selection, and refetch the data
   */
  reset: () => void
  /**
   * The form state
   */
  form: UseFormReturns<FormState>
  /**
   * The list data
   */
  list: Data[]
  /**
   * The full list data
   */
  fullList: Item[]
  /**
   * The selection state and action
   */
  selection: UseMultiSelectReturnsState<Item> & UseMultiSelectReturnsActions<Item>
  /**
   * The pagination state
   */
  paginationState: UsePaginationReturnsState<Data>
}

/**
 *
 * @since 1.7.0
 */
export function useInfiniteList<
  Data,
  Item = any,
  FormState extends object = object,
  Fetcher extends UseInfiniteListFetcher<Data, FormState> = UseInfiniteListFetcher<Data, FormState>,
  Container extends HTMLElement = HTMLElement,
>(
  options: UseInfiniteListOptions<Data, Item, FormState, Fetcher, Container> = {},
): UseInfiniteListReturns<Data, Item, FormState> {
  const { target, fetcher = () => {} } = options

  // for instant get the latest state, by ref
  const [{ dataList }, { updateRefState }, stateRef] = useTrackedRefState<{ dataList: Data[] }>({ dataList: [] })
  const previousDataRef = useRef<Data | undefined>(undefined)
  const previousFormRef = useRef<FormState>((options.form?.initialValue || {}) as FormState)

  const form = useForm<FormState>({
    ...options.form,
    onChange: (form, ...args) => {
      const nextForm = form
      const keys = options.immediateQueryKeys || []

      for (const key of keys) {
        const isChanged = !shallowEqual(previousFormRef.current[key], nextForm[key])

        if (isChanged) {
          reset()
          break
        }
      }

      previousFormRef.current = nextForm

      return latest.current.options.form?.onChange?.(form, ...args)
    },
    onSubmit: (form) => {
      reset()
      return latest.current.options.form?.onSubmit?.(form)
    },
    onReset: () => {
      reset()
      return latest.current.options.form?.onReset?.()
    },
  })

  const loadFn = useAsyncFn<Fetcher, Data, any>(fetcher as Fetcher, {
    ...options.asyncFn,
    immediate: !options.target,
    initialParams: [
      {
        page: options.pagination?.page ?? 1,
        pageSize: options.pagination?.pageSize ?? 10,
        form: form.value,
        previousData: undefined,
      },
    ] as Parameters<Fetcher>,
    onSuccess(data, ...reset) {
      updateRefState('dataList', [...stateRef.dataList.value, data])
      paginationActions.next()
      previousDataRef.current = data
      return latest.current.options.asyncFn?.onSuccess?.(data, ...reset)
    },
  })

  const infiniteScroll = useInfiniteScroll<Data>(
    target,
    () => {
      return loadFn.run({
        form: form.value,
        page: latest.current.paginationState.page ?? 10,
        pageSize: latest.current.paginationState.pageSize ?? 10,
        previousData: previousDataRef.current,
      })
    },
    {
      ...options.infiniteScroll,
      canLoadMore: (pre) => {
        const dataList = stateRef.dataList.value
        const fullList = dataList.flatMap((data) => latestMapFullList.current?.(data) ?? []) as Item[]
        return latest.current.options.canLoadMore?.(pre, dataList, fullList) ?? true
      },
    },
  )

  const reset = useStableFn(() => {
    loadFn.cancel()
    previousDataRef.current = undefined
    updateRefState('dataList', [])
    selectActions.setSelected([])
    paginationActions.go(1)
    infiniteScroll.reset()
    !latest.current.options.target && infiniteScroll.loadMore()
  })

  const latestMapFullList = useLatest(options.mapFullList)

  const fullList = useMemo(() => {
    return dataList.flatMap((data) => latestMapFullList.current?.(data) ?? []) as Item[]
  }, [dataList])

  const [selectState, selectActions] = useMultiSelect<Item>(fullList)

  const [paginationState, paginationActions] = usePagination<Data>({
    ...options.pagination,
    onPageSizeChange: (paging) => {
      reset()
      return latest.current.options.pagination?.onPageSizeChange?.(paging)
    },
  })

  const latest = useLatest({
    dataList,
    fullList,
    options,
    selectState,
    paginationState,
  })

  return {
    ...infiniteScroll,
    reset,
    form,
    list: dataList,
    fullList,
    paginationState,
    selection: {
      ...selectState,
      ...selectActions,
    },
  }
}
