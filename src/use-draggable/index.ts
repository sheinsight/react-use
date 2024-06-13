import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useTargetElement } from '../use-target-element'

import type { CSSProperties } from 'react'
import type { ElementTarget, GlobalTarget } from '../use-target-element'
import type { PointerType, Position } from '../utils'

export interface UseDraggableOptions {
  /**
   * Whether to drag the element only when the pointer is exactly on the target element.
   *
   * @default false
   */
  exact?: boolean
  /**
   * Whether to prevent the default behavior of the pointer event.
   *
   * @default false
   */
  preventDefault?: boolean
  /**
   * Whether to stop the propagation of the pointer event.
   *
   * @default false
   */
  stopPropagation?: boolean
  /**
   * Whether to capture the pointer event.
   *
   * @default true
   */
  capture?: boolean
  /**
   * The element that should be dragged.
   *
   * @default target
   */
  handle?: ElementTarget
  /**
   * The element that should be dragged.
   *
   * @default window
   */
  draggingElement?: ElementTarget | GlobalTarget
  /**
   * The element that should contain the draggable element.
   *
   * @default undefined
   */
  containerElement?: ElementTarget
  /**
   * The types of pointer events that should be handled.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]
  /**
   * The initial position of the draggable element.
   *
   * @default { x: 0; y: 0 }
   */
  initialValue?: Position
  /**
   * The callback that is called when the dragging starts.
   */
  onStart?: (position: Position, event: PointerEvent) => undefined | false
  /**
   * The callback that is called when the dragging moves.
   */
  onMove?: (position: Position, event: PointerEvent) => void
  /**
   * The callback that is called when the dragging ends.
   */
  onEnd?: (position: Position, event: PointerEvent) => void
  /**
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both'
  /**
   * @default false
   */
  disabled?: boolean
}

export interface UseDraggableReturn {
  /**
   * The x-coordinate of the draggable element.
   */
  x: number
  /**
   * The y-coordinate of the draggable element.
   */
  y: number
  /**
   * The style that should be applied to the draggable element.
   */
  style: CSSProperties
  /**
   * The style that should be applied to the container element if it exists.
   */
  containerStyle: CSSProperties
  /**
   * The position of the draggable element.
   */
  position: Position
  /**
   * Whether the draggable element is being dragged.
   */
  isDragging: boolean
}

/** @see {@link https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button MDN} */
const MAIN_MOUSE_BUTTON_TYPE = 0

export function useDraggable(target: ElementTarget, options: UseDraggableOptions = {}): UseDraggableReturn {
  const {
    exact = false,
    preventDefault = false,
    stopPropagation = false,
    capture = true,
    handle = target,
    draggingElement = () => window,
    containerElement,
    pointerTypes: types = ['mouse', 'touch', 'pen'],
    initialValue = { x: 0, y: 0 },
    axis = 'both',
    disabled = false,
    onStart,
    onMove,
    onEnd,
  } = options

  const [delta, setDelta] = useSafeState<Position | null>(null)
  const [position, setPosition] = useSafeState(initialValue)

  const targetEl = useTargetElement(target)
  const handleEl = useTargetElement(handle)
  const containerEl = useTargetElement(containerElement)
  const draggingEl = useTargetElement(draggingElement)

  const latest = useLatest({
    ...position,
    position,
    onStart,
    onMove,
    onEnd,
    types,
    preventDefault,
    stopPropagation,
    disabled,
    exact,
    delta,
  })

  function filterEvent(e: PointerEvent) {
    const { types } = latest.current
    return !types || types.includes(e.pointerType as PointerType)
  }

  function handleEvent(e: PointerEvent) {
    const { preventDefault, stopPropagation } = latest.current
    preventDefault && e.preventDefault()
    stopPropagation && e.stopPropagation()
  }

  function start(e: PointerEvent) {
    const { onStart, disabled, exact } = latest.current

    if (!targetEl.current || e.button !== MAIN_MOUSE_BUTTON_TYPE || disabled || !filterEvent(e)) return
    if (exact && e.target !== targetEl.current) return

    const containerRect = containerEl.current?.getBoundingClientRect?.()
    const targetRect = targetEl.current.getBoundingClientRect()

    const pos = {
      x:
        e.clientX -
        (containerEl.current && containerRect
          ? targetRect.left - containerRect.left + containerEl.current.scrollLeft
          : targetRect.left),
      y:
        e.clientY -
        (containerEl.current && containerRect
          ? targetRect.top - containerRect.top + containerEl.current.scrollTop
          : targetRect.top),
    }

    if (onStart?.({ ...pos }, e) === false) return

    setDelta({ ...pos })
    handleEvent(e)
  }

  function move(e: PointerEvent) {
    const { x, y, onMove, disabled, delta } = latest.current
    if (!targetEl.current || disabled) return
    if (!filterEvent(e) || !delta) return

    const targetRect = targetEl.current.getBoundingClientRect()

    const pos = { x, y }

    if (axis === 'x' || axis === 'both') {
      pos.x = e.clientX - delta.x

      if (containerEl.current) {
        pos.x = Math.min(Math.max(0, pos.x), containerEl.current.scrollWidth - targetRect.width)
      }
    }

    if (axis === 'y' || axis === 'both') {
      pos.y = e.clientY - delta.y

      if (containerEl.current) {
        pos.y = Math.min(Math.max(0, pos.y), containerEl.current.scrollHeight - targetRect.height)
      }
    }

    setPosition({ ...pos })
    onMove?.({ ...pos }, e)
    handleEvent(e)
  }

  function end(e: PointerEvent) {
    const { position, onEnd, disabled, delta } = latest.current

    if (disabled || !filterEvent(e) || !delta) return

    setDelta(null)
    onEnd?.({ ...position }, e)
    handleEvent(e)
  }

  useEventListener(handleEl, 'pointerdown', start, { capture })
  useEventListener(draggingEl, 'pointermove', move, { capture })
  useEventListener(draggingEl, 'pointerup', end, { capture })

  return {
    ...position,
    style: {
      position: containerElement ? 'absolute' : 'fixed',
      top: position.y,
      left: position.x,
    } as CSSProperties,
    containerStyle: {
      position: 'relative',
    } as CSSProperties,
    position,
    isDragging: !!delta,
  }
}
