import { cn } from '@/utils'
import { useLang } from 'rspress/runtime'
import semver from 'semver'

interface Props {
  version: string
}

export function Since(props: Props) {
  const isZhCN = useLang() === 'zh-cn'
  const isNotPublished = semver.gt(props.version.replace(/^v/i, ''), process.env.REACT_USE_VERSION || '0.0.0')

  const color = isNotPublished ? 'text-amber' : 'text-primary'

  return (
    <div
      className={cn('rounded px-4 py-2 my-4 flex items-center gap-1', isNotPublished ? 'bg-amber/12' : 'bg-primary/12')}
    >
      <span className={cn(color, isNotPublished ? 'i-mdi-clock-outline' : 'i-mdi-check-all')} />

      {isZhCN ? (
        isNotPublished ? (
          <span>
            这个 Hook 将被发布在 <span className={cn(color, 'font-bold')}>{props.version}</span> 版本中。
          </span>
        ) : (
          <span>
            这个 Hook 自 <span className={cn(color, 'font-bold')}>{props.version}</span> 版本起可用。
          </span>
        )
      ) : isNotPublished ? (
        <span>
          This Hook will be released with <span className={cn(color, 'font-bold')}>{props.version}</span> soon.
        </span>
      ) : (
        <span>
          This Hook is available since <span className={cn(color, 'font-bold')}>{props.version}</span>.
        </span>
      )}
    </div>
  )
}
