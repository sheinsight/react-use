export const EventHandlerList = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'webkitendfullscreen',
  'mozfullscreenchange',
  'MSFullscreenChange',
]

export const EnterMethodList = [
  'requestFullscreen',
  'webkitRequestFullscreen',
  'webkitEnterFullscreen',
  'webkitEnterFullScreen',
  'webkitRequestFullScreen',
  'mozRequestFullScreen',
  'msRequestFullscreen',
]

export const ExitMethodList = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitExitFullScreen',
  'webkitCancelFullScreen',
  'mozCancelFullScreen',
  'msExitFullscreen',
]

export const FullscreenEnabledAttrList = [
  'fullscreen',
  'webkitIsFullScreen',
  'webkitDisplayingFullscreen',
  'mozFullScreen',
  'msFullscreenElement',
]

export const FullscreenElementAttrList = [
  'fullscreenElement',
  'webkitFullscreenElement',
  'mozFullScreenElement',
  'msFullscreenElement',
]

export function getCompatibleAttr(el?: Element | null) {
  return {
    enter: EnterMethodList.find((m) => (document && m in document) || (el && m in el)),
    exit: ExitMethodList.find((m) => (document && m in document) || (TextTrackCueList && m in TextTrackCueList)),
    fsEnabled: FullscreenEnabledAttrList.find((m) => (document && m in document) || (el && m in el)),
    fsElement: FullscreenElementAttrList.find((m) => document && m in document),
  }
}
