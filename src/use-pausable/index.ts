import { useCreation } from '../use-creation'
import { useGetterRef } from '../use-getter-ref'
import { useLatest } from '../use-latest'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'

export interface Pausable<PauseArgs extends unknown[] = [], ResumeArgs extends unknown[] = []> {
  /**
   * Whether the instance is active, it just a ref getter
   */
  isActive(): boolean
  /**
   * Pause the instances
   *
   * @params update - Whether to trigger a re-render
   */
  pause: (...args: [update?: boolean, ...PauseArgs]) => void
  /**
   * Resume the instance, restart the instances if it's active
   *
   * @params update - Whether to trigger a re-render
   */
  resume: (...args: [update?: boolean, ...ResumeArgs]) => void
}

export function usePausable<
  // biome-ignore lint/suspicious/noExplicitAny: need any
  PauseCP extends any[],
  // biome-ignore lint/suspicious/noExplicitAny: need any
  ResumeCP extends any[],
  // biome-ignore lint/suspicious/noExplicitAny: need any
  PauseC extends (ref: React.MutableRefObject<boolean>, ...args: [...PauseCP]) => any,
  // biome-ignore lint/suspicious/noExplicitAny: need any
  ResumeC extends (ref: React.MutableRefObject<boolean>, ...args: [...ResumeCP]) => any,
>(initialValue?: boolean, pauseCallback?: PauseC, resumeCallback?: ResumeC): Pausable<PauseCP, ResumeCP> {
  const render = useRender()
  const latest = useLatest({ resumeCallback, pausableCallback: pauseCallback })
  const [isActiveRef, isActive] = useGetterRef(initialValue ?? false)

  const pause = useStableFn((update?: boolean, ...args: [...PauseCP]) => {
    isActiveRef.current = false
    const res = latest.current.pausableCallback?.(isActiveRef, ...args)
    if (res instanceof Promise) {
      res.finally(() => update && render())
    } else {
      update && render()
    }
  })

  const resume = useStableFn((update?: boolean, ...args: [...ResumeCP]) => {
    isActiveRef.current = true
    const res = latest.current.resumeCallback?.(isActiveRef, ...args)
    if (res instanceof Promise) {
      res.finally(() => update && render())
    } else {
      update && render()
    }
  })

  return useCreation(() => ({ isActive, pause, resume }))
}
