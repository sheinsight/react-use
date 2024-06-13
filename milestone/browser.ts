/** 通过 [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) 管理屏幕常亮状态 */
export const useWakeLock = () => {}
/** 使用 [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/notification) 管理浏览器通知 */
export const useWebNotification = () => {}
/** 通过控制 html 根元素的 class 来切换暗黑模式，并提供持久化状态 */
export const useDarkMode = () => {}
/** 通用 `useStorage` */
export const useStorage = () => {}
/** useStorage 显式指定 LocalStorage 的 alias */
export const useLocalStorage = () => {}
/** useStorage 显式指定 SessionStorage 的 alias */
export const useSessionStorage = () => {}
/** 异步 `useStorageAsync` */
export const useAsyncStorage = () => {}
/** 使用 [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) 处理 Tab 间通信 */
export const useBroadcastChannel = () => {}

/** 跟踪设备语言偏好 */
export const usePreferredLanguages = () => {}
/** 跟踪设备“减弱动画效果”偏好 */
export const usePreferredReducedMotion = () => {}
/** 方便处理选择文件对话框 */
export const useFileDialog = () => {}
/** 使用 [FileSystemAccess API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) 处理本地文件操作 */
export const useFileSystem = () => {}
/** 使用 [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) 处理游戏手柄 */
export const useGamepad = () => {}
/** 追踪图片加载状态 */
export const useImage = () => {}
/** 控制媒体播放及展现其控制功能 */
export const useMediaControls = () => {}
/** useMediaControls 显式指定 Audio 的 alias */
export const useAudio = () => {}
/** useMediaControls 显式指定 Video 的 alias */
export const useVideo = () => {}
/** `useObjectUrl` #vueuse */
export const useObjectUrl = () => {}
/** 使用 [PerformanceObserver API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/PerformanceObserver) 跟踪网页性能指标 */
export const usePerformanceObserver = () => {}
/** 跟踪屏幕安全区域 */
export const useScreenSafeArea = () => {}
/** 使用 [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) 创建和操作分享 */
export const useWebShare = () => {}
/** Web Workers 注册与通信 */
export const useWebWorker = () => {}
/** Web Workers 注册与通信函数 */
export const useWebWorkerFn = () => {}
/** 通过控制 html 根元素的 class 来切换不同的主题模式，并提供持久化状态 */
export const useColorMode = () => {}
/** 用户针对黑暗模式偏好的响应式状态 */
export const usePreferredDark = () => {}
/** 用户针对颜色模式偏好的响应式状态 */
export const usePreferredColorScheme = () => {}
/** 用户针对高对比度模式偏好的响应式状态 */
export const usePreferredContrast = () => {}
