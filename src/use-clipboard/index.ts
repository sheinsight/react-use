import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePermission } from '../use-permission'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useTimeoutFn } from '../use-timeout-fn'
import { unwrapGettable } from '../utils/unwrap'

import type { UsePermissionReturn } from '../use-permission'
import type { Gettable } from '../utils/basic'

export interface UseClipboardOptions<Source> {
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

export interface UseClipboardReturns<HasSource> {
  /**
   * Whether the clipboard is supported
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

export function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturns<false>
export function useClipboard(options: UseClipboardOptions<Gettable<string>>): UseClipboardReturns<true>
export function useClipboard(
  options: UseClipboardOptions<Gettable<string> | undefined> = {},
): UseClipboardReturns<boolean> {
  const { read = false, source, copiedDuration = 1500 } = options

  const permissionRead = usePermission('clipboard-read')
  const permissionWrite = usePermission('clipboard-write')
  const [state, setState] = useSetState({ text: '', copied: false }, { deep: true })
  const isSupported = useSupported(() => 'clipboard' in navigator)
  const { resume: startTimeout } = useTimeoutFn(() => setState({ copied: false }), copiedDuration)

  const latest = useLatest({
    isSupported,
    sourceValue: unwrapGettable(source),
  })

  const updateText = useStableFn(async () => {
    if (latest.current.isSupported && isAllowed(permissionRead)) {
      const value = await navigator.clipboard.readText()
      setState({ text: value })
    } else {
      setState({ text: legacyRead() })
    }
  })

  const copy = useStableFn(async (value = latest.current.sourceValue) => {
    if (latest.current.isSupported && value) {
      if (latest.current.isSupported && isAllowed(permissionWrite)) {
        await navigator?.clipboard.writeText(value)
      } else {
        legacyCopy(value)
      }

      setState({ text: value, copied: true })
      startTimeout()
    }
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
  textarea.style.zIndex = '-1'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

function legacyRead() {
  return document.getSelection()?.toString() ?? ''
}

function isAllowed(status: UsePermissionReturn<false>) {
  return status.current && ['granted', 'prompt'].includes(status.current)
}
