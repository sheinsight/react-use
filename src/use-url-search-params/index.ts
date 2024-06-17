import { useEventListener } from '../use-event-listener'
import { useMount } from '../use-mount'
import { usePausableUpdateDeepCompareEffect } from '../use-pausable-update-deep-compare-effect'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { isDefined, notNullish } from '../utils/basic'

import type { Arrayable } from 'vitest'
import type { UseSetStateSetMergedState } from '../use-set-state'
import type { Noop, PureObject } from '../utils/basic'

export type UrlParams = Record<string, Arrayable<string | number | boolean | undefined>>
export type UseUrlSearchParamsMode = 'history' | 'hash' | 'hash-params'

export interface UseUrlSearchParamsOptions<T> {
  /**
   * Remove nullish values from the URLSearchParams
   *
   * @default true
   */
  removeNullishValues?: boolean
  /**
   * Remove falsy values from the URLSearchParams
   *
   * @default false
   */
  removeFalsyValues?: boolean
  /**
   * Initial value for the URLSearchParams
   *
   * @default {}
   */
  initialValue?: T & Record<string, Arrayable<string | number | boolean | undefined>>
  /**
   * Write back to `window.history` automatically
   *
   * @default true
   */
  write?: boolean
}

export type UseUrlSearchParamsReturn<T extends Record<string, Arrayable<string | number | boolean | undefined>>> = [
  T,
  UseSetStateSetMergedState<T>,
  Noop,
]

export function useUrlSearchParams<
  T extends Record<string, Arrayable<string | number | boolean | undefined>> = UrlParams,
>(mode: UseUrlSearchParamsMode = 'history', options: UseUrlSearchParamsOptions<T> = {}): UseUrlSearchParamsReturn<T> {
  const {
    initialValue = {} as T,
    removeNullishValues: rmNullish = true,
    removeFalsyValues: rmFalsy = false,
    write: enableWrite = true,
  } = options

  const [state, setState] = useSetState<T>(initialValue as T, { deep: true })

  function read() {
    return new URLSearchParams(getRawParams(mode))
  }

  function updateState(params: URLSearchParams) {
    const unusedKeys = new Set(Object.keys(state))
    const nextState: Record<string, undefined | string | string[]> = {}

    for (const key of params.keys()) {
      const allValue = params.getAll(key)
      const isArray = (key in initialValue && Array.isArray(initialValue[key])) || allValue.length > 1
      const value = params[isArray ? 'getAll' : 'get'](key)
      if (notNullish(value)) nextState[key] = value
      unusedKeys.delete(key)
    }

    const unusedProps = Object.fromEntries(
      [...unusedKeys.entries()].map(([k, _v]) => {
        const isArray = k in initialValue && Array.isArray(initialValue[k])
        return [k, isArray ? [] : undefined]
      }),
    )

    setState({ ...nextState, ...unusedProps } as Pick<T, keyof T>)
  }

  const pausable = usePausableUpdateDeepCompareEffect(() => {
    enableWrite && write(obj2URLSearchParams(state, rmNullish, rmFalsy))
  }, [state, enableWrite, rmNullish, rmFalsy])

  function write(params: URLSearchParams) {
    pausable.pause()
    history.replaceState(history.state, document.title, location.pathname + constructQuery(params, mode))
    pausable.resume()
  }

  function handleChange() {
    updateState(read())
  }

  useEventListener(() => window, 'popstate', handleChange, false)

  useEventListener(() => window, mode !== 'history' ? 'hashchange' : [], handleChange, false)

  useMount(() => {
    const initialSp = read()

    if (initialSp.size) {
      updateState(initialSp)
    } else {
      const sp = obj2URLSearchParams(initialValue, rmNullish, rmFalsy)
      sp.size && enableWrite && write(sp)
    }
  })

  const clearParams = useStableFn(() => {
    updateState(new URLSearchParams())
    enableWrite && write(new URLSearchParams())
  })

  return [state, setState, clearParams] as const
}

function getRawParams(mode: UseUrlSearchParamsMode) {
  if (mode === 'history') {
    return location.search || ''
  }

  const hash = (location.hash || '').replace(/^#/, '')
  const index = hash.indexOf('?')

  if (mode === 'hash') {
    return index >= 0 ? hash.slice(index) : ''
  }

  if (mode === 'hash-params') {
    return index >= 0 ? hash.slice(0, index) : hash
  }
}

function constructQuery(params: URLSearchParams, mode: UseUrlSearchParamsMode) {
  const stringified = params.toString()

  /**
   * /path/to/page?mode=history#hash
   */
  if (mode === 'history') {
    return `${stringified ? `?${stringified}` : ''}${location.hash || ''}`
  }

  const search = location.search
  const hash = (location.hash || '').replace(/^#/, '')
  const questionMarkIdx = hash.indexOf('?')

  /**
   * /path/to/page#hash-pre?mode=hash
   *
   * hash = hash-pre?mode=hash
   * hashPrefix = hash-pre
   */
  if (mode === 'hash') {
    const prefix = questionMarkIdx >= 0 ? hash.slice(0, questionMarkIdx) : hash
    return `${search}${prefix || stringified ? '#' : ''}${prefix}${stringified ? `?${stringified}` : ''}`
  }

  /**
   * /path/to/page#mode=hash-params?hash-suffix
   *
   * hash = mode=hash-params?hash-suffix
   */
  if (mode === 'hash-params') {
    const suffix = questionMarkIdx >= 0 ? hash.slice(questionMarkIdx) : ''
    return `${search}${suffix || stringified ? '#' : ''}${stringified || ''}${suffix}`
  }

  return ''
}

function obj2URLSearchParams(obj: PureObject, rmNullish = false, rmFalsy = false) {
  const sp: URLSearchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isDefined(item)) {
          sp.append(key, item.toString())
        }
      }
    } else if (rmNullish && !notNullish(value)) {
      sp.delete(key)
    } else if (rmFalsy && !value) {
      sp.delete(key)
    } else {
      if (isDefined(value)) {
        sp.set(key, value.toString())
      } else {
        sp.delete(key)
      }
    }
  }

  return sp
}
