export const EventHandlerList = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange',
] as const

export const EnterMethodList = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitEnterFullscreen',
  'webkitEnterFullScreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen',
] as const

export const ExitMethodList = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitExitFullScreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen',
] as const

export const FullscreenEnabledAttrList = [
  'fullscreen',
  'webkitIsFullScreen',
  'webkitDisplayingFullscreen',
  'mozFullScreen',
  'msFullscreenElement',
] as const

export const FullscreenElementAttrList = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'mozFullScreenElement',
  'msFullscreenElement',
] as const

export function getCompatibleAttr(el?: Element | null): {
  enter: (typeof EnterMethodList)[number] | undefined
  exit: (typeof ExitMethodList)[number] | undefined
  fsEnabled: (typeof FullscreenEnabledAttrList)[number] | undefined
  fsElement: (typeof FullscreenElementAttrList)[number] | undefined
} {
  return {
    enter: EnterMethodList.find((m) => (document && m in document) || (el && m in el)),
    exit: ExitMethodList.find(
      (m) => (document && m in document) || (typeof TextTrackCueList !== 'undefined' && m in TextTrackCueList),
    ),
    fsEnabled: FullscreenEnabledAttrList.find((m) => (document && m in document) || (el && m in el)),
    fsElement: FullscreenElementAttrList.find((m) => document && m in document),
  }
}
