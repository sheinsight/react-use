import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createUpdateEffect } from '../utils/create-effect/update'

/**
 * Like `React.useLayoutEffect`, but only runs on updates.
 */
export const useUpdateLayoutEffect = createUpdateEffect(useIsomorphicLayoutEffect)
