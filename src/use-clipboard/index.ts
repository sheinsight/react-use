import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePermission } from '../use-permission'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useTimeoutFn } from '../use-timeout-fn'
import { isDefined } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'

import type { UsePermissionReturns } from '../use-permission'
import type { Gettable } from '../utils/basic'

export interface UseClipboardOptions<Source> {
  /**
   * Enabled reading for clipboard, need to request permission
   *
   * @defaultValue false
   */
  read?: boolean
  /**
   * Copy source, which is copied by default when you call the copy method directly without passing any parameters
   */
  source?: Source
  /**
   * Milliseconds to reset state of `copied` ref
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

export interface UseClipboardReturns<HasSource> {
  /**
   * Whether the Clipboard API is supported
   */
  isSupported: boolean
  /**
   * The text in the clipboard
   */
  text: string
  /**
   * A flag to indicate the text is copied, will be reset after `copiedDuration`
   */
  copied: boolean
  /**
   * Copy the text to the clipboard
   */
  copy: HasSource extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>
  /**
   * Clear the text in the clipboard
   */
  clear(): void
}

/**
 * A React Hook that copy text with [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) or fallback to `document.execCommand('copy')` if it's not available.
 */
export function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturns<false>
export function useClipboard(options: UseClipboardOptions<Gettable<string>>): UseClipboardReturns<true>
export function useClipboard(
  options: UseClipboardOptions<Gettable<string> | undefined> = {},
): UseClipboardReturns<boolean> {
  const { read = false, source, onCopy, onCopiedReset, copiedDuration = 1500 } = options

  const [state, setState] = useSetState({ text: '', copied: false }, { deep: true })
  const isSupported = useSupported(() => 'clipboard' in navigator)

  const { resume: startTimeout } = useTimeoutFn(() => {
    setState({ copied: false })
    latest.current.onCopiedReset?.()
  }, copiedDuration)

  const latest = useLatest({
    read,
    onCopy,
    onCopiedReset,
    isSupported,
    sourceValue: unwrapGettable(source),
  })

  const permissionRead = usePermission('clipboard-read', {
    onStateChange() {
      if (latest.current.read) updateText()
    },
  })

  const permissionWrite = usePermission('clipboard-write')

  const updateText = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionRead)) {
      // to prevent error when document is not focused
      // => Failed to execute 'readText' on 'Clipboard': Document is not focused.
      if (document.hasFocus()) {
        const value = await navigator.clipboard.readText()
        setState({ text: value })
      }
    } else {
      setState({ text: legacyRead() })
    }
  })

  const copy = useStableFn(async (value = latest.current.sourceValue) => {
    if (!isDefined(value)) return

    if (latest.current.isSupported && isAllowed(permissionWrite)) {
      await navigator.clipboard.writeText(value)
    } else {
      legacyCopy(value)
    }

    setState({ text: value, copied: true })
    startTimeout()
    onCopy?.(value)
  })

  const clear = useStableFn(() => {
    setState({ text: '' })
    navigator.clipboard.writeText('')
  })

  useEventListener(isSupported && read ? ['copy', 'cut', 'focus'] : [], updateText)

  return {
    ...state,
    isSupported,
    copy,
    clear,
  }
}

function legacyCopy(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'absolute'
  textarea.style.opacity = '0'
  textarea.style.zIndex = '-999999999'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

function legacyRead() {
  return document.getSelection()?.toString() ?? ''
}

function isAllowed(status: UsePermissionReturns<false>) {
  return status.current && ['granted', 'prompt'].includes(status.current)
}
