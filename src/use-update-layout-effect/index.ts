import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createUpdateEffect } from '../utils/create-effect'

/**
 * Like `React.useLayoutEffect`, but only runs on updates.
 */
export const useUpdateLayoutEffect = createUpdateEffect(useIsomorphicLayoutEffect)
