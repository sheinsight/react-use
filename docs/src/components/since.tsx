interface Props {
  version: string
}

export function Since(props: Props) {
  return (
    <div className="rounded px-4 py-2 bg-primary/12 my-4 flex items-center gap-1">
      <span className="i-mdi-clock-outline" />
      <div>
        This Hook is available since <span className="text-primary font-bold">{props.version}</span>.
      </div>
    </div>
  )
}
