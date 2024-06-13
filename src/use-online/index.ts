import { useNetwork } from '../use-network'

export function useOnline(): boolean {
  return useNetwork().isOnline
}
