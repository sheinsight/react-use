import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createPausableEffect } from '../utils/create-effect'

/**
 * like `React.useLayoutEffect`, but can be paused.
 */
export const usePausableLayoutEffect = createPausableEffect(useIsomorphicLayoutEffect)
