import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'

interface Options<Props> {
  wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>
  initialProps?: Props
}

interface RenderHookServerResult<Result> {
  result: {
    current: Result
  }
}

export const renderHookServer = <Result, Props>(
  render: (initialProps?: Props) => Result,
  options: Options<Props> = {},
): RenderHookServerResult<Result> => {
  const { wrapper, initialProps } = options
  let result: Result = null as Result

  function ComponentForTest({ renderProps }: { renderProps?: Props }) {
    result = render(renderProps)
    return null
  }

  const component = <ComponentForTest renderProps={initialProps} />
  const comWithWrapper = wrapper == null ? component : React.createElement(wrapper, null, component)

  ReactDOMServer.renderToString(comWithWrapper)

  return { result: { current: result } }
}
