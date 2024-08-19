import '@unocss/reset/tailwind.css'
import './style.css'

import Theme from 'rspress/theme'

const Layout = () => <Theme.Layout beforeNavTitle={<div>some content</div>} />

export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
