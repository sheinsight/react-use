import { normalizeDate } from '../use-date-format'
import { useNow } from '../use-now'
import { unwrapGettable } from '../utils/unwrap'

import { formatTimeAgo } from './format-time-ago'
export { formatTimeAgo } from './format-time-ago'

import type { FormatTimeAgoOptions, TimeAgoUnitNamesDefault } from './format-time-ago'
export type { FormatTimeAgoOptions } from './format-time-ago'

import type { DateLike } from '../use-date-format'
import type { Pausable } from '../use-pausable'
import type { Gettable } from '../utils/basic'

export type UseTimeAgoReturn<Controls extends boolean = false> = Controls extends true
  ? { timeAgo: string } & Pausable
  : string

export interface UseTimeAgoOptions<Controls extends boolean, UnitNames extends string = TimeAgoUnitNamesDefault>
  extends FormatTimeAgoOptions<UnitNames> {
  /**
   * Expose more controls
   *
   * @defaultValue false
   */
  controls?: Controls
  /**
   * Intervals to update, set 0 to disable auto update
   *
   * @defaultValue 30_000
   */
  updateInterval?: number
}

export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options?: UseTimeAgoOptions<false, UnitNames>,
): UseTimeAgoReturn<false>
export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options: UseTimeAgoOptions<true, UnitNames>,
): UseTimeAgoReturn<true>
export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options: UseTimeAgoOptions<boolean, UnitNames> = {},
) {
  const { controls: exposeControls = false, updateInterval = 30_000 } = options

  const { now, ...controls } = useNow({ interval: updateInterval, controls: true })
  const timeAgo = formatTimeAgo(new Date(normalizeDate(unwrapGettable(time))), options, now)

  return exposeControls ? { timeAgo, ...controls } : timeAgo
}
