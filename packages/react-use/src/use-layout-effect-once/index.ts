import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createEffectOnce } from '../utils/create-effect/once'

import type { UseEffectOnce } from '../utils/create-effect/once'

/**
 * A React Hook that like <Link to="/reference/use-effect-once">`useEffectOnce`</Link> but use <Link to="/reference/use-isomorphic-layout-effect">`useIsomorphicLayoutEffect`</Link> under the hood.
 */
export const useLayoutEffectOnce: UseEffectOnce<never> = createEffectOnce(useIsomorphicLayoutEffect)
