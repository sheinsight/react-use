import { Card, KeyValue } from '@/components'
import { useDocumentVisibility, useTitle } from '@shined/react-use'

export function App() {
  const visibility = useDocumentVisibility()

  const isHidden = visibility === 'hidden'

  useTitle(isHidden ? 'またね！ヾ(＾-＾)ノ' : 'おかえりなさい！(≧◡≦) ♡')

  return (
    <Card>
      <KeyValue label="Visibility" value={visibility} />
    </Card>
  )
}
