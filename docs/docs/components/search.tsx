import { Labels, cn, iconMap } from '@/components'
import { useControlledComponent, useCreation, useUrlSearchParams } from '@shined/react-use'
import { camelCase } from 'change-case'
// import hooks from '@/hooks.json'

const hooks = []

const filterLabelCls =
  'transition will-change-auto inline-flex gap-1 items-center rounded border border-solid text-xs border-gray/20 px-2 py-1 rounded-full cursor-pointer'

export function SearchHooks() {
  const categories = useCreation(() => Array.from(new Set(hooks.map((e) => e.category))).sort())
  const features = useCreation(() => Array.from(new Set(hooks.flatMap((e) => e.features.map((e) => e.name)))).sort())

  const input = useControlledComponent('')

  const [params, setParams, clearParams] = useUrlSearchParams('history', {
    initialValue: {
      category: undefined as undefined | string,
      feature: undefined as undefined | string,
    },
  })

  const filteredHooks = useCreation(() => {
    return hooks.filter((hook) => {
      const isNameMatch = [camelCase(hook.name).toLowerCase(), hook.name.toLowerCase()].some((e) =>
        e.includes(input.value.trim().toLowerCase()),
      )

      const feature = (params.feature ?? '').toLowerCase()

      const isCategoryMatch = !params.category || params.category.toLowerCase() === hook.category.toLowerCase()
      const isFeatureMatch = !params.feature || hook.features.some((e) => e.name.toLowerCase() === feature && e.value)

      return isNameMatch && isCategoryMatch && isFeatureMatch
    })
  }, [params, input.value])

  const handleFilterClick = (paramName: string, value?: string | undefined) => {
    setParams({ [paramName]: value === 'all' ? undefined : value })
  }

  const hasFilter = params.category || params.feature

  return (
    <div className="flex flex-col gap-4 mt-12 p-4 w-full md:w-640px">
      <div>
        <input
          {...input.props}
          type="text"
          className="w-full outline-0 py-2 px-4 rounded text-xl input-border bg-#AAAAAA/12"
          placeholder="Search..."
        />
      </div>
      <div className="flex gap-2">
        <div className="w-80px text-right mr-1">Category</div>
        <div className="flex-1 flex flex-wrap gap-2">
          <div
            onClick={() => handleFilterClick('category')}
            onKeyDown={() => handleFilterClick('category')}
            className={cn(getBgColor(!params.category), filterLabelCls)}
          >
            {iconMap.SelectAll}
            All
          </div>
          {categories.map((e) => (
            <div
              key={e}
              onClick={() => handleFilterClick('category', e)}
              onKeyDown={() => handleFilterClick('category', e)}
              className={cn(getBgColor(paramsMatch(params.category, e, false)), filterLabelCls)}
            >
              {iconMap[e as keyof typeof iconMap] || ''}
              {e}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-80px text-right mr-1">Feature</div>
        <div className="flex-1 flex flex-wrap gap-2">
          <div
            onClick={() => handleFilterClick('feature')}
            onKeyDown={() => handleFilterClick('feature')}
            className={cn(getBgColor(!params.feature), filterLabelCls)}
          >
            {iconMap.SelectAll}
            All
          </div>
          {features.map((e) => (
            <div
              key={e}
              onClick={() => handleFilterClick('feature', e)}
              onKeyDown={() => handleFilterClick('feature', e)}
              className={cn(getBgColor(paramsMatch(params.feature, e, false)), filterLabelCls)}
            >
              {iconMap[e as keyof typeof iconMap] || ''}
              {e}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <div
          onClick={clearParams}
          onKeyDown={clearParams}
          className={cn(
            filterLabelCls,
            'flex items-center gap-1',
            hasFilter ? 'bg-amber/20 hover:bg-amber/32' : 'cursor-not-allowed',
          )}
        >
          <div className="i-mdi:filter-remove-outline w-1rem h-1rem" />
          Clear Filters
        </div>
        <span className="ml-2 text-gray">{filteredHooks.length} Hooks or utils found.</span>
      </div>

      <div className="overflow-y-scroll md:pt-2 md:h-46vh">
        <div className="flex flex-col gap-2">
          {filteredHooks.map((hook) => {
            const props = {
              category: hook.category,
              ...Object.fromEntries(hook.features.map((e) => [camelCase(e.name), e.value])),
            }

            return (
              <div
                key={hook.name}
                className="flex flex-col lg:flex-row flex-wrap justify-between gap-2 dark:bg-white/6 bg-black/4 rounded px-2 py-1"
              >
                <div>
                  <a href={`/reference/${hook.name}`}>
                    <span className="text-primary dark:text-primary">{camelCase(hook.name)}</span>
                  </a>
                </div>
                <div>
                  <Labels {...props} categoryOrder="last" />
                </div>
              </div>
            )
          })}

          {filteredHooks.length === 0 && <div className="text-center my-12">No hooks found</div>}
        </div>
      </div>
    </div>
  )
}

function getBgColor(active = false) {
  return active
    ? 'bg-primary/24 dark:bg-primary/36 hover:bg-primary/32 dark:hover:bg-primary/42'
    : 'hover:bg-#000/6 dark:hover:bg-white/6'
}

function paramsMatch(array?: string, value?: string, nullishIsTrue = true) {
  if ((!array || !array.length) && nullishIsTrue) {
    return true
  }

  return array === value
}
