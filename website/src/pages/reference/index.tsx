import { Redirect } from '@docusaurus/router'
import hooks from '../search/hooks.json'

export default function Reference() {
  const hook = hooks[0]?.name ?? 'use-adaptive-text-area'
  return <Redirect to={`/reference/${hook}`} />
}
