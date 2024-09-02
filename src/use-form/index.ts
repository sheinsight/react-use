import { useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isFunction, noop } from '../utils/basic'
import { getFormStateFromDom, isInvalidFormChildElement, syncFormStateToDom } from './bind-dom'

import type { ChangeEvent, FormEvent, RefObject, SetStateAction } from 'react'
import type { ReactSetState } from '../use-safe-state'

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
  /**
   * When use `nativeProps`, whether to prevent default when the form is submitted
   *
   * @defaultValue true
   */
  preventDefaultWhenSubmit?: boolean
  /**
   * Whether to emit change event when the form is reset
   *
   * @defaultValue false
   */
  triggerOnChangeWhenReset?: boolean
}

export type UseFormReturnsProps<FormState extends object> = {
  /**
   * Current value of the form
   */
  value: FormState
  /**
   * Initial value of the form
   */
  defaultValue: FormState
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

export type UseFormReturnsNativeProps = {
  /**
   * Ref of the form element
   */
  ref: RefObject<HTMLFormElement>
  /**
   * Callback to be called when the form value changes
   */
  onChange(e: ChangeEvent<HTMLFormElement>): void
  /**
   * Callback to be called when the form is submitted
   */
  onSubmit(e: ChangeEvent<HTMLFormElement>): void
  /**
   * Callback to be called when the form is reset
   */
  onReset(e: ChangeEvent<HTMLFormElement>): void
}

export interface UseFormReturns<FormState extends object> {
  /**
   * Whether the form is submitting
   */
  submitting: boolean
  /**
   * Set the new value of the whole form
   */
  setValue: ReactSetState<FormState>
  /**
   * Set a field value of the form
   */
  setFieldValue<Name extends keyof FormState>(name: Name, value: FormState[Name]): void
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
  /**
   * Native form related props
   */
  nativeProps: UseFormReturnsNativeProps
}

/**
 * A React Hook to manage form state with ease
 *
 * @param {UseFormOptions} options Options to customize the form behavior
 */
export function useForm<FormState extends object>(options: UseFormOptions<FormState> = {}): UseFormReturns<FormState> {
  const {
    initialValue = {},
    triggerOnChangeWhenReset = false,
    preventDefaultWhenSubmit = true,
    onChange = noop,
    onReset = noop,
    onSubmit = noop,
  } = options

  const formRef = useRef<HTMLFormElement>(null)
  const [formValue, setFormValue] = useSafeState<FormState>(initialValue as FormState)

  const latest = useLatest({
    formValue,
    initialValue: initialValue as FormState,
    triggerOnChangeWhenReset,
    preventDefaultWhenSubmit,
    onChange,
    onReset,
  })

  const submitFn = useAsyncFn(onSubmit)

  const handleChange = useStableFn((form: FormState) => {
    setFormValue(form)
    latest.current.onChange(form)
  })

  const handleSubmit = useStableFn((form: FormState) => {
    submitFn.run(form)
  })

  const submit = useStableFn(() => {
    handleSubmit(latest.current.formValue)
  })

  const handleReset = useStableFn(() => {
    setValue(latest.current.initialValue)

    latest.current.onReset()

    if (latest.current.triggerOnChangeWhenReset) {
      latest.current.onChange(latest.current.initialValue)
    }
  })

  const reset = useStableFn(() => {
    handleReset()
  })

  const handleNativeChange = useStableFn((e: FormEvent<HTMLFormElement>) => {
    if (!isInvalidFormChildElement(e.target) || !formRef.current) return
    const nextForm = getFormStateFromDom<FormState>(formRef.current, latest.current.initialValue)
    handleChange(nextForm)
  })

  const handleNativeSubmit = useStableFn((e: FormEvent<HTMLFormElement>) => {
    if (latest.current.preventDefaultWhenSubmit) {
      e.preventDefault()
      e.stopPropagation()
    }

    handleSubmit(latest.current.formValue)
  })

  const handleNativeReset = useStableFn((e: FormEvent<HTMLFormElement>) => {
    handleReset()
  })

  const setValue = useStableFn((form: SetStateAction<FormState>) => {
    const nextForm = isFunction(form) ? form(latest.current.formValue) : form

    // for uncontrollable form (by using nativeProps)
    formRef.current && syncFormStateToDom(formRef.current, nextForm, latest.current.initialValue)

    handleChange(nextForm)
  })

  const setFieldValue = useStableFn(<Name extends keyof FormState>(name: Name, value: FormState[Name]) => {
    if (latest.current.formValue[name] === value) return

    const nextForm = {
      ...latest.current.formValue,
      [name]: value,
    }

    setValue(nextForm)
  })

  useMount(() => {
    if (formRef.current) {
      syncFormStateToDom(formRef.current, latest.current.formValue, latest.current.initialValue)
    }
  })

  return {
    reset,
    submit,
    value: formValue,
    setValue,
    setFieldValue,
    get submitting() {
      return submitFn.loading
    },
    props: {
      value: formValue,
      defaultValue: initialValue as FormState,
      onChange: handleChange,
      onSubmit: handleSubmit,
      onReset: handleReset,
    },
    nativeProps: {
      ref: formRef,
      onChange: handleNativeChange,
      onSubmit: handleNativeSubmit,
      onReset: handleNativeReset,
    },
  }
}
