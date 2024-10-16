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
import type { UseQueryOptions } from '../use-query'
import type { ReactSetState } from '../use-safe-state'
import type { AnyFunc } from '../utils/basic'

export interface UsePagingListOptions<Fetcher extends AnyFunc, FormState extends object> {
  /**
   * fetcher function that will be called when the query is triggered
   */
  fetcher?: Fetcher
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
  query?: Omit<UseQueryOptions<Fetcher>, 'initialParams' | 'initialData'>
  /**
   * options for `usePagination`, see `usePagination` for more details
   *
   * @defaultValue undefined
   */
  pagination?: UsePaginationOptions<ReturnType<Fetcher>>
  /**
   * keys of form state that will trigger a new query when changed
   *
   * @defaultValue []
   */
  immediateQueryKeys?: (keyof FormState)[]
}

export interface UsePagingListFetcherParams<FormState extends object, Data> {
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
  /**
   * set total count
   */
  setTotal: ReactSetState<number>
}

export type UsePagingListFetcher<FormState extends object, Data> = (
  params: UsePagingListFetcherParams<FormState, Data>,
) => Promise<Data>

export interface UsePagingListReturns<Item, FormState extends object, Data extends Item[]> {
  /**
   * loading status
   */
  loading: boolean
  /**
   * list data
   */
  list: Data
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
  pagination: UsePaginationReturnsState<Data> & UsePaginationReturnsActions
}

/**
 * A hook for handling paging lists that integrates the functionalities of `useQuery`, `useForm`, `useMultiSelect`, and `usePagination`.
 *
 * @since 1.7.0
 */
export function usePagingList<
  Item,
  FormState extends object = object,
  Data extends Item[] = Item[],
  Fetcher extends UsePagingListFetcher<FormState, Data> = UsePagingListFetcher<FormState, Data>,
>(options: UsePagingListOptions<Fetcher, FormState> = {}): UsePagingListReturns<Item, FormState, Data> {
  const previousDataRef = useRef<Data | undefined>(undefined)
  const previousFormRef = useRef<FormState>((options.form?.initialValue || {}) as FormState)
  const previousSelectedRef = useRef<Item[]>([])
  const [total, setTotal] = useSafeState<number>(10)

  const form = useForm<FormState>({
    ...options.form,
    onReset(...args) {
      startNewQuery()
      return latest.current.options.form?.onReset?.(...args)
    },
    onSubmit(...args) {
      const form = args[0]

      query.run({
        previousData: previousDataRef.current,
        page: paginationState.page,
        pageSize: paginationState.pageSize,
        form,
        setTotal,
      })

      latest.current.options.form?.onSubmit?.(...args)
    },
    onChange(...args) {
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

  const startNewQuery = useStableFn((resetPageSize = false) => {
    previousDataRef.current = undefined
    paginationActions.go(1)

    let pageSize = paginationState.pageSize

    if (resetPageSize) {
      paginationActions.setPageSize(options.pagination?.pageSize ?? 10)
      pageSize = options.pagination?.pageSize ?? 10
    }

    query.run({
      previousData: previousDataRef.current,
      page: 1,
      pageSize,
      form: form.value,
      setTotal,
    })
  })

  const [paginationState, paginationActions] = usePagination<Data>({
    ...options.pagination,
    list: undefined,
    total,
    onPageChange(state) {
      query.run({
        previousData: previousDataRef.current,
        page: state.page,
        pageSize: state.pageSize,
        form: form.value,
        setTotal,
      })
      latest.current.options.pagination?.onPageChange?.(state)
    },
    onPageSizeChange(state) {
      startNewQuery()
      latest.current.options.pagination?.onPageSizeChange?.(state)
    },
  })

  const query = useQuery<Fetcher>((options.fetcher ?? (() => {})) as Fetcher, {
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
          matchedSelectedItem && selected.push(matchedSelectedItem)
        }

        selectActions.setSelected(selected)
        previousSelectedRef.current = []
      }

      latest.current.options.query?.onSuccess?.(data, ...reset)
    },
  })

  const [selectState, selectActions] = useMultiSelect<Item>(query.data ?? [], [])

  const latest = useLatest({ options, selectState, paginationState })

  const refresh = useStableFn(() => query.refresh())

  return {
    get loading() {
      return query.loading
    },
    list: (query.data ?? []) as Data,
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
