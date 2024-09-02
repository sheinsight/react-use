import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

import type { Noop } from '../utils/basic'

export interface UseBeforeUnloadOptions {
  /**
   * Whether to prevent the default behavior of the event, which leads to showing a browser-native message
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
   *
   * @defaultValue false
   */
  preventDefault?: boolean
}

/**
 * A callback function to run before the page is unloaded
 *
 * @param {BeforeUnloadEvent} event - `BeforeUnloadEvent`, the event object
 * @returns {void} `void`
 */
export type UseBeforeUnloadCallback = (event: BeforeUnloadEvent) => void

/**
 *
 * A React Hook to perform actions **before the page is unloaded** (e.g., closing, refreshing the page) and optionally trigger a browser-native confirmation dialog.
 *
 * set `preventDefault` to `true` to show the confirm leave dialog.
 *
 * @param {UseBeforeUnloadCallback} callback - `UseBeforeUnloadCallback`, the callback function to run before the page is unloaded, see {@link UseBeforeUnloadCallback}
 * @param {UseBeforeUnloadOptions} [options={}] - `UseBeforeUnloadOptions`, options to configure the hook, see {@link UseBeforeUnloadOptions}
 * @returns {Noop} `Noop`, a function that clear the event listener, see {@link Noop}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event | BeforeUnloadEvent - MDN}
 */
export function useBeforeUnload(callback: UseBeforeUnloadCallback, options: UseBeforeUnloadOptions = {}): Noop {
  const { preventDefault = false } = options

  const latest = useLatest({ preventDefault, callback })

  const handler = useStableFn((e: BeforeUnloadEvent) => {
    const { preventDefault, callback } = latest.current

    // Modern browsers need to call `preventDefault` to show a custom dialog
    preventDefault && e.preventDefault()

    // Legacy support, e.g. Chrome/Edge < 119, need to set `returnValue` to show a custom dialog
    if (preventDefault) {
      e.returnValue = true
    }

    callback(e)

    // When using `onbeforeunload`, you must return a truthy string like "Are you sure you want to leave this page?"
    // But in `beforeunload` event, you no longer need to return a string
    // return true
  })

  return useEventListener(() => window, 'beforeunload', handler, { capture: true })
}
