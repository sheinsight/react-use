import { normalizeImagePath } from 'rspress/runtime'

export function Logo() {
  return <img alt="logo" src={normalizeImagePath('/logo.svg')} className="size-24 mb-8" />
}
