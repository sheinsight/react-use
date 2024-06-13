import { useEventListener } from '../use-event-listener'
import { useSetState } from '../use-set-state'
import { useTargetElement } from '../use-target-element'

import type { UseMouseSourceType } from '../use-mouse'
import type { ElementTarget } from '../use-target-element'

export interface MousePressedOptions {
  /**
   * Whether to listen to touch events
   *
   * @default true
   */
  touch?: boolean
  /**
   * Whether to listen to drag events
   *
   * @default true
   */
  drag?: boolean
  /**
   * Whether to use event capturing
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture MDN - addEventListener#capture}
   *
   * @default false
   */
  capture?: boolean
  /**
   * The initial value of the mouse press
   *
   * @default false
   */
  initialValue?: boolean
}

export interface UseMousePressedReturn {
  /**
   * Whether the mouse is pressed
   */
  pressed: boolean
  /**
   * The source type of the mouse press
   */
  sourceType: UseMouseSourceType
}

export function useMousePressed(
  target: ElementTarget | (() => Window) | (() => Document) = () => window,
  options: MousePressedOptions = {},
) {
  const { touch = true, drag = true, capture = false, initialValue = false } = options

  const el = useTargetElement(target)
  const [state, setState] = useSetState({ pressed: initialValue, sourceType: null as UseMouseSourceType })

  function createHandler(srcType: UseMouseSourceType) {
    return () => {
      setState({ pressed: true, sourceType: srcType })
    }
  }

  function onReleased() {
    setState({ pressed: false, sourceType: null })
  }

  const evtOptions = { passive: true, capture }

  useEventListener(el, 'mousedown', createHandler('mouse'), evtOptions)
  useEventListener(el, ['mouseleave', 'mouseup'], onReleased, evtOptions)

  useEventListener(el, drag ? 'dragstart' : [], createHandler('mouse'), evtOptions)
  useEventListener(el, drag ? ['drop', 'dragend'] : [], onReleased, evtOptions)

  useEventListener(el, touch ? 'touchstart' : [], createHandler('touch'), evtOptions)
  useEventListener(el, touch ? ['touchend', 'touchcancel'] : [], onReleased, evtOptions)

  return state
}
