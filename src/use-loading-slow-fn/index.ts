import { useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useTimeout } from '../use-timeout'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingSlowOptions extends UseAsyncFnOptions {
  /**
   * The timeout duration in milliseconds to determine if the loading is slow.
   *
   * @defaultValue 3_000 ms
   */
  loadingTimeout?: number
}

export interface UseLoadingSlowReturns<T extends AnyFunc> extends UseAsyncFnReturns<T> {
  /**
   * Whether the loading is slow.
   */
  loadingSlow: boolean
}

export function useLoadingSlowFn<T extends AnyFunc>(fn: T, options: UseLoadingSlowOptions = {}) {
  const { loadingTimeout = 3_000, ...useAsyncFnOptions } = options

  const versionRef = useRef(0)
  const latest = useLatest({ fn })
  const { isTimeout, ...controls } = useTimeout(loadingTimeout, { controls: true })

  const asyncFn = useAsyncFn(async () => {
    if (controls.isActive()) {
      controls.pause()
    }

    controls.reset()
    controls.resume()

    const ver = ++versionRef.current
    const result = await latest.current.fn()

    if (ver === versionRef.current) {
      controls.reset()
    }

    return result
  }, useAsyncFnOptions)

  return {
    ...asyncFn,
    loadingSlow: isTimeout,
  }
}
