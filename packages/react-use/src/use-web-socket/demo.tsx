import { Button, Card, KeyValue, LabelInput, Zone } from '@/components'
import { useControlledComponent, useSafeState, useWebSocket } from '@shined/react-use'

export function App() {
  return (
    <Card>
      <PassedUrl />
      <DynamicUrl />
    </Card>
  )
}

export function PassedUrl() {
  const wsUrl = 'wss://echo.websocket.org'
  const [messageList, setMessageList] = useSafeState<string[]>([])

  const ws = useWebSocket(wsUrl, {
    heartbeat: {
      interval: 1000,
      message: 'ping',
      responseTimeout: 3000,
    },
    filter: (event) => event.data === 'ping',
    onClose() {
      setMessageList([])
    },
    onMessage(message) {
      setMessageList((list) => [...list, `Server: ${message.data}`])
    },
  })

  function send() {
    ws.send(`Hello, WebSocket! (Params) at ${Date.now()}`)
  }

  // const isConnected = ws.readyState === WebSocket.OPEN

  // for SSR compatibility
  const isConnected = ws.readyState === 1

  return (
    <Zone row={false} border="primary">
      <h2 className="text-xl font-bold">WS URL as Params</h2>
      <p className="opacity-60">
        Edit the WS URL in the input field below and it will automatically reconnect when the URL changes.
      </p>
      <KeyValue label="WS URL" value={wsUrl} />
      <KeyValue label="Status" value={formatReadyState(ws.readyState)} />
      <Zone>
        <Button disabled={!isConnected} onClick={send}>
          Send
        </Button>
        <Button onClick={() => ws.close()}>Close</Button>
        <Button onClick={() => ws.open()}>Open</Button>
      </Zone>
      <Zone row={false} border="amber" className="min-h-42px">
        {messageList.map((msg) => (
          <div key={msg}>{msg}</div>
        ))}
        {messageList.length === 0 && <div className="opacity-60">No message received yet.</div>}
      </Zone>
    </Zone>
  )
}

export function DynamicUrl() {
  const wsUrl = useControlledComponent('')
  const [messageList, setMessageList] = useSafeState<string[]>([])

  const ws = useWebSocket({
    onClose() {
      setMessageList([])
    },
    onMessage(message) {
      console.log('message', message)
      setMessageList((list) => [...list, `Server: ${message.data}`])
    },
  })

  function send() {
    ws.send(`Hello, WebSocket! (Programmatic) at ${Date.now()}`)
  }

  // const isConnected = ws.readyState === WebSocket.OPEN

  // for SSR compatibility
  const isConnected = ws.readyState === 1

  return (
    <Zone row={false} border="primary">
      <h2 className="text-lg font-bold">Programmatic WS URL</h2>
      <p className="opacity-60">
        Edit the WS URL in the input field below and click the "Connect" button to establish a connection.
      </p>
      <LabelInput label="WS URL" {...wsUrl.props} className="w-full md:w-420px" />
      <KeyValue label="Status" value={formatReadyState(ws.readyState)} />
      <Zone>
        <Button onClick={() => ws.open(wsUrl.value)}>Open</Button>
        <Button disabled={!isConnected} onClick={send}>
          Send
        </Button>
        <Button onClick={() => ws.close()}>Close</Button>
      </Zone>
      <Zone row={false} border="amber" className="min-h-42px">
        {messageList.map((msg) => (
          <div key={msg}>{msg}</div>
        ))}
        {messageList.length === 0 && <div className="opacity-60">No message received yet.</div>}
      </Zone>
    </Zone>
  )
}

function formatReadyState(readyState: number) {
  switch (readyState) {
    case 0:
      return 'Connecting' // CONNECTING
    case 1:
      return 'Connected' // OPEN
    case 2:
      return 'Closing' // CLOSING
    case 3:
      return 'Closed' // CLOSED
    default:
      return 'Unknown'
  }
}
