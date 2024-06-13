import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createDeepCompareEffect } from '../utils/create-effect'

/**
 * like `React.useLayoutEffect` but it's deep compare and safe (won't throw error on server-side)
 */
export const useDeepCompareLayoutEffect = createDeepCompareEffect(useIsomorphicLayoutEffect)
