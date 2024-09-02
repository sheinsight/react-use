import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { createUpdateEffect } from '../utils/create-effect/update'

/**
 * A React Hook like [useDeepCompareEffect](https://sheinsight.github.io/react-use/reference/use-deep-compare-effect), but ignore the first invocation on mount.
 */
export const useUpdateDeepCompareEffect = createUpdateEffect(useDeepCompareEffect)
