import { type UseFormOptions, useForm } from '../use-form'
import { type UseQueryOptions, useQuery } from '../use-query'

import type { AnyFunc } from '../utils/basic'

export interface UseProListOptions<Fetcher extends AnyFunc, FormState extends object> {
  form?: UseFormOptions<FormState>
  query?: UseQueryOptions<Fetcher>
}

export interface UseProListFetcherParams<FormState extends object> {
  page: number
  pageSize: number
  form: FormState
}

export type UseProListFetcher<FormState extends object> = (params: UseProListFetcherParams<FormState>) => any

export function useProList<FormState extends object, Fetcher extends UseProListFetcher<FormState>>(
  fetcher: Fetcher,
  options: UseProListOptions<Fetcher, FormState> = {},
) {
  const form = useForm(options.form)

  const query = useQuery(fetcher, {
    // default query options
    ...options.query,
  })

  return {
    form: {
      value: form.value,
      setValue: form.setValue,
      reset: form.reset,
      submit: form.submit,
      props: form.props,
      get submitting() {
        return form.submitting
      },
    },
  }
}

// useForm

// useProList => useForm + usePagination + useQuery
