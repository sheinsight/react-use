import { useRef } from 'react'
import { useGetterRef } from '../use-getter-ref'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTimeoutFn } from '../use-timeout-fn'
import { useUnmount } from '../use-unmount'
import { useUpdateEffect } from '../use-update-effect'
import { useVersionedAction } from '../use-versioned-action'
import { isDev, isFunction, isString, noop } from '../utils/basic'

export type UseWebSocketSendable = string | ArrayBufferLike | Blob | ArrayBufferView

export interface UseWebSocketOptionsHeartbeat {
  /**
   * The heartbeat message to send to the server.
   *
   * @defaultValue 'ping'
   */
  message?: UseWebSocketSendable
  /**
   * The interval at which to send a heartbeat message to the server, disabled when set to `0`.
   *
   * @defaultValue 1_000
   */
  interval?: number
  /**
   * The timeout for the server to respond to the heartbeat message, set false to disable.
   *
   * @defaultValue 1_000
   */
  responseTimeout?: number
  /**
   * The expected response heartbeat message from the server, `true` means any message.
   *
   * @defaultValue true
   */
  responseMessage?: true | UseWebSocketSendable | ((data: UseWebSocketSendable) => boolean)
}

export interface UseWebSocketOptionsReconnect {
  /**
   * The number of times to reconnect, default is `() => true`, reconnect indefinitely.
   */
  count: number | (() => boolean)
  /**
   * The interval at which to reconnect.
   */
  interval: number
  /**
   * A callback function that is called when the WebSocket connection is closed and the reconnection limit is reached.
   */
  onFailed?: (event: CloseEvent, ws: WebSocket) => void
}

export interface UseWebSocketOptions {
  /**
   * A callback function that is called when the WebSocket connection is opened.
   *
   * @defaultValue undefined
   */
  onOpen?: (event: Event, ws: WebSocket) => void
  /**
   * A callback function that is called when the WebSocket connection is closed.
   *
   * @defaultValue undefined
   */
  onClose?: (event: CloseEvent, ws: WebSocket) => void
  /**
   * A callback function that is called when an error occurs.
   *
   * @defaultValue undefined
   */
  onError?: (event: Event, ws: WebSocket) => void
  /**
   * A callback function that is called when a message is received from the server.
   *
   * @defaultValue undefined
   */
  onMessage?: (event: MessageEvent, ws: WebSocket) => void
  /**
   * Whether to send a heartbeat message to the server.
   *
   * @defaultValue false
   */
  heartbeat?: boolean | UseWebSocketOptionsHeartbeat
  /**
   * Whether to reconnect when the connection is closed. Count can be a number or a function that returns a boolean.
   *
   * @defaultValue true => { count: () => true, interval: 1_000 }
   */
  reconnect?: boolean | UseWebSocketOptionsReconnect
  /**
   * Whether to connect to the server immediately.
   *
   * @defaultValue true when `wsUrl` is provided, otherwise false
   */
  immediate?: boolean
  /**
   * Whether to close the WebSocket connection when the component is unmounted.
   *
   * @defaultValue true
   */
  closeOnUnmount?: boolean
  /**
   * The WebSocket subprotocols to use.
   *
   * @defaultValue []
   */
  protocols?: string | string[]
  /**
   * Filter the message to `onMessage` callback, return `true` to ignore the message.
   *
   * Useful for filtering out heartbeat messages.
   *
   * @defaultValue undefined
   */
  filter?: (event: MessageEvent, ws: WebSocket) => boolean
}

export interface UseWebSocketReturns<HasURL extends boolean> {
  /**
   * The WebSocket instance.
   */
  ws: WebSocket | null
  /**
   * A function to send data to the server.
   */
  send: (data: UseWebSocketSendable) => void
  /**
   * The current ready state of the WebSocket connection.
   */
  readyState: UseWebSocketReturnsReadyState
  /**
   * Close the WebSocket connection.
   */
  close: () => void
  /**
   * Open the WebSocket connection.
   */
  open: HasURL extends true ? () => void : (wsUrl?: string, protocols?: string | string[]) => void
}

