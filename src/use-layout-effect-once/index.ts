import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createEffectOnce } from '../utils/create-effect/once'

/**
 * like `React.useLayoutEffect` but it's only run once
 */
export const useLayoutEffectOnce = createEffectOnce(useIsomorphicLayoutEffect)
