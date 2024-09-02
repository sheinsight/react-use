import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { createUpdateEffect } from '../utils/create-effect/update'

/**
 * A React Hook like [React.useLayoutEffect](https://react.dev/reference/react/useLayoutEffect),
 * but ignore the first invocation on mount, and use `useIsomorphicLayoutEffect` under the hood to support Server-side Rendering (SSR).
 */
export const useUpdateLayoutEffect = createUpdateEffect(useIsomorphicLayoutEffect)
