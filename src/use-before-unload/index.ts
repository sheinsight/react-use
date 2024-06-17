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
   * @default false
   */
  preventDefault?: boolean
}

export type UseBeforeUnloadCallback = (e: BeforeUnloadEvent) => void

/**
 * Do something before page unload (close or refresh and etc.), and optionally show a dialog to confirm.
 *
 * You can set `preventDefault` to `true` to show the confirm leave dialog.
 *
 * NOTICE: Dialog only shows after user interacts with the page by default, like clicking a link, closing the tab, etc.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
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
