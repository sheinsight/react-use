import { useRef } from 'react'
import { useAsyncEffect } from '../use-async-effect'
import { useAsyncLock } from '../use-async-lock'
import { useEventListener } from '../use-event-listener'
import { useSafeState } from '../use-safe-state'
import { useSupported } from '../use-supported'

export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

export interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>
}

export interface UseBatteryReturn {
  /**
   * Whether the battery is charging
   */
  charging: boolean
  /**
   * The battery level as a floating point number between 0 and 1
   */
  level: number
  /**
   * The time remaining to charge the battery fully
   */
  chargingTime: number
  /**
   * The time remaining to discharge the battery fully
   */
  dischargingTime: number
  /**
   * Whether the battery API is supported
   */
  isSupported: boolean
  /**
   * Update the battery state
   */
  update(): void
}

const batteryEvents = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']

export function useBattery(): UseBatteryReturn {
  const isSupported = useSupported(() => 'getBattery' in navigator)

  const [state, setState] = useSafeState(
    {
      charging: false,
      chargingTime: 0,
      dischargingTime: 0,
      level: 1,
    },
    { deep: true },
  )

  const bmRef = useRef<BatteryManager | null>()

  async function getBatteryState() {
    bmRef.current = await (navigator as NavigatorWithBattery).getBattery()

    return {
      charging: bmRef.current.charging ?? false,
      chargingTime: bmRef.current.chargingTime ?? 0,
      dischargingTime: bmRef.current.dischargingTime ?? 0,
      level: bmRef.current.level ?? 0,
    }
  }

  const updateBatteryState = useAsyncLock(async () => setState(await getBatteryState()))

  useAsyncEffect(async () => {
    if (!isSupported) return
    await updateBatteryState()
  }, [isSupported])

  useEventListener(isSupported ? bmRef : null, batteryEvents, updateBatteryState, { passive: true })

  return {
    isSupported,
    update: updateBatteryState,
    ...state,
  }
}
