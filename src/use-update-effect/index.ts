import { useEffect } from 'react'
import { createUpdateEffect } from '../utils/create-effect/update'

/**
 * Like `React.useEffect`, but only runs on updates.
 */
export const useUpdateEffect = createUpdateEffect(useEffect)
