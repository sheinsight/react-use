import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * A React Hook like [React.useLayoutEffect](https://react.dev/reference/react/useLayoutEffect), but pausable.
 */
export const usePausableLayoutEffect = createPausableEffect(useIsomorphicLayoutEffect)
