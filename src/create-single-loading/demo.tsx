import { createSingleLoading } from '@shined/react-use'
import { create } from '@shined/reactive'

const pageLoading = createSingleLoading({ create })

const fetchOutsideReact = pageLoading.bind(async (otp: string) => {
  console.log(`one time password is ${otp}`)
})

export function App() {
  const loading = pageLoading.useLoading()

  const fnWithError = pageLoading.useAsyncFn(async () => {
    throw new Error('mock fetch error')
  })

  return 'hello'
}
