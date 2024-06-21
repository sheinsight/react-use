import { useUpdateEffect } from '../use-update-effect'
import { createPausableEffect } from '../utils/create-effect/pausable'

/**
 * A React Hook like [useUpdateEffect](https://sheinsight.github.io/react-use/reference/use-update-effect), but pausable.
 */
export const usePausableUpdateEffect = createPausableEffect(useUpdateEffect)
