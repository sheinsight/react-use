import { normalizeImagePath } from 'rspress/runtime'

export function ReactUseIcon() {
  return <img alt="react-use-icon" src={normalizeImagePath('/icon.svg')} className="size-24 mb-8" />
}
