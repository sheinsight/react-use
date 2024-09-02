import { Card, KeyValue, Zone } from '@/components'
import { useMediaQuery } from '@shined/react-use'

export function App() {
  const isPhoneView = useMediaQuery('(0 < width <= 767px)')
  const isPadView = useMediaQuery('(min-width: 768px) and (max-width: 1279px)')
  const isDesktopView = useMediaQuery('(min-width: 1280px)')

  const [isColorfulDevice, isPortraitPrint, isNotPrint] = useMediaQuery([
    '(color)',
    'print and (orientation: portrait)',
    'not print',
  ])

  return (
    <Card>
      <Zone>
        <KeyValue label="isPhoneView" value={isPhoneView} />
        <KeyValue label="isPadView" value={isPadView} />
        <KeyValue label="isDesktopView" value={isDesktopView} />
      </Zone>
      <Zone>
        <KeyValue label="isColorfulDevice" value={isColorfulDevice} />
        <KeyValue label="isPortraitPrint" value={isPortraitPrint} />
        <KeyValue label="isNotPrint" value={isNotPrint} />
      </Zone>
    </Card>
  )
}
