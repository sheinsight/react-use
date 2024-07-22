import { Redirect } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import hooks from '../components/search/hooks.json'

export default function Reference() {
  const { siteConfig } = useDocusaurusContext()
  const hook = hooks.find((e) => e.category === 'State')?.name ?? 'useBoolean'
  return <Redirect to={`${siteConfig.baseUrl}reference/${hook}`} />
}
