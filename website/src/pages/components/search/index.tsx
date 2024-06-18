import Link from '@docusaurus/Link'
import { useControlledComponent, useCreation, useUrlSearchParams } from '@site/../src'
import { Labels, iconMap } from '@site/src/components'
import { camelCase } from 'change-case'

import hooks from './hooks.json'

const filterLabelCls =
  'inline-flex gap-1 items-center rounded border border-solid text-xs border-gray/20 px-2 py-1 rounded-full cursor-pointer'

export function SearchHooks() {
  const categories = useCreation(() => Array.from(new Set(hooks.map((e) => e.category))).sort())
  const features = useCreation(() => Array.from(new Set(hooks.flatMap((e) => e.features.map((e) => e.name)))).sort())

  const input = useControlledComponent('')

  const [params, setParams, clearParams] = useUrlSearchParams('history', {
    initialValue: {
      category: [] as string[],
      feature: [] as string[],
    },
  })

  const filteredHooks = useCreation(() => {
    return hooks.filter((hook) => {
      const isNameMatch = hook.name.toLowerCase().includes(input.value.trim().toLowerCase())
      const isCategoryMatch = paramsMatch(params.category, hook.category)

      const isFeatureMatch =
        !params.feature.length || hook.features.some((e) => e.value && paramsMatch(params.feature, e.name))

      return isNameMatch && isCategoryMatch && isFeatureMatch
    })
  }, [params, input.value])

  const handleFilterClick = (paramName: string, value: string | undefined = undefined) => {
    if (!value || !params[paramName]) return setParams({ [paramName]: [] })
    const set = new Set(Array.isArray(params[paramName]) ? params[paramName] : [params[paramName]])
    set.has(value) ? set.delete(value) : set.add(value)
    if (!set.size) return setParams({ [paramName]: [] })
    setParams({ [paramName]: Array.from(set) })
  }

  return (
    <div className="flex flex-col gap-4 mt-12 p-4 w-100% lg:w-640px">
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
            className={`${getBgColor(!params.category.length)} ${filterLabelCls}`}
          >
            {iconMap.SelectAll}
            All
          </div>
          {categories.map((e) => (
            <div
              key={e}
              onClick={() => handleFilterClick('category', e)}
              onKeyDown={() => handleFilterClick('category', e)}
              className={`${getBgColor(paramsMatch(params.category, e, false))} ${filterLabelCls}`}
            >
              {iconMap[e] || ''}
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
            className={`${getBgColor(!params.feature.length)} ${filterLabelCls}`}
          >
            {iconMap.SelectAll}
            All
          </div>
          {features.map((e) => (
            <div
              key={e}
              onClick={() => handleFilterClick('feature', e)}
              onKeyDown={() => handleFilterClick('feature', e)}
              className={`${getBgColor(paramsMatch(params.feature, e, false))} ${filterLabelCls}`}
            >
              {iconMap[e] || ''}
              {e}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span
          onClick={clearParams}
          onKeyDown={clearParams}
          className={`${filterLabelCls} bg-amber/20 flex items-center gap-1 hover:bg-amber/32`}
        >
          <div className="i-mdi:filter-remove-outline w-1rem h-1rem" />
          Clear Filters
        </span>
        <span className="ml-2 text-gray/80">{filteredHooks.length} hooks found, sorted by name from A-Z</span>
      </div>

      <div className="overflow-y-scroll md:pt-2 md:h-48vh">
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
                  <Link to={`/reference/${hook.name}`}>
                    <span className="text-primary dark:text-primary">{hook.name}</span>
                  </Link>
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

function paramsMatch(array?: string[], value?: string, nullishIsTrue = true) {
  if ((!array || !array.length) && nullishIsTrue) return true
  return array.some((e) => e === value)
}
