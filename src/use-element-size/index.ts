import { useResizeObserver } from '../use-resize-observer'
import { useSafeState } from '../use-safe-state'
import { normalizeElement, useTargetElement } from '../use-target-element'

import type { UseResizeObserverOptions, UseResizeObserverReturns } from '../use-resize-observer'
import type { ElementTarget } from '../use-target-element'

export interface ElementSize {
  /**
   * The width of the element.
   */
  width: number
  /**
   * The height of the element.
   */
  height: number
}

export interface UseElementSizeReturns extends ElementSize, UseResizeObserverReturns {}

/**
 * A React Hook that returns the size of an element.
 */
export function useElementSize<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  defaultValue: ElementSize = { width: 0, height: 0 },
  options: UseResizeObserverOptions = {},
): UseElementSizeReturns {
  const el = useTargetElement<T>(target)
  const [size, setSize] = useSafeState(defaultValue, { deep: true })
  const { box = 'content-box' } = options

  const { observerRef, isSupported, ...controls } = useResizeObserver(
    target,
    ([entry]) => {
      const boxSize =
        box === 'border-box'
          ? entry.borderBoxSize
          : box === 'content-box'
            ? entry.contentBoxSize
            : entry.devicePixelContentBoxSize

      const isSvg = el.current?.namespaceURI?.includes('svg')

      if (isSvg && el.current) {
        setSize(getElSize(el))
      } else {
        if (boxSize && box.length) {
          setSize({
            width: boxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0),
            height: boxSize.reduce((acc, { blockSize }) => acc + blockSize, 0),
          })
        } else {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          })
        }
      }
    },
    options,
  )

  return {
    observerRef,
    isSupported,
    ...controls,
    ...size,
  }
}

function getElSize<T extends HTMLElement>(
  target: ElementTarget<T>,
  defaultValue: ElementSize = { width: 0, height: 0 },
) {
  const el = normalizeElement(target)

  if (!el) return defaultValue

  const { width, height } = window.getComputedStyle(el)

  return {
    width: Number.parseFloat(width),
    height: Number.parseFloat(height),
  }
}
