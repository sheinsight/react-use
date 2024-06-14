import { useEffect } from 'react'
import { useLatest } from '../use-latest'
import { useMutationObserver } from '../use-mutation-observer'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { normalizeElement, useTargetElement } from '../use-target-element'
import { isFunction, unwrapGettable } from '../utils'

import type { ReactSetState } from '../use-safe-state'
import type { ElementTarget } from '../use-target-element'
import type { Gettable } from '../utils'

export interface UseCssVarOptions {
  /**
   * default value of the css variable
   *
   * @default ''
   */
  defaultValue?: string
  /**
   * whether to observe the changes of the css variable
   *
   * @default false
   */
  observe?: boolean
}

export function useCssVar<T extends HTMLElement = HTMLElement>(
  propName: Gettable<string>,
  options: UseCssVarOptions = {},
  target: ElementTarget<T> = () => document.documentElement as T,
): [string, ReactSetState<string>] {
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

  const setVariable = useStableFn((value: React.SetStateAction<string>) => {
    const { propName, variable } = latest.current
    const newValue = isFunction(value) ? value(variable) : value

    if (el.current?.style) {
      el.current.style.setProperty(propName, newValue)
    }

    _setVariable(value)
  })

  useMutationObserver(observe ? el : null, getPropertyValue, { attributes: true })

  useEffect(() => void getPropertyValue(), [])

  return [variable, setVariable] as const
}

function getCssVar<T extends HTMLElement = HTMLElement>(
  propName: string,
  target: ElementTarget<T> = () => document.documentElement as T,
  defaultValue = '',
): string {
  const el = normalizeElement(target)

  if (!el) return defaultValue

  return window.getComputedStyle(el).getPropertyValue(propName).trim() || ''
}
