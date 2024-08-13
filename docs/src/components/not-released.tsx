import { useLang } from 'rspress/runtime'

function ColorText(props: { children: string }) {
  return <span className="text-amber font-bold">{props.children}</span>
}

export function NotReleased() {
  const isZhCN = useLang() === 'zh-cn'

  return (
    <div className="rounded px-4 py-2 bg-amber/12 my-4 flex items-center gap-1">
      <span className="i-mdi-clock-outline text-amber" />

      {isZhCN ? (
        <span>
          这个 Hook <ColorText>尚未发布</ColorText>，请等待后续版本。
        </span>
      ) : (
        <span>
          This Hook is <ColorText>NOT released</ColorText> yet, please wait for the next version.
        </span>
      )}
    </div>
  )
}
