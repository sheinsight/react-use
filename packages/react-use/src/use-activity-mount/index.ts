import { useMount } from '../use-mount'

import type { AnyFunc } from '../utils/basic'

/**
 * A React Hook that runs a function only once when the component mounts in an [Activity](https://react.dev/reference/react/Activity) component.
 *
 * Unlike `useMount`, this hook ensures the callback is executed only once **strictly**, even when the Activity
 * is hidden and shown again. This is particularly useful for initialization logic that should only run once
 * in Activity contexts, not every time the component becomes visible.
 *
 * @param callback - The callback function to run when the component is mounted. Can be async.
 * @returns {void} `void`
 *
 * @since 1.13.0
 *
 * @see {@link https://react.dev/reference/react/Activity Activity} - React Activity API
 * @see {@link useMount} - For non-Activity mount behavior
 *
 * @example
 * ```tsx
 * import { Activity } from 'react'
 * import { useActivityMount } from '@shined/react-use'
 *
 * function Sidebar() {
 *   // This callback will only be executed once when the component first mounts,
 *   // NOT when the Activity is shown again after being hidden
 *   useActivityMount(() => {
 *     console.log('Sidebar initialized only once')
 *     fetchUserData()
 *   })
 *
 *   return <div>Sidebar Content</div>
 * }
 *
 * function App() {
 *   const [visible, setVisible] = useState(true)
 *
 *   return (
 *     <Activity mode={visible ? 'visible' : 'hidden'}>
 *       <Sidebar />
 *     </Activity>
 *   )
 * }
 * ```
 */
export function useActivityMount(callback?: AnyFunc | null | undefined | false): void {
  // Use strictOnce=true to ensure the callback only runs once,
  // even when the Activity component is hidden and shown again
  useMount(callback, true)
}
