import { useLang } from 'rspress/runtime'

interface Props {
  version: string
}

function ColorText(props: { children: string }) {
  return <span className="mx-1 text-red font-bold">{props.children}</span>
}

export function Deprecated(props: Props) {
  const isZhCN = useLang() === 'zh-cn'

  return (
    <div className="rounded px-4 py-2 bg-red/12 my-4 flex items-center gap-1">
      <span className="i-mdi-alert-circle-outline text-red" />

      {isZhCN ? (
        <span>
          这个 Hook 自<ColorText>{props.version}</ColorText>版本起被标记为弃用，请尽快迁移。
        </span>
      ) : (
        <span>
          This Hook is marked as<ColorText>deprecated</ColorText>since
          <ColorText>{props.version}</ColorText>, please migrate as soon as possible.
        </span>
      )}
    </div>
  )
}
