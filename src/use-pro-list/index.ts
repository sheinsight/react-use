import { useForm } from '../use-form'
import { useQuery } from '../use-query'

import type { UseFormOptions } from '../use-form'
import type { UseQueryOptions } from '../use-query'
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

// useForm

// useProList => useForm + usePagination + useQuery

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
      setFieldValue: form.setFieldValue,
      reset: form.reset,
      submit: form.submit,
      get submitting() {
        return form.submitting
      },
      props: form.props,
      nativeProps: form.nativeProps,
    },
  }
}
