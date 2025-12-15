import { useRef } from 'react'
import { useForm } from '../use-form'
import { useLatest } from '../use-latest'
import { useMultiSelect } from '../use-multi-select'
import { usePagination } from '../use-pagination'
import { useQuery } from '../use-query'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { shallowEqual } from '../utils/equal'

import type { UseFormOptions, UseFormReturns } from '../use-form'
import type { UseMultiSelectReturnsActions, UseMultiSelectReturnsState } from '../use-multi-select'
import type { UsePaginationOptions, UsePaginationReturnsActions, UsePaginationReturnsState } from '../use-pagination'
import type { UseQueryOptions, UseQueryReturns } from '../use-query'
import type { ReactSetState } from '../use-safe-state'

export interface UsePagingListOptions<Item, FormState extends object> {
  /**
   * fetcher function that will be called when the query is triggered
   */
  fetcher?: UsePagingListFetcher<Item, FormState>
  /**
   * options for `useForm`, see `useForm` for more details
   *
   * @defaultValue undefined
   */
  form?: UseFormOptions<FormState>
  /**
   * options for `useQuery`, see `useQuery` for more details
   *
   * @defaultValue undefined
   */
  query?: Omit<
    UseQueryOptions<UsePagingListFetcher<Item, FormState>>,
    'initialParams' | 'initialData' | 'cacheKey' | 'cacheExpirationTime' | 'provider'
  >
  /**
   * options for `usePagination`, see `usePagination` for more details
   *
   * @defaultValue undefined
   */
  pagination?: UsePaginationOptions<Item[]>
  /**
   * keys of form state that will trigger a new query when changed
   *
   * @defaultValue []
   */
  immediateQueryKeys?: (keyof FormState)[]
}

export interface UsePagingListFetcherParams<Item, FormState extends object> {
  /**
   * previous data
   */
  previousData: Item[] | undefined
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
  /**
   * set total count
   */
  setTotal: ReactSetState<number>
}

export type UsePagingListFetcher<Item, FormState extends object> = (
  params: UsePagingListFetcherParams<Item, FormState>,
) => Promise<Item[]>

export interface UsePagingListReturns<Item, FormState extends object>
  extends Pick<
    UseQueryReturns<any, any>,
    'loading' | 'params' | 'error' | 'initializing' | 'refreshing' | 'loadingSlow'
  > {
  /**
   * list data
   */
  list: Item[]
  /**
   * form state
   */
  form: UseFormReturns<FormState>
  /**
   * refresh query
   */
  refresh: () => void
  /**
   * selection state
   */
  selection: UseMultiSelectReturnsState<Item> & UseMultiSelectReturnsActions<Item>
  /**
   * pagination state
   */
  pagination: UsePaginationReturnsState<Item[]> & UsePaginationReturnsActions
}

/**
 * A hook for handling paging lists that integrates the functionalities of `useQuery`, `useForm`, `useMultiSelect`, and `usePagination`.
 *
 * @since 1.7.0
 */
export function usePagingList<Item, FormState extends object = object>(
  options: UsePagingListOptions<Item, FormState> = {},
): UsePagingListReturns<Item, FormState> {
  type Fetcher = UsePagingListFetcher<Item, FormState>

  const previousDataRef = useRef<Item[] | undefined>(undefined)
  const previousFormRef = useRef<FormState>((options.form?.initialValue || {}) as FormState)
  const previousSelectedRef = useRef<Item[]>([])
  const isFormChangedRef = useRef<boolean>(false)
  const isStartingNewQueryRef = useRef<boolean>(false)
  const [total, setTotal] = useSafeState<number>(Number.POSITIVE_INFINITY)

  const form = useForm<FormState>({
    ...options.form,
    onReset(...args) {
      startNewQuery()
      return latest.current.options.form?.onReset?.(...args)
    },
    onSubmit(...args) {
      const form = args[0]
      const isFormChanged = isFormChangedRef.current

      if (isFormChanged) {
        startNewQuery()
      } else {
        query.run({
          previousData: previousDataRef.current,
          page: paginationState.page,
          pageSize: paginationState.pageSize,
          form,
          setTotal,
        })
      }

      latest.current.options.form?.onSubmit?.(...args)
    },
    onChange(...args) {
      isFormChangedRef.current = true

      const nextForm = args[0]
      const keys = options.immediateQueryKeys || []

      for (const key of keys) {
        const isChanged = !shallowEqual(previousFormRef.current[key], nextForm[key])

        if (isChanged) {
          startNewQuery()
          break
        }
      }

      previousFormRef.current = nextForm

      return latest.current.options.form?.onChange?.(...args)
    },
  })

  const startNewQuery = useStableFn(() => {
    isStartingNewQueryRef.current = true
    previousDataRef.current = undefined
    paginationActions.go(1)

    query.run({
      previousData: previousDataRef.current,
      page: 1,
      pageSize: paginationState.pageSize,
      form: form.value,
      setTotal,
    })
  })

  const [paginationState, paginationActions] = usePagination<Item[]>({
    ...options.pagination,
    list: undefined,
    total,
    onPageChange(state) {
      if (!isStartingNewQueryRef.current) {
        query.run({
          previousData: previousDataRef.current,
          page: state.page,
          pageSize: state.pageSize,
          form: form.value,
          setTotal,
        })
      }

      latest.current.options.pagination?.onPageChange?.(state)
    },
    onPageSizeChange(state) {
      startNewQuery()
      latest.current.options.pagination?.onPageSizeChange?.(state)
    },
  })

  const query = useQuery<Fetcher>(options?.fetcher as Fetcher, {
    ...options.query,
    initialParams: [
      {
        previousData: undefined,
        page: paginationState.page,
        pageSize: paginationState.pageSize,
        form: form.value,
        setTotal,
      },
    ] as Parameters<Fetcher>,
    onBefore(...args) {
      if (latest.current.selectState.selected.length) {
        previousSelectedRef.current = latest.current.selectState.selected
      }
      latest.current.options.query?.onBefore?.(...args)
    },
    onSuccess(data, ...reset) {
      previousDataRef.current = data

      if (previousSelectedRef.current.length) {
        const selected = []

        for (const item of previousSelectedRef.current) {
          const matchedSelectedItem = data.find((d) => shallowEqual(d, item))

          if (matchedSelectedItem) {
            selected.push(matchedSelectedItem)
          }
        }

        selectActions.setSelected(selected)
        previousSelectedRef.current = []
      }

      latest.current.options.query?.onSuccess?.(data, ...reset)
    },
    onFinally(...args) {
      isFormChangedRef.current = false
      isStartingNewQueryRef.current = false

      latest.current.options.query?.onFinally?.(...args)
    },
  })

  const [selectState, selectActions] = useMultiSelect<Item>(query.data ?? [], [])

  const latest = useLatest({ options, selectState, paginationState })

  const refresh = useStableFn(() => query.refresh())

  return {
    get params() {
      return query.params
    },
    get loadingSlow() {
      return query.loadingSlow
    },
    get error() {
      return query.error
    },
    get loading() {
      return query.loading
    },
    get refreshing() {
      return query.refreshing
    },
    get initializing() {
      return query.initializing
    },
    get list() {
      return (query.data ?? []) as Item[]
    },
    form,
    refresh,
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
