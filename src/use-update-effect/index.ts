import { useEffect } from 'react'
import { createUpdateEffect } from '../utils'

/**
 * Like `React.useEffect`, but only runs on updates.
 */
export const useUpdateEffect = createUpdateEffect(useEffect)
