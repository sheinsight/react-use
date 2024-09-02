import { Toaster as ToasterInternal } from 'react-hot-toast'
export { default as cn } from 'classnames'

export * from 'react-hot-toast'
export * from '@formkit/auto-animate/react'
export * from './hooks'

export const repoBase = 'https://github.com/sheinsight/react-use/blob/main/packages/react-use/src'
export const defaultLang = 'en'

export const OTP = (): string => Math.random().toString(16).slice(-6).toUpperCase()
export const wait = (ms = 300, res: string = OTP()): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve(res), ms))

export function Toaster() {
  return <ToasterInternal position="bottom-right" containerClassName="m-16" />
}
