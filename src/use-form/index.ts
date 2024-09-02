import { useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRender } from '../use-render'
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
   * Initial value of the form
   */
  initialValue: FormState
  /**
   * handle form value changes
   */
  handleChange(form: FormState): void
  /**
   * handle form submit
   */
  handleSubmit(form: FormState): void
  /**
   * handle form reset
   */
  handleReset(): void
  /**
   * Check and report the native form validity, only valid for native form
   */
  reportValidity(): boolean
  /**
   * Check the native form validity, only valid for native form
   */
  checkValidity(): boolean
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
    initialValue = {} as FormState,
    triggerOnChangeWhenReset = false,
    preventDefaultWhenSubmit = true,
    onChange = noop,
    onReset = noop,
    onSubmit = noop,
  } = options

  const render = useRender()
  const formRef = useRef<HTMLFormElement>(null)
  const formValueRef = useRef<FormState>(initialValue)

  const latest = useLatest({
    initialValue,
    triggerOnChangeWhenReset,
    preventDefaultWhenSubmit,
    onChange,
    onReset,
  })

  const setFormValue = useStableFn((value: FormState) => {
    formValueRef.current = value
    !formRef.current && render()
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
    return submitFn.run(formValueRef.current)
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

    handleSubmit(formValueRef.current)
  })

  const handleNativeReset = useStableFn((e: FormEvent<HTMLFormElement>) => {
    handleReset()
  })

  const setValue = useStableFn((form: SetStateAction<FormState>) => {
    const nextForm = isFunction(form) ? form(formValueRef.current) : form

    // for uncontrollable form (by using nativeProps)
    formRef.current && syncFormStateToDom(formRef.current, nextForm, latest.current.initialValue)

    handleChange(nextForm)
  })

  const setFieldValue = useStableFn(<Name extends keyof FormState>(name: Name, value: FormState[Name]) => {
    if (formValueRef.current[name] === value) return

    const nextForm = {
      ...formValueRef.current,
      [name]: value,
    }

    setValue(nextForm)
  })

  const checkValidity = useStableFn(() => {
    if (!formRef.current) return false
    return formRef.current.checkValidity()
  })

  const reportValidity = useStableFn(() => {
    if (!formRef.current) return false
    return formRef.current.reportValidity()
  })

  useMount(() => {
    if (formRef.current) {
      syncFormStateToDom(formRef.current, formValueRef.current, initialValue)
    }
  })

  return {
    get value() {
      // use `getter` to prevent expiring state
      return formValueRef.current
    },
    get submitting() {
      // for dependencies collection
      return submitFn.loading
    },
    initialValue,
    reset,
    submit,
    setValue,
    setFieldValue,
    handleReset,
    handleSubmit,
    handleChange,
    checkValidity,
    reportValidity,
    nativeProps: {
      ref: formRef,
      onChange: handleNativeChange,
      onSubmit: handleNativeSubmit,
      onReset: handleNativeReset,
    },
  }
}
