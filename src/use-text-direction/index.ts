import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { normalizeElement, useTargetElement } from '../use-target-element'
import { useUpdateEffect } from '../use-update-effect'

import type { ReactSetState } from '../use-safe-state'
import type { ElementTarget } from '../use-target-element'

export type UseTextDirectionValue = 'ltr' | 'rtl' | 'auto'

export interface UseTextDirectionOptions {
  /**
   * The target element to set the text direction attribute.
   *
   * @default 'html'
   */
  target?: ElementTarget
  /**
   * The initial text direction value.
   *
   * @default 'ltr'
   */
  initialValue?: UseTextDirectionValue
}

export type UseTextDirectionReturn = [
  /**
   * The current text direction value.
   */
  dir: UseTextDirectionValue,
  /**
   * Sets the text direction value.
   */
  setDir: ReactSetState<UseTextDirectionValue>,
]

export function useTextDirection(options: UseTextDirectionOptions = {}): UseTextDirectionReturn {
  const { target = 'html', initialValue = 'ltr' } = options

  const el = useTargetElement(target)
  const [dir, setDir] = useSafeState(initialValue)

  useMount(() => setDir(getDirAttribute(el.current, initialValue)))

  useUpdateEffect(() => {
    if (!el.current) return

    if (dir) {
      el.current.setAttribute('dir', dir)
    } else {
      el.current.removeAttribute('dir')
    }
  }, [dir, el.current])

  return [dir, setDir] as const
}

function getDirAttribute(target: ElementTarget, defaultValue: UseTextDirectionValue = 'ltr'): UseTextDirectionValue {
  const el = normalizeElement(target)

  return (el?.getAttribute('dir') ?? defaultValue) as UseTextDirectionValue
}