// export type UseWebSocketReturnsReadyState = (typeof WebSocket)[keyof Omit<typeof WebSocket, 'prototype'>]

export type UseWebSocketReturnsReadyState =
  | typeof WebSocket.CONNECTING
  | typeof WebSocket.OPEN
  | typeof WebSocket.CLOSING
  | typeof WebSocket.CLOSED

const defaultHeartbeatMessage = 'ping'
const defaultResponseTimeout = 1_000
const defaultHeartbeatInterval = 1_000
const defaultReconnectOptions = { count: () => true, interval: 1_000 }

/**
 * A simplified React Hook for using WebSockets, wrapping the native WebSocket API. It supports features such as automatic reconnection and heartbeat.
 *
 * @since 1.7.0
 */
export function useWebSocket(wsUrl?: string, options?: UseWebSocketOptions): UseWebSocketReturns<true>
export function useWebSocket(options?: Omit<UseWebSocketOptions, 'immediate'>): UseWebSocketReturns<false>
export function useWebSocket(
  wsUrl?: string | UseWebSocketOptions,
  options: UseWebSocketOptions = {},
): UseWebSocketReturns<boolean> {
  const [_url, _options = {}] = isString(wsUrl) ? [wsUrl, options] : [undefined, wsUrl]

  const { immediate = !!_url, closeOnUnmount = true } = _options

  const [wsRef, ws] = useGetterRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const messageQueue = useRef<UseWebSocketSendable[]>([])
  const isClosedIntentionally = useRef<boolean>(false)
  const [incVersion, runVersionedAction] = useVersionedAction()
  const [readyState, setReadyState] = useSafeState<UseWebSocketReturnsReadyState>(WebSocket.CLOSED)

  const latest = useLatest({
    wsUrl: _url,
    heartbeat: _options.heartbeat,
    reconnect: resolveReconnectOptions(_options.reconnect ?? true),
    onOpen: _options.onOpen ?? noop,
    onClose: _options.onClose ?? noop,
    onError: _options.onError ?? noop,
    onMessage: _options.onMessage ?? noop,
    protocols: _options.protocols ?? [],
    filter: _options.filter ?? (() => false),
  })

  const initWebSocket = useStableFn(
    (
      wsUrl: string | undefined = latest.current.wsUrl,
      protocols: string | string[] | undefined = latest.current.protocols,
    ) => {
      const url = latest.current.wsUrl || wsUrl

      if (!url) {
        if (isDev) console.error('The WebSocket URL is required.')
        return
      }

      const version = incVersion()
      setReadyState(WebSocket.CONNECTING)
      wsRef.current = new WebSocket(url, protocols)

      wsRef.current.onopen = (event) => {
        runVersionedAction(version, () => {
          retriesRef.current = 0
          setReadyState(WebSocket.OPEN)
          latest.current.onOpen(event, ws() as WebSocket)
        })
      }

      wsRef.current.onclose = (event) => {
        runVersionedAction(version, () => {
          setReadyState(WebSocket.CLOSED)
          latest.current.onClose(event, ws() as WebSocket)

          const reconnect = latest.current.reconnect
          if (!reconnect || isClosedIntentionally.current) return

          const {
            count = defaultReconnectOptions.count,
            interval = defaultReconnectOptions.interval,
            onFailed,
          } = reconnect

          if (isFunction(count) ? count() : retriesRef.current < count) {
            retriesRef.current++
            setTimeout(() => initWebSocket(wsUrl, protocols), interval)
          } else if (onFailed) {
            onFailed(event, wsRef.current as WebSocket)
          }
        })
      }

      wsRef.current.onerror = (event) => {
        runVersionedAction(version, () => {
          setReadyState(WebSocket.CLOSED)
          latest.current?.onError?.(event, ws() as WebSocket)
        })
      }

      wsRef.current.onmessage = (event) => {
        runVersionedAction(version, () => {
          const { heartbeat } = latest.current

          if (heartbeat) {
            const checkHeartbeatResponse = resolveCheckHeartbeatResponse(heartbeat)
            checkHeartbeatResponse(event.data) && responseTimeout.pause()
          }

          if (latest.current.filter(event, ws() as WebSocket)) return

          latest.current.onMessage(event, ws() as WebSocket)
        })
      }
    },
  )

  const open = useStableFn(
    (
      wsUrl: string | undefined = latest.current.wsUrl,
      protocols: string | string[] | undefined = latest.current.protocols,
    ) => {
      retriesRef.current = 0
      close()
      initWebSocket(wsUrl, protocols)
    },
  )

  const responseTimeout = useTimeoutFn(
    () => {
      conditionClose(1000, 'Server did not respond to the heartbeat message', false)
    },
    resolveTimeout(latest.current.heartbeat),
    { immediate: false },
  )

  useIntervalFn(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && latest.current.heartbeat) {
      const message =
        latest.current.heartbeat === true
          ? defaultHeartbeatMessage
          : (latest.current.heartbeat.message ?? defaultHeartbeatMessage)

      wsRef.current.send(message)

      if (latest.current.heartbeat && !responseTimeout.isActive()) {
        responseTimeout.resume()
      }
    }
  }, resolveInterval(latest.current.heartbeat))

  const send = useStableFn((data: UseWebSocketSendable) => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data)
      } else {
        messageQueue.current.push(data)
      }
    }
  })

  function conditionClose(code?: number, reason?: string, intentional = true) {
    if (wsRef.current) {
      responseTimeout.pause()
      setReadyState(WebSocket.CLOSING)
      isClosedIntentionally.current = intentional
      wsRef.current.close(code, reason)
      wsRef.current = null
    }
  }

  /**
   * `1000` is the code for normal closure
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code#value
   */
  const close = useStableFn((code: number = 1000, reason?: string) => {
    conditionClose(code, reason, true)
  })

  useMount(immediate && open)

  useUnmount(closeOnUnmount && close)

  // biome-ignore lint/correctness/useExhaustiveDependencies: handle url change
  useUpdateEffect(() => {
    open()
  }, [_url])

  useUpdateEffect(() => {
    if (readyState === WebSocket.OPEN) {
      if (messageQueue.current.length) {
        for (const message of messageQueue.current) send(message)
        messageQueue.current = []
      }
    }
  }, [readyState])

  return {
    get ws() {
      return wsRef.current
    },
    readyState,
    send,
    close,
    open,
  }
}

