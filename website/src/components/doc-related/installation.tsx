import CodeBlock from '@theme/CodeBlock'
import TabItem from '@theme/TabItem'
import Tabs from '@theme/Tabs'

import type { SVGProps } from 'react'

const pnpmLabel = (
  <div className="flex items-center gap-2">
    <VscodeIconsFileTypePnpm />
    pnpm
  </div>
)

const npmLabel = (
  <div className="flex items-center gap-2">
    <VscodeIconsFileTypeNpm />
    npm
  </div>
)

const yarnLabel = (
  <div className="flex items-center gap-2">
    <VscodeIconsFileTypeYarn />
    Yarn
  </div>
)

const bunLabel = (
  <div className="flex items-center gap-2">
    <VscodeIconsFileTypeBun />
    Bun
  </div>
)

export function Installation({ npmName = '' }: { npmName?: string }) {
  return (
    <Tabs>
      {/* @ts-expect-error: element is valid as label */}
      <TabItem value="pnpm" label={pnpmLabel} default>
        <CodeBlock language="bash">pnpm add {npmName}</CodeBlock>
      </TabItem>
      {/* @ts-expect-error: element is valid as label */}
      <TabItem value="npm" label={npmLabel} default>
        <CodeBlock language="bash">npm install {npmName}</CodeBlock>
      </TabItem>
      {/* @ts-expect-error: element is valid as label */}
      <TabItem value="yarn" label={yarnLabel} default>
        <CodeBlock language="bash">yarn add {npmName}</CodeBlock>
      </TabItem>
      {/* @ts-expect-error: element is valid as label */}
      <TabItem value="bun" label={bunLabel} default>
        <CodeBlock language="bash">bun add {npmName}</CodeBlock>
      </TabItem>
    </Tabs>
  )
}

export function VscodeIconsFileTypePnpm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 32 32" {...props}>
      <title>pnpm</title>
      <path
        fill="#f9ad00"
        d="M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z"
      />
      <path
        fill="#4e4e4e"
        d="M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z"
      />
    </svg>
  )
}

export function VscodeIconsFileTypeNpm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 32 32" {...props}>
      <title>npm</title>
      <path
        fill="#cb3837"
        d="M2 10.555h28v9.335H16v1.556H9.778v-1.557H2Zm1.556 7.779h3.111v-4.668h1.555v4.667h1.556v-6.222H3.556Zm7.778-6.223v7.779h3.111v-1.556h3.111v-6.223Zm3.111 1.556H16v3.112h-1.556Zm4.667-1.556v6.223h3.111v-4.668h1.556v4.667h1.556v-4.667h1.556v4.667h1.556v-6.222Z"
      />
    </svg>
  )
}

export function VscodeIconsFileTypeYarn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 32 32" {...props}>
      <title>yarn</title>
      <path
        fill="#2188b6"
        d="M28.208 24.409a10.493 10.493 0 0 0-3.959 1.822a23.743 23.743 0 0 1-5.835 2.642a1.632 1.632 0 0 1-.983.55a62.228 62.228 0 0 1-6.447.577c-1.163.009-1.876-.3-2.074-.776a1.573 1.573 0 0 1 .866-2.074a3.759 3.759 0 0 1-.514-.379c-.171-.171-.352-.514-.406-.388c-.225.55-.343 1.894-.947 2.5c-.83.839-2.4.559-3.328.072c-1.019-.541.072-1.813.072-1.813a.73.73 0 0 1-.992-.343a4.847 4.847 0 0 1-.667-2.949a5.374 5.374 0 0 1 1.749-2.895a9.334 9.334 0 0 1 .658-4.4a10.445 10.445 0 0 1 3.165-3.661S6.628 10.747 7.35 8.817c.469-1.262.658-1.253.812-1.308a3.633 3.633 0 0 0 1.452-.857a5.265 5.265 0 0 1 4.41-1.7S15.2 1.4 16.277 2.09a18.349 18.349 0 0 1 1.533 2.886s1.281-.748 1.425-.469a11.334 11.334 0 0 1 .523 6.132a14.01 14.01 0 0 1-2.6 5.411c-.135.225 1.551.938 2.615 3.887c.983 2.7.108 4.96.262 5.212c.027.045.036.063.036.063s1.127.09 3.391-1.308a8.5 8.5 0 0 1 4.277-1.604a1.081 1.081 0 0 1 .469 2.11Z"
      />
    </svg>
  )
}

export function VscodeIconsFileTypeBun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 32 32" {...props}>
      <title>bun</title>
      <path
        fill="#fbf0df"
        d="M29 17c0 5.65-5.82 10.23-13 10.23S3 22.61 3 17c0-3.5 2.24-6.6 5.66-8.44S14.21 4.81 16 4.81s3.32 1.54 7.34 3.71C26.76 10.36 29 13.46 29 17"
      />
      <path
        fill="none"
        stroke="#000"
        d="M16 27.65c7.32 0 13.46-4.65 13.46-10.65c0-3.72-2.37-7-5.89-8.85c-1.39-.75-2.46-1.41-3.37-2l-1.13-.69A6.14 6.14 0 0 0 16 4.35a6.88 6.88 0 0 0-3.3 1.23c-.42.24-.86.51-1.32.8c-.87.54-1.83 1.13-3 1.73C4.91 10 2.54 13.24 2.54 17c0 6 6.14 10.65 13.46 10.65Z"
      />
      <ellipse cx={21.65} cy={18.62} fill="#febbd0" rx={2.17} ry={1.28} />
      <ellipse cx={10.41} cy={18.62} fill="#febbd0" rx={2.17} ry={1.28} />
      <path
        fillRule="evenodd"
        d="M11.43 18.11a2 2 0 1 0-2-2.05a2.05 2.05 0 0 0 2 2.05m9.2 0a2 2 0 1 0-2-2.05a2 2 0 0 0 2 2.05"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M10.79 16.19a.77.77 0 1 0-.76-.77a.76.76 0 0 0 .76.77m9.2 0a.77.77 0 1 0 0-1.53a.77.77 0 0 0 0 1.53"
      />
      <path
        fill="#b71422"
        stroke="#000"
        strokeWidth={0.75}
        d="M18.62 19.67a3.3 3.3 0 0 1-1.09 1.75a2.48 2.48 0 0 1-1.5.69a2.53 2.53 0 0 1-1.5-.69a3.28 3.28 0 0 1-1.08-1.75a.26.26 0 0 1 .29-.3h4.58a.27.27 0 0 1 .3.3Z"
      />
      <path
        fill="#ccbea7"
        fillRule="evenodd"
        d="M14.93 5.75a6.09 6.09 0 0 1-2.09 4.62c-.1.09 0 .27.11.22c1.25-.49 2.94-1.94 2.23-4.88c-.03-.15-.25-.11-.25.04m.85 0a6 6 0 0 1 .57 5c0 .13.12.24.21.13c.83-1 1.54-3.11-.59-5.31c-.1-.11-.27.04-.19.17Zm1-.06a6.09 6.09 0 0 1 2.53 4.38c0 .14.21.17.24 0c.34-1.3.15-3.51-2.66-4.66c-.12-.02-.21.18-.09.27ZM9.94 9.55a6.27 6.27 0 0 0 3.89-3.33c.07-.13.28-.08.25.07c-.64 3-2.79 3.59-4.13 3.51c-.14-.01-.14-.21-.01-.25"
      />
    </svg>
  )
}
