import { useEffect } from 'react'
import { createEffectOnce } from '../utils/create-effect/once'

/**
 * like `React.useEffect` but it's only called once
 */
export const useEffectOnce = createEffectOnce(useEffect)