function isWebSocketSendable(data: unknown): data is UseWebSocketSendable {
  return isString(data) || ArrayBuffer.isView(data) || data instanceof ArrayBuffer || data instanceof Blob
}

function resolveCheckHeartbeatResponse(heartbeat: Exclude<UseWebSocketOptions['heartbeat'], undefined | false>) {
  return heartbeat === true
    ? () => true
    : heartbeat.responseMessage === true
      ? () => true
      : isWebSocketSendable(heartbeat.responseMessage)
        ? (data: UseWebSocketSendable) => data === heartbeat.responseMessage
        : (heartbeat.responseMessage ?? (() => true))
}

function resolveReconnectOptions(
  reconnect?: UseWebSocketOptions['reconnect'],
): Exclude<UseWebSocketOptions['reconnect'], true> {
  return reconnect
    ? reconnect === true
      ? defaultReconnectOptions
      : typeof reconnect === 'object'
        ? { ...defaultReconnectOptions, ...reconnect }
        : (false as const)
    : (false as const)
}

function resolveTimeout(heartbeat?: UseWebSocketOptions['heartbeat']) {
  return heartbeat
    ? heartbeat === true
      ? defaultResponseTimeout
      : (heartbeat.responseTimeout ?? defaultResponseTimeout)
    : 0
}

function resolveInterval(heartbeat?: UseWebSocketOptions['heartbeat']) {
  return heartbeat
    ? heartbeat === true
      ? defaultHeartbeatInterval
      : (heartbeat.interval ?? defaultHeartbeatInterval)
    : 0
}
