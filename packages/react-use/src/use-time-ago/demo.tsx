import { Card, KeyValue, Zone } from '@/components'
import { CHINESE_MESSAGES, CHINESE_TRADITIONAL_MESSAGES, JAPANESE_MESSAGES, useTimeAgo } from '@shined/react-use'
import { useRef } from 'react'

export function App() {
  const twoYearsAgo = useRef(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
  const threeMonthsAgo = useRef(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
  const fourDayAgo = useRef(Date.now() - 4 * 24 * 60 * 60 * 1000)
  const fiveHoursAgo = useRef(Date.now() - 5 * 60 * 60 * 1000)
  const sixMinutesAgo = useRef(Date.now() - 6 * 60 * 1000)
  const tenSecondsAgo = useRef(Date.now() - 10_000)
  const inSixMinutes = useRef(Date.now() + 6 * 60 * 1000)
  const inFiveHours = useRef(Date.now() + 5 * 60 * 60 * 1000)
  const inFourDays = useRef(Date.now() + 4 * 24 * 60 * 60 * 1000)
  const inThreeMonths = useRef(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000)
  const inTwoYears = useRef(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)

  const engResults = [
    useTimeAgo(twoYearsAgo.current),
    useTimeAgo(threeMonthsAgo.current),
    useTimeAgo(fourDayAgo.current),
    useTimeAgo(fiveHoursAgo.current),
    useTimeAgo(sixMinutesAgo.current),
    useTimeAgo(tenSecondsAgo.current),
    useTimeAgo(inSixMinutes.current),
    useTimeAgo(inFiveHours.current),
    useTimeAgo(inFourDays.current),
    useTimeAgo(inThreeMonths.current),
    useTimeAgo(inTwoYears.current),
  ]

  const chineseResults = [
    useTimeAgo(twoYearsAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(threeMonthsAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(fourDayAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(fiveHoursAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(sixMinutesAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(tenSecondsAgo.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(inSixMinutes.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(inFiveHours.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(inFourDays.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(inThreeMonths.current, { messages: CHINESE_MESSAGES }),
    useTimeAgo(inTwoYears.current, { messages: CHINESE_MESSAGES }),
  ]

  const chineseTraditionalResults = [
    useTimeAgo(twoYearsAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(threeMonthsAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(fourDayAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(fiveHoursAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(sixMinutesAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(tenSecondsAgo.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(inSixMinutes.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(inFiveHours.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(inFourDays.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(inThreeMonths.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
    useTimeAgo(inTwoYears.current, { messages: CHINESE_TRADITIONAL_MESSAGES }),
  ]

  const japaneseResults = [
    useTimeAgo(twoYearsAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(threeMonthsAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(fourDayAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(fiveHoursAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(sixMinutesAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(tenSecondsAgo.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(inSixMinutes.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(inFiveHours.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(inFourDays.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(inThreeMonths.current, { messages: JAPANESE_MESSAGES }),
    useTimeAgo(inTwoYears.current, { messages: JAPANESE_MESSAGES }),
  ]

  return (
    <Card>
      <Zone border="primary">
        {engResults.map((result, idx) => (
          <KeyValue key={result} label={`EN Result ${idx + 1}`} value={result} />
        ))}
      </Zone>
      <Zone border="amber">
        {chineseResults.map((result, idx) => (
          <KeyValue key={result} label={`CN Result ${idx + 1}`} value={result} />
        ))}
      </Zone>
      <Zone border="blue">
        {chineseTraditionalResults.map((result, idx) => (
          <KeyValue key={result} label={`CN Traditional Result ${idx + 1}`} value={result} />
        ))}
      </Zone>
      <Zone border="red">
        {japaneseResults.map((result, idx) => (
          <KeyValue key={result} label={`JP Result ${idx + 1}`} value={result} />
        ))}
      </Zone>
    </Card>
  )
}
