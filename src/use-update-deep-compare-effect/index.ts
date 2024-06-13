import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { createUpdateEffect } from '../utils/create-effect'

/**
 * like `useDeepCompareEffect`, but only runs on updates.
 */
export const useUpdateDeepCompareEffect = createUpdateEffect(useDeepCompareEffect)
