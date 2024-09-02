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
      setValue: form.setValue,
      setFieldValue: form.setFieldValue,
      reset: form.reset,
      submit: form.submit,
      initialValue: form.initialValue,

      get value() {
        return form.value
      },
      get submitting() {
        return form.submitting
      },

      handleChange: form.handleChange,
      handleSubmit: form.handleSubmit,
      handleReset: form.handleReset,

      checkValidity: form.checkValidity,
      reportValidity: form.reportValidity,
      nativeProps: form.nativeProps,
    },
  }
}
