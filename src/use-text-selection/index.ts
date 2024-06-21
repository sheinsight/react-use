import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'

import type { MutableRefObject } from 'react'

export interface UseTextSelectionReturns {
  /**
   * A React Ref object that holds the current Selection object.
   */
  selectionRef: MutableRefObject<Selection | null>
  /**
   * The selected text.
   */
  text: string
  /**
   * The DOMRect objects for each selected range.
   */
  rects: DOMRect[]
  /**
   * The Range objects for each selected range.
   */
  ranges: Range[]
}

/**
 * A React Hook that helps to get the selection state of the document.
 */
export function useTextSelection(): UseTextSelectionReturns {
  const selectionRef = useRef<Selection | null>(null)
  const [selectionState, setSelectionState] = useSafeState({
    text: '',
    rects: [] as DOMRect[],
    ranges: [] as Range[],
  })

  useEventListener(
    () => document,
    'selectionchange',
    () => {
      selectionRef.current = window.getSelection()

      const text = selectionRef.current?.toString() ?? ''
      const ranges = selectionRef.current ? getRangesFromSelection(selectionRef.current) : []
      const rects = ranges.map((range) => range.getBoundingClientRect())

      setSelectionState({ text, rects, ranges })
    },
  )

  return {
    selectionRef,
    ...selectionState,
  }
}

function getRangesFromSelection(selection: Selection) {
  const rangeCount = selection.rangeCount ?? 0
  return Array.from({ length: rangeCount }, (_, i) => selection.getRangeAt(i))
}
