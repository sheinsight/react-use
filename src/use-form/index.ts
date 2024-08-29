import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'

import type { UseSetStateSetMergedState } from '../use-set-state'

export interface UseFormOptions<FormState extends object> {
  /**
   * Initial value of the form
   *
   * @defaultValue {}
   */
  initialValue?: FormState
  /**
   * Callback to be called when the form value changes
   *
   * @defaultValue undefined
   */
  onChange?(form: FormState): void
  /**
   * Callback to be called when the form is submitted
   *
   * @defaultValue undefined
   */
  onSubmit?(form: FormState): void
  /**
   * Callback to be called when the form is reset
   *
   * @defaultValue undefined
   */
  onReset?(): void
}

export type UseFormReturnsProps<FormState extends object> = {
  /**
   * Current value of the form
   */
  value: FormState
  /**
   * Callback to be called when the form value changes
   */
  onChange(form: FormState): void
  /**
   * Callback to be called when the form is submitted
   */
  onSubmit(form: FormState): void
  /**
   * Callback to be called when the form is reset
   */
  onReset(): void
}

export interface UseFormReturns<FormState extends object> {
  /**
   * Whether the form is submitting
   */
  submitting: boolean
  /**
   * Form related props
   */
  setValue: UseSetStateSetMergedState<FormState>
  /**
   * Reset the form to its initial value
   */
  reset(): void
  /**
   * Submit the form
   */
  submit(): void
  /**
   * Current value of the form
   */
  value: FormState
  /**
   * Form related props
   */
  props: UseFormReturnsProps<FormState>
}

/**
 * A React Hook to manage form state with ease
 *
 * @param {UseFormOptions} options Options to customize the form behavior
 */
export function useForm<FormState extends object>(options: UseFormOptions<FormState> = {}): UseFormReturns<FormState> {
  const [formValue, setFormValue] = useSetState<FormState>(options.initialValue ?? ({} as FormState))

  const latest = useLatest({ formValue, options })

  const submitFn = useAsyncFn(options.onSubmit ?? (() => {}))

  const handleChange = useStableFn((form: FormState) => {
    setFormValue(form)
    latest.current.options.onChange?.(form)
  })

  const handleReset = useStableFn(() => {
    setFormValue(options.initialValue ?? {})
    latest.current.options.onReset?.()
  })

  const submit = useStableFn(() => {
    submitFn.run(latest.current.formValue)
  })

  return {
    get submitting() {
      return submitFn.loading
    },
    setValue: setFormValue,
    reset: handleReset,
    submit,
    value: formValue,
    props: {
      value: formValue,
      onChange: handleChange,
      onSubmit: submitFn.run,
      onReset: handleReset,
    },
  }
}
