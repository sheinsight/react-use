import { noop } from '../utils/basic'

export function legacyCopy(value: string) {
  const restoreSelection = removeSelection()
  const textarea = createHiddenTextarea(value)
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
  restoreSelection()
}

export function legacyRead() {
  return document.getSelection()?.toString() ?? ''
}

// @see https://github.com/sudodoki/toggle-selection/blob/ac73e2b274c10d019d1f13e4da5f8fc93809806a/index.js
export function removeSelection() {
  const activeEl = document.activeElement
  const selection = document.getSelection()

  if (!selection || !selection.rangeCount || !activeEl) return noop

  const ranges: Range[] = []

  for (let i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i))
  }

  isInputtable(activeEl) && activeEl.blur()

  selection.removeAllRanges()

  return function restoreSelection() {
    selection.type === 'Caret' && selection.removeAllRanges()

    if (!selection.rangeCount) {
      for (const range of ranges) {
        selection.addRange(range)
      }
    }

    isInputtable(activeEl) && activeEl.focus()
  }
}

function createHiddenTextarea(value: string = '') {
  const textarea = document.createElement('textarea')

  // reset user styles for textarea element
  textarea.style.all = 'unset'

  // Prevent zooming on iOS
  textarea.style.fontSize = '12pt'

  // Reset box model
  textarea.style.border = '0'
  textarea.style.padding = '0'
  textarea.style.margin = '0'

  // Move element out of screen horizontally
  textarea.style.position = 'absolute'
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl'
  textarea.style[isRTL ? 'right' : 'left'] = '-99999px'
  textarea.style.opacity = '0'
  textarea.style.zIndex = '-999999999'

  // Move element to the same position vertically
  const yPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  textarea.style.top = `${yPosition}px`

  // avoid screen readers from reading out loud the text
  textarea.ariaHidden = 'true'

  // used to preserve spaces and line breaks
  textarea.style.whiteSpace = 'pre'

  // do not inherit user-select (it may be `none`)
  textarea.style.webkitUserSelect = 'text'
  // @ts-expect-error legacy style
  textarea.style.MozUserSelect = 'text'
  // @ts-expect-error legacy style
  textarea.style.msUserSelect = 'text'
  textarea.style.userSelect = 'text'

  textarea.setAttribute('readonly', '')

  textarea.value = value

  return textarea
}

function isInputtable(active: Element | null): active is HTMLInputElement | HTMLTextAreaElement {
  switch (active?.tagName.toUpperCase()) {
    case 'INPUT':
    case 'TEXTAREA':
      return true
    default:
      return false
  }

  // return [HTMLInputElement, HTMLTextAreaElement].some((el) => active instanceof el)
}
