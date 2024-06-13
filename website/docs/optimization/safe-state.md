---
sidebar_position: 1
---

# Safe State

## Overview

`@shined/use` implement [useSafeState](/reference/use-safe-state) for all state management operations within components. This method ensures that state updates are controlled and secure, especially in scenarios that involve asynchronous operations or potential unexpected component unmounts. It's designed as a replacement for `React.useState`.

In essence, the behavior of `useSafeState` adapts based on the React version used:

- **React 17 and earlier**: The state updates only if the component is still mounted, a behavior ensured by the `useUnmounted` hook. This approach effectively suppresses the common React warnings related to setting state on unmounted components.
- **React 18 and later**: It functions identically to `React.useState`, leveraging React’s internal mechanisms for handling state updates more gracefully on unmounted components.

## Handling `setState` Calls on Unmounted Components

It is a common misconception that calling `setState` on an unmounted component leads to memory leaks. This warning primarily serves as a reminder to developers to terminate any ongoing operations such as timers and subscriptions after a component unmounts.

Moreover, during a component's lifecycle, if `setState` is invoked after the component has unmounted, it becomes a no-operation (noop). In practical terms, this means that such calls are harmlessly ignored; thus, they do not contribute to memory leaks or trigger undesired state updates.

Future updates to React, based on discussions for React 18, such as [discussion#82](https://github.com/reactwg/react-18/discussions/82), hint at potential changes in how state updates on unmounted components are handled. It suggests that avoiding state updates on unmounted components might be more problematic than permitting them, pointing towards a shift in best practices for future React versions.

Through this approach, `useSafeState` ensures compatibility and resilient state management across various versions of React, addressing both current and potential future behaviors concerning state updates on unmounted components.
