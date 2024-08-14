import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePermission } from '../use-permission'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useTimeoutFn } from '../use-timeout-fn'

import type { UsePermissionReturns } from '../use-permission'

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
   * Milliseconds to reset state of `copied` state
   *
   * @defaultValue 1_500
   */
  copiedDuration?: number
  /**
   * Callback when the text is copied
   */
  onCopy?: (text: string) => void
  /**
   * Callback when the `copied` state is reset
   */
  onCopiedReset?: () => void
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

function isAllowed(status: UsePermissionReturns<false>) {
  return status.current && ['granted', 'prompt'].includes(status.current)
}

/**
 * Almost same as [useClipboard](https://sheinsight.github.io/react-use/reference/use-clipboard), but support multiple items via [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem).
 */
export function useClipboardItems(options?: UseClipboardItemsOptions<undefined>): UseClipboardItemsReturns<false>
export function useClipboardItems(options: UseClipboardItemsOptions<ClipboardItems>): UseClipboardItemsReturns<true>
export function useClipboardItems(
  options: UseClipboardItemsOptions<ClipboardItems | undefined> = {},
): UseClipboardItemsReturns<boolean> {
  const { read = false, source, onCopy, onCopiedReset, copiedDuration = 1500 } = options

  const isSupported = useSupported(() => 'clipboard' in navigator)

  const permissionRead = usePermission('clipboard-read')
  const permissionWrite = usePermission('clipboard-write')

  const latest = useLatest({ isSupported, onCopy, onCopiedReset })

  const [state, setState] = useSetState({ content: [] as ClipboardItems, copied: false })

  const { resume: startTimeout } = useTimeoutFn(() => {
    setState({ copied: false })
    latest.current.onCopiedReset?.()
  }, copiedDuration)

  const updateContent = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionRead)) {
      const items = (await navigator?.clipboard.read()) || []
      setState({ content: items })
    }
  })

  useEventListener(isSupported && read ? ['copy', 'cut', 'focus'] : [], updateContent)

  const copy = useStableFn(async (value = source) => {
    if (latest.current.isSupported && value && isAllowed(permissionWrite)) {
      await navigator.clipboard.write(value)
      setState({ content: value, copied: true })
      startTimeout()
      latest.current.onCopy?.(value)
    }
  })

  const clear = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionWrite)) {
      await navigator.clipboard.write([])
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
