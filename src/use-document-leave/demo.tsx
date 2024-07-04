import { Card, KeyValue } from '@/components'
import { useDocumentLeave } from '@shined/react-use'

export function App() {
  const isLeave = useDocumentLeave()

  return (
    <Card>
      <div className={isLeave ? 'text-amber/80' : 'text-primary/80'}>
        {isLeave ? '再见了～！再见！ヾ(＾-＾)ノ' : '欢迎回来！(≧◡≦) ♡'}
      </div>
      <div className={isLeave ? 'text-amber/80' : 'text-primary/80'}>
        {isLeave ? 'さよなら～！またね！ヾ(＾-＾)ノ' : 'おかえりなさい！(≧◡≦) ♡'}
      </div>
      <div className={isLeave ? 'text-amber/80' : 'text-primary/80'}>
        {isLeave ? 'Goodbye~! See you! ヾ(＾-＾)ノ' : 'Welcome back! (≧◡≦) ♡'}
      </div>
    </Card>
  )
}
