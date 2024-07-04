import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isFunction, isObject } from '../utils/basic'

import type { UseSafeStateOptions } from '../use-safe-state'

export interface UseControlledComponentOptions<T = string, P extends object = object> extends UseSafeStateOptions {
  /**
   * The callback that is called when the value of the controlled component changes
   */
  onChange?: (value: T, preValue?: T) => void
  /**
   * The callback that is called when the value of the controlled component is reset
   */
  onReset?: (initialValue: T) => void
  /**
   * The props of the controlled component
   */
  props?: P | ((value: T) => P)
  /**
   * The fallback value of the controlled component
   */
  fallbackValue?: T
}

export interface ControlledComponentProps<T> {
  /**
   * The value of the controlled component
   */
  value: T
  /**
   * The callback that is called when the value of the controlled component changes
   */
  onChange: (eventOrValue?: T | { target: { value: T } }) => void
}

export interface UseControlledComponentReturns<T, P> {
  /**
   * The value of the controlled component
   */
  value: T
  /**
   * The props that should be passed to the controlled component
   */
  props: ControlledComponentProps<T> & P
  /**
   * Reset the value of the controlled component to the initial value
   */
  reset(): void
  /**
   * Set the value of the controlled component
   */
  setValue: (value: T) => void
}

/**
 * A React Hook that helps you to manage controlled components that receive `value` and `onChange` props meeting the following type.
 */
export function useControlledComponent<T = string, P extends object = object>(
  initialValue: T = '' as T,
  options: UseControlledComponentOptions<T, P> = {},
): UseControlledComponentReturns<T, P> {
  const { fallbackValue, onReset, props, onChange, ...stateOptions } = options

  const [value, setValue] = useSafeState(initialValue as T, stateOptions)

  function handleChange(eventOrValue?: T | { target: { value: T } }) {
    let newValue = (eventOrValue ?? fallbackValue) as T

    if (isObject(eventOrValue) && 'target' in eventOrValue && 'value' in eventOrValue.target) {
      newValue = (eventOrValue.target.value ?? fallbackValue) as T
    }

    const { onChange, value: lastValue } = latest.current

    setValue(newValue)
    onChange?.(newValue, lastValue)
  }

  const latest = useLatest({ value, onChange, onReset })

  const reset = useStableFn(() => {
    setValue(initialValue as T)
    latest.current.onReset?.(initialValue)
  })

  const comProps = (isFunction(props) ? props(value) : props ?? {}) as P

  return {
    value,
    reset,
    props: { ...comProps, onChange: handleChange, value },
    setValue: useStableFn((value: T) => handleChange(value)),
  }
}
