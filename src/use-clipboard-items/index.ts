import { useEventListener } from '../use-event-listener'
import { usePermission } from '../use-permission'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useTimeoutFn } from '../use-timeout-fn'

import { useLatest } from '../use-latest'
import type { UsePermissionReturn } from '../use-permission'

export interface UseClipboardItemsOptions<Source> {
  /**
   * Enabled reading for clipboard, need to request permission
   *
   * @defaultValue false
   */
  read?: boolean
  /**
   * Copy source
   */
  source?: Source
  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @defaultValue 1500
   */
  copiedDuration?: number
}

export interface UseClipboardItemsReturns<Optional> {
  /**
   * Check if the browser supports clipboard API
   */
  isSupported: boolean
  /**
   * Clipboard items
   */
  content: ClipboardItems
  /**
   * Check if the content is copied
   */
  copied: boolean
  /**
   * Copy content to clipboard
   */
  copy: Optional extends true ? (content?: ClipboardItems) => Promise<void> : (text: ClipboardItems) => Promise<void>
  /**
   * Clear clipboard
   */
  clear(): void
}

function isAllowed(status: UsePermissionReturn<false>) {
  return status.current && ['granted', 'prompt'].includes(status.current)
}

export function useClipboardItems(options?: UseClipboardItemsOptions<undefined>): UseClipboardItemsReturns<false>
export function useClipboardItems(options: UseClipboardItemsOptions<ClipboardItems>): UseClipboardItemsReturns<true>
export function useClipboardItems(
  options: UseClipboardItemsOptions<ClipboardItems | undefined> = {},
): UseClipboardItemsReturns<boolean> {
  const { read = false, source, copiedDuration = 1500 } = options

  const isSupported = useSupported(() => 'clipboard' in navigator)

  const permissionRead = usePermission('clipboard-read')
  const permissionWrite = usePermission('clipboard-write')

  const [state, setState] = useSetState({ content: [] as ClipboardItems, copied: false })
  const { resume: startTimeout } = useTimeoutFn(() => setState({ copied: false }), copiedDuration)
  const latest = useLatest({ isSupported })

  const updateContent = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionRead)) {
      const items = (await navigator?.clipboard.read()) || []
      setState({ content: items })
    }
  })

  useEventListener(isSupported && read ? ['copy', 'cut', 'focus'] : [], updateContent)

  const copy = useStableFn(async (value = source) => {
    if (latest.current.isSupported && value && isAllowed(permissionWrite)) {
      await navigator?.clipboard.write(value)
      setState({ content: value, copied: true })
      startTimeout()
    }
  })

  const clear = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionWrite)) {
      await navigator?.clipboard.write([])
      setState({ content: [] })
    }
  })

  return {
    ...state,
    isSupported,
    copy,
    clear,
  }
}
