import { useNetwork } from '../use-network'

/**
 * A React Hook that tracks online status.
 */
export function useOnline(): boolean {
  return useNetwork().isOnline
}
