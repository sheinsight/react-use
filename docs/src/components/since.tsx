import { useLang } from 'rspress/runtime'

interface Props {
  version: string
}

export function Since(props: Props) {
  const isZhCN = useLang() === 'zh-cn'

  return (
    <div className="rounded px-4 py-2 bg-primary/12 my-4 flex items-center gap-1">
      <span className="i-mdi-check-all text-primary" />

      {isZhCN ? (
        <span>
          这个 Hook 自 <span className="text-primary font-bold">{props.version}</span> 版本起可用。
        </span>
      ) : (
        <span>
          This Hook is available since <span className="text-primary font-bold">{props.version}</span>.
        </span>
      )}
    </div>
  )
}
