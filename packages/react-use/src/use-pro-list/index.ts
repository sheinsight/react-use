import { useRef } from 'react'
import { useForm } from '../use-form'
import { useLatest } from '../use-latest'
import { useMultiSelect } from '../use-multi-select'
import { usePagination } from '../use-pagination'
import { usePrevious } from '../use-previous'
import { useQuery } from '../use-query'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { UseFormOptions } from '../use-form'
import type { UsePaginationOptions } from '../use-pagination'
import type { UseQueryOptions } from '../use-query'
import type { AnyFunc } from '../utils/basic'

export interface UseProListOptions<Fetcher extends AnyFunc, FormState extends object> {
  form?: UseFormOptions<FormState>
  query?: Omit<UseQueryOptions<Fetcher>, 'initialParams' | 'initialData'>
  pagination?: UsePaginationOptions<ReturnType<Fetcher>>
  immediateQueryKeys?: (keyof FormState)[]
}

export interface UseProListFetcherParams<FormState extends object, Data> {
  previousData: undefined | Data
  page: number
  pageSize: number
  form: FormState
}

export type UseProListFetcher<FormState extends object, Data> = (
  params: UseProListFetcherParams<FormState, Data>,
) => Data

// useProList => useForm + useMultiSelect + usePagination + useQuery

export function useProList<FormState extends object, Data, Fetcher extends UseProListFetcher<FormState, Data>>(
  fetcher: Fetcher,
  options: UseProListOptions<Fetcher, FormState> = {},
) {
  const previousData = useRef<Data | undefined>(undefined)
  const [list, setList] = useSafeState<Data[]>([])

  const form = useForm<FormState>({
    ...options.form,
    onReset(...args) {
      startNewQuery()
      latest.current.options.form?.onReset?.(...args)
    },
    onSubmit(...args) {
      startNewQuery()
      latest.current.options.form?.onSubmit?.(...args)
    },
    onChange(...args) {
      const keys = options.immediateQueryKeys || []
      for (const key of keys) {
        if (form.value[key] !== previousFormValue?.[key]) {
          startNewQuery()
          break
        }
      }
      latest.current.options.form?.onChange?.(...args)
    },
  })

  const previousFormValue = usePrevious(form.value)

  const [paginationState, paginationActions] = usePagination<Data>({
    ...options.pagination,
    onPageChange(state) {
      query.run({
        previousData: previousData.current,
        page: state.page,
        pageSize: state.pageSize,
        form: form.value,
      })
      latest.current.options.pagination?.onPageChange?.(state)
    },
    onPageSizeChange(state) {
      startNewQuery()
      latest.current.options.pagination?.onPageSizeChange?.(state)
    },
  })

  const startNewQuery = useStableFn((resetPageSize = false) => {
    setList([])
    previousData.current = undefined
    paginationActions.go(1)

    let pageSize = paginationState.pageSize

    if (resetPageSize) {
      paginationActions.setPageSize(options.pagination?.pageSize ?? 10)
      pageSize = options.pagination?.pageSize ?? 10
    }

    query.run({
      previousData: previousData.current,
      page: 1,
      pageSize,
      form: form.value,
    })
  })

  const query = useQuery(fetcher, {
    ...options.query,
    initialParams: [
      {
        previousData: undefined,
        page: paginationState.page,
        pageSize: paginationState.pageSize,
        form: form.value,
      },
    ] as Parameters<Fetcher>,
    onSuccess(data, ...reset) {
      previousData.current = data
      setList((prevDataList) => [...prevDataList, data].filter(Boolean))
      latest.current.options.query?.onSuccess?.(data, ...reset)
    },
  })

  const [select, selectActions] = useMultiSelect<Data>(list, [])

  const latest = useLatest({ options, paginationState })

  return {
    list,
    form,
    query,
    selection: {
      ...select,
      ...selectActions,
    },
    pagination: {
      ...paginationState,
      ...paginationActions,
    },
  }
}
