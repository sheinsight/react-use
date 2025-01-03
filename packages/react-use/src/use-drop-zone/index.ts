import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useTargetElement } from '../use-target-element'
import { isFunction, noNullish } from '../utils/basic'

import type { ElementTarget } from '../use-target-element'

export interface UseDropZoneOptions {
  /**
   * The file types that are accepted by the drop zone.
   */
  dataTypes?: string[] | ((types: readonly string[]) => boolean)
  /**
   * A callback that is called when the user drops files in the drop zone.
   */
  onDrop?: (files: File[] | null, event: DragEvent) => void
  /**
   * A callback that is called when the user drags files over the drop zone.
   */
  onEnter?: (files: File[] | null, event: DragEvent) => void
  /**
   * A callback that is called when the user drags files out of the drop zone.
   */
  onLeave?: (files: File[] | null, event: DragEvent) => void
  /**
   * A callback that is called when the user drags files over the drop zone.
   */
  onOver?: (files: File[] | null, event: DragEvent) => void
}

export interface UseDropZoneReturns {
  /**
   * The files that were dropped in the drop zone.
   */
  files: File[] | null
  /**
   * Whether the user is currently dragging files over the drop zone.
   */
  isOverDropZone: boolean
}

/**
 * A React Hook that allows you to create a dropzone.
 */
export function useDropZone(
  target: ElementTarget,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturns {
  const el = useTargetElement(target)

  const [state, setState] = useSetState({
    files: null as File[] | null,
    isOverDropZone: false,
  })

  const countRef = useRef(0)
  const isTypeAcceptedRef = useRef(true)

  const latest = useLatest({
    options: isFunction(options) ? { onDrop: options } : options,
  })

  useEventListener<DragEvent>(el, 'dragenter', (event) => {
    event.preventDefault()

    const types = Array.from(event?.dataTransfer?.items || [])
      .map((i) => (i.kind === 'file' ? i.type : null))
      .filter(noNullish)

    const { dataTypes } = latest.current.options

    if (dataTypes && event.dataTransfer) {
      const isTypeAccepted = isFunction(dataTypes) ? dataTypes(types) : dataTypes.some((item) => types.includes(item))

      isTypeAcceptedRef.current = isTypeAccepted

      if (!isTypeAccepted) return
    }

    countRef.current++

    if (countRef.current > 0) {
      setState({ isOverDropZone: true })
    }

    latest.current.options.onEnter?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'dragover', (event) => {
    if (!isTypeAcceptedRef.current) return
    event.preventDefault()
    latest.current.options.onOver?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'dragleave', (event) => {
    if (!isTypeAcceptedRef.current) return
    event.preventDefault()
    countRef.current--
    if (countRef.current === 0) setState({ isOverDropZone: false })
    latest.current.options.onLeave?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'drop', (event) => {
    if (!isTypeAcceptedRef.current) return
    event.preventDefault()
    countRef.current = 0
    setState({ isOverDropZone: false, files: getFiles(event) })
    latest.current.options.onDrop?.(getFiles(event), event)
  })

  return state
}

function getFiles(event: DragEvent) {
  const list = Array.from(event.dataTransfer?.files ?? [])
  return list.length === 0 ? null : list
}
