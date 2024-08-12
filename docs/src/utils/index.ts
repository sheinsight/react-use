export { default as cn } from 'classnames'
export * from 'react-hot-toast'
export * from '@formkit/auto-animate/react'

export const repoBase = 'https://github.com/sheinsight/react-use/blob/main/src'

export const OTP = (): string => Math.random().toString(16).slice(-6)
export const wait = (ms = 300, res: string = OTP()): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve(res), ms))
