import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useSetState } from '../use-set-state'
import { useTargetElement } from '../use-target-element'
import { isFunction, notNullish } from '../utils/basic'

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

export interface UseDropZoneReturn {
  /**
   * The files that were dropped in the drop zone.
   */
  files: File[] | null
  /**
   * Whether the user is currently dragging files over the drop zone.
   */
  isOverDropZone: boolean
}

export function useDropZone(
  target: ElementTarget,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const el = useTargetElement(target)

  const [state, setState] = useSetState({
    files: null as File[] | null,
    isOverDropZone: false,
  })

  const countRef = useRef(0)
  const isTypeAcceptedRef = useRef(true)

  const _options = isFunction(options) ? { onDrop: options } : options
  const { dataTypes, onDrop, onEnter, onLeave, onOver } = _options

  useEventListener<DragEvent>(el, 'dragenter', (event) => {
    event.preventDefault()

    const types = Array.from(event?.dataTransfer?.items || [])
      .map((i) => (i.kind === 'file' ? i.type : null))
      .filter(notNullish)

    if (dataTypes && event.dataTransfer) {
      const dataTypes = _options.dataTypes

      const isTypeAccepted = isFunction(dataTypes)
        ? dataTypes(types)
        : dataTypes
          ? dataTypes.some((item) => types.includes(item))
          : true

      isTypeAcceptedRef.current = isTypeAccepted

      if (!isTypeAccepted) return
    }

    countRef.current++

    if (countRef.current > 0) {
      setState({ isOverDropZone: true })
    }

    onEnter?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'dragover', (event) => {
    if (!isTypeAcceptedRef.current) return
    event.preventDefault()
    onOver?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'dragleave', (event) => {
    if (!isTypeAcceptedRef.current) return
    event.preventDefault()
    countRef.current--
    if (countRef.current === 0) setState({ isOverDropZone: false })
    onLeave?.(getFiles(event), event)
  })

  useEventListener<DragEvent>(el, 'drop', (event) => {
    event.preventDefault()
    countRef.current = 0
    setState({ isOverDropZone: false, files: getFiles(event) })
    onDrop?.(getFiles(event), event)
  })

  return state
}

function getFiles(event: DragEvent) {
  const list = Array.from(event.dataTransfer?.files ?? [])
  return list.length === 0 ? null : list
}
