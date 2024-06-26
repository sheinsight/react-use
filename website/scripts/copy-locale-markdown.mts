import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'
import { globby } from 'globby'

// TODO: re-write use import.meta.dirname
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const hooksBaseDir = path.resolve(__dirname, '../../src')
const hooksTargetBaseDir = path.resolve(__dirname, '../i18n/zh-cn/docusaurus-plugin-content-docs-hooks/current')

if (!fs.existsSync(hooksTargetBaseDir)) {
  fs.mkdirSync(hooksTargetBaseDir, { recursive: true })
}

const filePatterns = ['{use,create}-*/*_zh-cn.mdx', '{use,create}-*/demo.tsx']
const files = await globby(filePatterns, { cwd: hooksBaseDir })

for (const file of files) {
  const src = path.join(hooksBaseDir, file)
  const target = path.join(hooksTargetBaseDir, file.replace('_zh-cn', ''))
  const dir = path.dirname(target)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(src, target)
}

const docsBaseDir = path.resolve(__dirname, '../docs')
const docsTargetBaseDir = path.resolve(__dirname, '../i18n/zh-cn/docusaurus-plugin-content-docs/current')

if (!fs.existsSync(docsTargetBaseDir)) {
  fs.mkdirSync(docsTargetBaseDir, { recursive: true })
}

const docs = await globby(['**/*_zh-cn.{mdx,md}'], { cwd: docsBaseDir })

for (const doc of docs) {
  const src = path.join(docsBaseDir, doc)
  const target = path.join(docsTargetBaseDir, doc.replace('_zh-cn', ''))
  const dir = path.dirname(target)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(src, target)
}

console.log(`Locale files has been copied at ${new Date().toLocaleString()}`)
