import { Button, Card, Zone } from '@/components'
import { useManualStateHistory, useSetState } from '@shined/use'

const hash = () => Math.random().toString(36).substring(3, 9).toUpperCase()

export function App() {
  const [state, setState] = useSetState({ hash: 'ABCDEF', count: 0 })
  const history = useManualStateHistory(state, { capacity: 10 })

  return (
    <Card>
      <Zone border="primary">
        <pre className="mb-0 py-2">{JSON.stringify(state, null, 0)}</pre>
        <Button onClick={() => setState({ hash: hash() })}>Change hash</Button>
        <Button onClick={() => setState({ count: state.count + 1 })}>Change count</Button>
        <div>/</div>
        <Button onClick={() => history.commit()}>Commit</Button>
        {/* prettier-ignore */}
        <Button disabled={!history.canUndo} onClick={history.undo}>
          Undo
        </Button>
        {/* prettier-ignore */}
        <Button disabled={!history.canRedo} onClick={history.redo}>
          Redo
        </Button>
        <Button onClick={history.clear}>Clear</Button>
      </Zone>
      <Zone border="primary">
        <pre className="mb-0 w-full">{JSON.stringify(history.last, null, 0)}</pre>
        <pre className="mb-0 w-full text-amber-5">
          {history.history
            .map((e) => `${new Date(e.timestamp).toLocaleString()} ${JSON.stringify(e.snapshot, null, 0)}`)
            .join('\n')}
        </pre>
      </Zone>
    </Card>
  )
}
