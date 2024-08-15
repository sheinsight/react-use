import { useRef } from 'react'
import { useAsyncFn } from '../use-async-fn'
import { useLatest } from '../use-latest'
import { useTrackedRefState } from '../use-tracked-ref-state'
import { useVersionedAction } from '../use-versioned-action'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import { useCreation } from '../use-creation'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingSlowFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseAsyncFnOptions<T, D, E> {
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

export interface UseLoadingSlowFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseAsyncFnReturns<T, D, E> {
  /**
   * Whether the loading is slow.
   */
  loadingSlow: boolean
}

/**
 * A hook to run an async function and determine if the loading is slow.
 *
 * @since 1.4.0
 */
export function useLoadingSlowFn<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fn: T,
  options: UseLoadingSlowFnOptions<T, D, E> = {},
): UseLoadingSlowFnReturns<T, D, E> {
  const { loadingTimeout = 0, onLoadingSlow, ...useAsyncFnOptions } = options

  const latest = useLatest({ fn, loadingTimeout })
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const [refState, actions] = useTrackedRefState({ loadingSlow: false })
  const [incVersion, runVersionedAction] = useVersionedAction()

  const asyncFnReturns = useAsyncFn<T, D, E>(
    (async (...args) => {
      actions.updateRefState('loadingSlow', false)

      const version = incVersion()

      if (latest.current.loadingTimeout) {
        timerRef.current = setTimeout(() => {
          runVersionedAction(version, () => {
            timerRef.current = undefined
            actions.updateRefState('loadingSlow', true)
            onLoadingSlow?.()
          })
        }, latest.current.loadingTimeout)
      }

      const result = await latest.current.fn(...args)

      runVersionedAction(version, () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        actions.updateRefState('loadingSlow', false)
      })

      return result
    }) as T,
    {
      ...useAsyncFnOptions,
      onCancel(...args) {
        incVersion()
        actions.updateRefState('loadingSlow', false)
        useAsyncFnOptions.onCancel?.(...args)
      },
    },
  )

  const result = useCreation(() => {
    const result = asyncFnReturns as UseLoadingSlowFnReturns<T, D, E>

    Object.defineProperty(result, 'loadingSlow', {
      get() {
        return refState.loadingSlow
      },
    })

    return result
  })

  return result
}
