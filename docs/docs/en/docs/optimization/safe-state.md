# 🔒 Safe State {#safe-state}

## Overview {#overview}

`@shined/react-use` implements the [useSafeState](/reference/use-safe-state) method for all internal state management operations. This method ensures that state updates are controlled and safe, especially in scenarios involving asynchronous operations or possible accidental component unmounting. It is designed to be a replacement for `React.useState`.

The behavior of `useSafeState` varies depending on the version of React used:

- **React 17 and earlier versions**: Updates the state only when the component is still mounted. This behavior is achieved through the [useUnmounted](/reference/use-unmounted) Hook. This method effectively suppresses the common React warning related to "setting state on unmounted components".
- **React 18 and later versions**: Its functionality is the same as `React.useState`, following React's internal mechanisms to handle state updates on unmounted components more gracefully.

## Handling `setState` Calls on Unmounted Components {#handling-set-state-calls-on-unmounted-components}

There is a common misconception among developers that calling `setState` on an unmounted component will lead to memory leaks, but this is not the case.

This warning primarily serves as a reminder for developers to timely clean up related operations, such as timers and subscriptions, after the component is unmounted. In the lifecycle of the component, if `setState` is called after the component has been unmounted, it becomes a no-operation function (`noop`). Practically, this means such calls will be harmlessly ignored. Therefore, they will not cause memory leaks or trigger unwanted state updates.

According to [discussion #82](https://github.com/reactwg/react-18/discussions/82) of React 18, it points out that the future updates of React and the handling of state updates on unmounted components might undergo potential changes. The official statement indicates that "avoiding state updates on unmounted components" may be more problematic than "allowing these updates," implying that the best practices for state updates in future versions of React may shift.

## Real-World Implications {#real-world-implications}

Internally, `@shined/react-use` utilizes `useSafeState` in this manner to ensure compatibility and resilience in state management across different versions of React. By avoiding easily misunderstood warnings while also preparing for future changes in React versions, it guarantees the safety of state updates.
