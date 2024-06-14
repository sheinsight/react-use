import { Redirect } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import hooks from '../search/hooks.json'

export default function Reference() {
  const { siteConfig } = useDocusaurusContext()
  const hook = hooks[0]?.name ?? 'create-single-loading'
  return <Redirect to={`${siteConfig.baseUrl}reference/${hook}`} />
}
