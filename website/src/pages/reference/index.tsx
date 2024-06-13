import { Redirect } from '@docusaurus/router'
import hooks from '../search/hooks.json'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Reference() {
  const { siteConfig } = useDocusaurusContext()
  const hook = hooks[0]?.name ?? 'create-single-loading'
  return <Redirect to={`${siteConfig.baseUrl}reference/${hook}`} />
}
