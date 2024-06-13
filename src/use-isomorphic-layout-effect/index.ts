import { useEffect, useLayoutEffect } from 'react'
import { isClient } from '../utils'

/**
 * Like `React.useLayoutEffect`, but safe for Server-side Rendering (SSR).
 */
export const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect
