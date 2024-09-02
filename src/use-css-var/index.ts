import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useMutationObserver } from '../use-mutation-observer'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { normalizeElement, useTargetElement } from '../use-target-element'
import { isFunction } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'

import type { SetStateAction } from 'react'
import type { ReactSetState } from '../use-safe-state'
import type { ElementTarget } from '../use-target-element'
import type { Gettable } from '../utils/basic'

export interface UseCssVarOptions {
  /**
   * default value of the CSS variable
   *
   * @defaultValue ''
   */
  defaultValue?: string
  /**
   * whether to observe the changes of the CSS variable
   *
   * @defaultValue false
   */
  observe?: boolean
}

export type UseCssVarReturns = readonly [string, ReactSetState<string>]

/**
 * A React Hook that allows you to use CSS variables in your components.
 */
export function useCssVar<T extends HTMLElement = HTMLElement>(
  propName: Gettable<string>,
  options: UseCssVarOptions = {},
  target: ElementTarget<T> = () => document.documentElement as T,
): UseCssVarReturns {
  const { defaultValue = '', observe = false } = options

  const [variable, _setVariable] = useSafeState(defaultValue)

  const el = useTargetElement<T>(target)
  const latest = useLatest({ variable, propName: unwrapGettable(propName), defaultValue })

  const getPropertyValue = useStableFn(() => {
    const { propName, defaultValue } = latest.current

    if (el.current) {
      const value = getCssVar(propName, el, defaultValue)
      _setVariable(value || defaultValue)
    }
  })

  const setVariable = useStableFn((value: SetStateAction<string>) => {
    const { propName, variable } = latest.current
    const newValue = isFunction(value) ? value(variable) : value

    if (el.current?.style) {
      el.current.style.setProperty(propName, newValue)
    }

    _setVariable(value)
  })

  useMount(() => void getPropertyValue())

  useMutationObserver(observe ? el : null, getPropertyValue, { attributes: true })

  return [variable, setVariable] as const
}

function getCssVar<T extends HTMLElement = HTMLElement>(
  propName: string,
  target: ElementTarget<T> = () => document.documentElement as T,
  defaultValue = '',
): string {
  const el = normalizeElement(target)

  if (!el) return defaultValue

  return window.getComputedStyle(el).getPropertyValue(propName).trim()
}
