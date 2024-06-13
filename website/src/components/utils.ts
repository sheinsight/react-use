export const repoBase = 'https://github.com/sheinsight/hooks/blob/main/src'

export const OTP = () => Math.random().toString().slice(-6)
export const wait = (ms = 300, res: string = OTP()): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve(res), ms))
