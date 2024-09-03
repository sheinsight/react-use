import { useRef } from 'react'
import { useCreation } from '../use-creation'
import { useDebouncedFn } from '../use-debounced-fn'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRetryFn } from '../use-retry-fn'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTimeoutFn } from '../use-timeout-fn'
import { useUnmount } from '../use-unmount'
import { useUpdateEffect } from '../use-update-effect'
import { useVersionedAction } from '../use-versioned-action'
import { isBoolean, isDev, isString, noop } from '../utils/basic'

import type { RefObject } from 'react'
import type { Pausable } from '../use-pausable'
import type { UseRetryFnOptions } from '../use-retry-fn'

export type UseWebSocketSendable = string | ArrayBufferLike | Blob | ArrayBufferView

export interface UseWebSocketOptionsHeartbeat {
  /**
   * The message to send to the server, or an object containing the message to send and the expected response.
   *
   * @defaultValue 'ping' (send 'ping' to the server, and expect 'ping' in response by default)
   */
  message?: UseWebSocketSendable | { send: UseWebSocketSendable; response: UseWebSocketSendable }
  /**
   * The interval in milliseconds to send the message to the server.
   *
   * @defaultValue 3_000
   */
  interval?: number
  /**
   * The timeout in milliseconds to wait for the response from the server.
   *
   * @defaultValue 10_000
   */
  responseTimeout?: number
}

export interface UseWebSocketOptionsReconnect
  extends Omit<UseRetryFnOptions, 'onError' | 'onErrorRetry' | 'onRetryFailed'> {
  /**
   * The callback function that is called when the WebSocket connection is reconnected.
   *
   * @defaultValue undefined
   */
  onReconnect: UseRetryFnOptions['onErrorRetry']
  /**
   * The callback function that is called when the WebSocket connection fails to reconnect.
   *
   * @defaultValue undefined
   */
  onReconnectFailed: UseRetryFnOptions['onRetryFailed']
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
   * If `true`, the default heartbeat message is `'ping'`, and the default interval is `3_000` milliseconds.
   *
   * @defaultValue false
   */
  heartbeat?: boolean | UseWebSocketOptionsHeartbeat
  /**
   * Whether to reconnect when the connection is closed.
   *
   * @defaultValue false
   */
  reconnect?: boolean | UseWebSocketOptionsReconnect
  /**
   * Whether to connect to the server immediately.
   *
   * @defaultValue true
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
   * reset connection debounce interval when the WebSocket URL changes.
   *
   * @defaultValue 0
   */
  debounce?: number
}

