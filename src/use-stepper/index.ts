import { useCounter } from '../use-counter'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

export interface UseStepperReturn<StepName, Steps, Step> {
  /**
   * List of steps.
   */
  steps: Readonly<Steps>
  /**
   * Index of the current step.
   */
  index: number
  /**
   * Current step.
   */
  current: Step
  /**
   * Next step, or undefined if the current step is the last one.
   */
  next: StepName | undefined
  /**
   * Previous step, or undefined if the current step is the first one.
   */
  previous: StepName | undefined
  /**
   * Whether the current step is the first one.
   */
  isFirst: boolean
  /**
   * Whether the current step is the last one.
   */
  isLast: boolean
  /**
   * Get the step at the specified index.
   */
  at: (index: number) => Step | undefined
  /**
   * Get a step by the specified name.
   */
  get: (step: StepName) => Step | undefined
  /**
   * Go to the specified step.
   */
  goTo: (step: StepName) => void
  /**
   * Go to the next step. Does nothing if the current step is the last one.
   */
  goToNext(): void
  /**
   * Go to the previous step. Does nothing if the current step is the previous one.
   */
  goToPrevious(): void
  /**
   * Go back to the given step, only if the current step is after.
   */
  goBackTo: (step: StepName) => void
  /**
   * Checks whether the given step is the next step.
   */
  isNext: (step: StepName) => boolean
  /**
   * Checks whether the given step is the previous step.
   */
  isPrevious: (step: StepName) => boolean
  /**
   * Checks whether the given step is the current step.
   */
  isCurrent: (step: StepName) => boolean
  /**
   * Checks if the current step is before the given step.
   */
  isBefore: (step: StepName) => boolean
  /**
   * Checks if the current step is after the given step.
   */
  isAfter: (step: StepName) => boolean
}

export function useStepper<T>(steps: T[], initialIdx?: number): UseStepperReturn<T, T[], T> {
  const [idx, actions] = useCounter(initialIdx ?? 0)

  const at = useStableFn((index: number) => {
    const { steps } = latest.current
    return steps[index]
  })

  const get = useStableFn((step: T) => {
    const { steps } = latest.current
    if (!steps.includes(step)) return
    return at(steps.indexOf(step))
  })

  const goTo = useStableFn((step: T) => {
    const { steps } = latest.current
    if (steps.includes(step)) {
      actions.set(steps.indexOf(step))
    }
  })

  const goToNext = useStableFn(() => {
    const { isLast } = latest.current
    !isLast && actions.inc()
  })

  const goToPrevious = useStableFn(() => {
    const { isFirst } = latest.current
    !isFirst && actions.dec()
  })

  const goBackTo = useStableFn((step: T) => isAfter(step) && goTo(step))
  const isNext = useStableFn((step: T) => latest.current.steps.indexOf(step) === idx + 1)
  const isPrevious = useStableFn((step: T) => latest.current.steps.indexOf(step) === idx - 1)
  const isCurrent = useStableFn((step: T) => latest.current.steps.indexOf(step) === idx)

  const isBefore = useStableFn((step: T) => {
    const { index, steps } = latest.current
    return index < steps.indexOf(step)
  })

  const isAfter = useStableFn((step: T) => {
    const { index, steps } = latest.current
    return index > steps.indexOf(step)
  })

  const isFirst = idx === 0
  const isLast = idx === steps.length - 1
  const next = steps[idx + 1]
  const previous = steps[idx - 1]

  const latest = useLatest({ isFirst, isLast, steps, index: idx })

  const current = at(idx)

  return {
    index: idx,
    steps,
    current,
    next,
    previous,
    isFirst,
    isLast,
    at,
    get,
    goTo,
    goToNext,
    goToPrevious,
    goBackTo,
    isNext,
    isPrevious,
    isCurrent,
    isBefore,
    isAfter,
  }
}
