import { useEffect } from 'react'
import { createDeepCompareEffect } from '../utils/create-effect/deep-compare'

/**
 * like `React.useEffect` but it's deep compare
 */
export const useDeepCompareEffect = createDeepCompareEffect(useEffect)