export interface UseWebSocketReturns<HasURL extends boolean> extends Pausable {
  /**
   * A ref object that holds the WebSocket instance.
   */
  wsRef: RefObject<WebSocket | null>
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

export function useWebSocket(wsUrl?: string, options?: UseWebSocketOptions): UseWebSocketReturns<true>
export function useWebSocket(options?: Omit<UseWebSocketOptions, 'immediate'>): UseWebSocketReturns<false>
export function useWebSocket(
  wsUrl?: string | UseWebSocketOptions,
  options: UseWebSocketOptions = {},
): UseWebSocketReturns<boolean> {
  const [_url, _options = {}] = isString(wsUrl) ? [wsUrl, options] : [undefined, wsUrl]

  const { immediate = !!_url, closeOnUnmount = true } = _options

  const wsRef = useRef<WebSocket | null>(null)
  const isClosedIntentionally = useRef<boolean>(false)
  const [incVersion, runVersionedAction] = useVersionedAction()

  const heartbeatOptions = useCreation(() => {
    return isBoolean(_options.heartbeat)
      ? _options.heartbeat === true
        ? { interval: 3_000, message: 'ping', serverTimeout: 10_000 }
        : undefined
      : _options.heartbeat
  }, [_options.heartbeat]) as UseWebSocketOptionsHeartbeat | undefined

  const reconnectOptions = useCreation(() => {
    return isBoolean(_options.reconnect)
      ? _options.reconnect
        ? { count: 3, interval: 1000 }
        : undefined
      : _options.reconnect
  }, [_options.reconnect]) as UseWebSocketOptionsReconnect | undefined

  const [readyState, setReadyState] = useSafeState<UseWebSocketReturnsReadyState>(WebSocket.CLOSED)

  const latest = useLatest({
    wsUrl: _url,
    heartbeatOptions,
    reconnectOptions,
    onOpen: _options.onOpen ?? noop,
    onClose: _options.onClose ?? noop,
    onError: _options.onError ?? noop,
    onMessage: _options.onMessage ?? noop,
    protocols: _options.protocols ?? [],
    debounce: _options.debounce ?? 0,
  })

  function open(
    wsUrl: string | undefined = latest.current.wsUrl,
    protocols: string | string[] | undefined = latest.current.protocols,
  ) {
    let url = wsUrl
    if (latest.current.wsUrl) url = latest.current.wsUrl

    if (!url) {
      if (isDev) console.error('The WebSocket URL is required.')
      return
    }

    close()

    const version = incVersion()

    setReadyState(WebSocket.CONNECTING)

    isClosedIntentionally.current = false

    wsRef.current = new WebSocket(url, protocols)

    wsRef.current.onopen = (event) => {
      runVersionedAction(version, () => {
        setReadyState(WebSocket.OPEN)
        latest.current.onOpen(event, wsRef.current as WebSocket)
      })
    }

    wsRef.current.onclose = (event) => {
      runVersionedAction(version, () => {
        setReadyState(WebSocket.CLOSED)
        latest.current.onClose(event, wsRef.current as WebSocket)

        if (!isClosedIntentionally.current && reconnectOptions) {
          openWithRetry()
        }
      })
    }

    wsRef.current.onerror = (event) => {
      runVersionedAction(version, () => {
        setReadyState(WebSocket.CLOSED)
        latest.current?.onError?.(event, wsRef.current as WebSocket)
      })
    }

    wsRef.current.onmessage = (event) => {
      runVersionedAction(version, () => {
        const { heartbeatOptions } = latest.current

        if (heartbeatOptions) {
          responsePausable.pause()

          const response = isWebSocketSendable(heartbeatOptions.message)
            ? heartbeatOptions.message
            : heartbeatOptions.message?.response ?? defaultHeartbeatMessage

          if (event.data === response) return
        }

        latest.current.onMessage(event, wsRef.current as WebSocket)
      })
    }
  }

  const openWithRetry = useRetryFn(open, {
    ...reconnectOptions,
    onRetryFailed(...args) {
      setReadyState(WebSocket.CLOSED)
      latest.current.reconnectOptions?.onReconnectFailed?.(...args)
    },
  })

  const openWithRetryAndDebounce = useDebouncedFn(openWithRetry, {
    wait: latest.current.debounce,
  })

  // it means the server is timeout to response the heartbeat message, will try to reconnect
  const responsePausable = useTimeoutFn(
    () => {
      // don't intentionally close the connection, and it will trigger reconnect if necessary
      internalClose(1000, 'Server did not respond to the heartbeat message', false)
    },
    heartbeatOptions?.responseTimeout ?? 10_000,
    { immediate: false },
  )

  const heartbeatPausable = useIntervalFn(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && heartbeatOptions) {
      const message = isWebSocketSendable(heartbeatOptions.message)
        ? heartbeatOptions.message
        : heartbeatOptions.message?.send ?? defaultHeartbeatMessage

      wsRef.current.send(message)

      if (!responsePausable.isActive()) {
        responsePausable.resume()
      }
    }
  }, heartbeatOptions?.interval)

  const send = useStableFn((data: UseWebSocketSendable) => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(data)
      } else {
        if (isDev) {
          console.error('WebSocket is not open, unable to send data:', data)
        }
      }
    }
  })

  function internalClose(code?: number, reason?: string, intentional = true) {
    if (wsRef.current) {
      responsePausable.pause()
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
    internalClose(code, reason)
  })

  useMount(immediate && openWithRetry)

  useUnmount(closeOnUnmount && close)

  // biome-ignore lint/correctness/useExhaustiveDependencies: handle url change
  useUpdateEffect(() => {
    openWithRetryAndDebounce()
  }, [_url])

  return {
    wsRef,
    readyState,
    send,
    close,
    open,
    ...heartbeatPausable,
  }
}

/**
 * Check whether the data is sendable to the server.
 */
function isWebSocketSendable(data: unknown): data is UseWebSocketSendable {
  return isString(data) || ArrayBuffer.isView(data) || data instanceof ArrayBuffer || data instanceof Blob
}
