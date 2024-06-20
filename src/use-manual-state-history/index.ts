import { defaultCloneFn } from '../use-cloned-state'
import { useDebouncedFn } from '../use-debounced-fn'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { isFunction, isNumber, timestamp } from '../utils/basic'

import type { CloneFn } from '../use-cloned-state'
import type { UseDebouncedFnOptions } from '../use-debounced-fn'
import type { UseThrottledFnOptions } from '../use-throttled-fn'

export interface UseRefHistoryRecord<T> {
  /**
   * The serialized snapshot
   */
  snapshot: T
  /**
   * The timestamp
   */
  timestamp: number
}

export interface UseManualStateHistoryOptions<Raw, Serialized = Raw> {
  /**
   * The capacity of the history records
   *
   * @defaultValue Number.POSITIVE_INFINITY
   */
  capacity?: number
  /**
   * Whether to clone the source state
   *
   * @defaultValue false
   */
  clone?: boolean | CloneFn<Raw>
  /**
   * The throttle options
   *
   * @defaultValue undefined
   */
  throttle?: number | UseThrottledFnOptions
  /**
   * The debounce options
   *
   * @defaultValue undefined
   */
  debounce?: number | UseDebouncedFnOptions
  /**
   * The dump function to serialize the source state
   *
   * @defaultValue (v) => v
   */
  dump?: (v: Raw) => Serialized
  /**
   * The parse function to deserialize the serialized state
   *
   * @defaultValue (v) => v
   */
  parse?: (v: Serialized) => Raw
}

export interface UseManualStateHistoryReturns<Raw, Serialized> {
  /**
   * The source state
   */
  source: Raw
  /**
   * The history records
   */
  history: UseRefHistoryRecord<Serialized>[]
  /**
   * The last history record
   */
  last: UseRefHistoryRecord<Serialized>
  /**
   * The undo stack
   */
  undoStack: UseRefHistoryRecord<Serialized>[]
  /**
   * The redo stack
   */
  redoStack: UseRefHistoryRecord<Serialized>[]
  /**
   * Whether can undo or redo
   */
  canUndo: boolean
  /**
   * Whether can redo or undo
   */
  canRedo: boolean
  /**
   * Undo the last change
   */
  undo(): void
  /**
   * Redo the last change
   */
  redo(): void
  /**
   * Clear all history records
   */
  clear(): void
  /**
   * Commit the current source state to history
   */
  commit(): void
}

type FnCloneOrBypass<F, T> = (v: F) => T

const fnBypass = <F, T>(v: F) => v as unknown as T

function defaultDump<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone ? (isFunction(clone) ? clone : defaultCloneFn) : fnBypass) as unknown as FnCloneOrBypass<R, S>
}

function defaultParse<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone ? (isFunction(clone) ? clone : defaultCloneFn) : fnBypass) as unknown as FnCloneOrBypass<S, R>
}

export function useManualStateHistory<Raw, Serialized = Raw>(
  source: Raw,
  options: UseManualStateHistoryOptions<Raw, Serialized> = {},
): UseManualStateHistoryReturns<Raw, Serialized> {
  const {
    clone = false,
    dump = defaultDump<Raw, Serialized>(clone),
    parse = defaultParse<Raw, Serialized>(clone),
    capacity = Number.POSITIVE_INFINITY,
    throttle,
    debounce,
  } = options

  const latest = useLatest({ source, dump, parse, capacity })

  const createHistoryRecord = useStableFn(() => {
    const { dump, source } = latest.current

    return {
      snapshot: dump(source),
      timestamp: timestamp(),
    }
  })

  const [state, _setState] = useSetState({
    last: createHistoryRecord(),
    undoStack: [] as UseRefHistoryRecord<Serialized>[],
    redoStack: [] as UseRefHistoryRecord<Serialized>[],
  })

  const latestState = useLatest({ ...state })

  const commit = useStableFn(() => {
    const { last, undoStack } = latestState.current
    const { capacity } = latest.current

    const addedUndoStack = [last, ...undoStack]
    const isCapReached = capacity && addedUndoStack.length >= capacity
    const newUndoStack = isCapReached ? addedUndoStack.slice(0, capacity) : addedUndoStack

    _setState({
      redoStack: [],
      undoStack: newUndoStack,
      last: createHistoryRecord(),
    })
  })

  const throttleOpts = isNumber(throttle) ? { wait: throttle } : throttle
  const debounceOpts = isNumber(debounce) ? { wait: debounce } : debounce

  const throttledCommit = useThrottledFn(commit, throttleOpts)
  const debouncedCommit = useDebouncedFn(commit, debounceOpts)

  const limitedCommit = throttleOpts ? throttledCommit : debounceOpts ? debouncedCommit : commit

  const clear = useStableFn(() => _setState({ undoStack: [], redoStack: [] }))

  const undo = useStableFn(() => {
    const { undoStack } = latestState.current
    if (!undoStack.length) return
    const state = undoStack[0]

    _setState((pre) =>
      state
        ? { undoStack: pre.undoStack.slice(1), redoStack: [pre.last, ...pre.redoStack], last: state }
        : { undoStack: pre.undoStack.slice(1) },
    )
  })

  const redo = useStableFn(() => {
    const { redoStack } = latestState.current
    if (!redoStack.length) return
    const state = redoStack[0]

    _setState((pre) =>
      state
        ? { redoStack: pre.redoStack.slice(1), undoStack: [pre.last, ...pre.undoStack], last: state }
        : { redoStack: pre.redoStack.slice(1) },
    )
  })

  const history = [state.last, ...state.undoStack]
  const canUndo = state.undoStack.length > 0
  const canRedo = state.redoStack.length > 0

  return {
    ...state,
    source,
    history,
    canUndo,
    canRedo,
    clear,
    undo,
    redo,
    commit: limitedCommit,
  }
}
