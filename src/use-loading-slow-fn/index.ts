import { useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useRender } from '../use-render'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingSlowFnOptions<D> extends UseAsyncFnOptions<D> {
  /**
   * The timeout duration in milliseconds to determine if the loading is slow.
   *
   * @defaultValue 0 ms
   */
  loadingTimeout?: number
  /**
   * A callback to be called when the loading is slow.
   *
   * @defaultValue undefined
   */
  onLoadingSlow?: () => void
}

export interface UseLoadingSlowFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>>
  extends UseAsyncFnReturns<T, D> {
  /**
   * Whether the loading is slow.
   */
  loadingSlow: boolean
}

export function useLoadingSlowFn<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fn: T,
  options: UseLoadingSlowFnOptions<D> = {},
) {
  const { loadingTimeout = 0, onLoadingSlow, ...useAsyncFnOptions } = options

  const render = useRender()
  const latest = useLatest({ fn, loadingTimeout })

  const stateRef = useRef({
    version: 0,
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
    loadingSlow: { used: false, value: false },
  })

  function updateRefValue<T>(refItem: { used: boolean; value: T }, newValue: T, update = true) {
    if (refItem.value === newValue) return
    refItem.value = newValue
    refItem.used && update && render()
  }

  function runWhenVersionMatch(version: number, fu: AnyFunc) {
    version === stateRef.current.version && fu()
  }

  const asyncFn = useAsyncFn(
    (async () => {
      updateRefValue(stateRef.current.loadingSlow, false)

      const version = ++stateRef.current.version

      if (latest.current.loadingTimeout) {
        stateRef.current.timer = setTimeout(() => {
          runWhenVersionMatch(version, () => {
            stateRef.current.timer = undefined
            updateRefValue(stateRef.current.loadingSlow, true)
            onLoadingSlow?.()
          })
        }, latest.current.loadingTimeout)
      }

      const result = await latest.current.fn()

      runWhenVersionMatch(version, () => {
        if (stateRef.current.timer) {
          clearTimeout(stateRef.current.timer)
        }

        updateRefValue(stateRef.current.loadingSlow, false)
      })

      return result
    }) as T,
    useAsyncFnOptions,
  )

  return {
    mutate: asyncFn.mutate,
    run: asyncFn.run,
    cancel: asyncFn.cancel,
    get value() {
      return asyncFn.value
    },
    get error() {
      return asyncFn.error
    },
    get loading() {
      return asyncFn.loading
    },
    get loadingSlow() {
      stateRef.current.loadingSlow.used = true
      return stateRef.current.loadingSlow.value
    },
  }
}
