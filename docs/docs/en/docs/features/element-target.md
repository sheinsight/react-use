# 🎯 ElementTarget {#element-target}

`ElementTarget` is a union type that represents the various types of elements that can be targeted in React.

## TL; DR {#tl-dr}

- It's common to access elements in React for actions like clicking, hovering, etc.
- Traditional methods include using `Ref` or DOM queries, which can be challenging in Server-side Rendering (SSR) environments.
- To enhance Developer Experience (DX) and support for SSR, we introduce `useTargetElement`.
- It's a SSR friendly React Hook that simplifies the process of targeting elements.

If you are looking for `ElementTarget` types, please refer to [ElementTarget Types](#element-target-types).

## Motivation {#motivation}

Frequently, React Hooks require access to DOM elements to perform actions such as clicking outside a component (`useClickAway`), hovering (`useHover`), or scrolling (`useScroll`).

Traditionally, there are mainly two methods to access HTML elements in React:

- **React Ref**: Attach a `Ref` to an element using `ref={ref}` and access it via `ref.current`.
- **DOM Query**: Directly obtain the element using the `document`'s method, like `querySelector`.

```tsx
// React Ref
useEffect(() => {
  if (ref.current) {
    // do something with ref.current
  }
}, [])

// DOM Query
useEffect(() => {
  const el = document.getElementById('target')
  // do something with el
}, [])
```

While these approaches work well, they introduce challenges in SSR environments where direct access to elements or browser-specific objects during the render stage isn't possible. Instead, developers must utilize `useEffect` or `Ref` to access these elements or objects on the client side.

Additionally, it is often desirable to access an element directly by passing a `Ref`, a common requirement in many Hooks and daily use scenarios.

## Introducing `useTargetElement` {#introducing-use-target-element}

To address these issues, we've created the `useTargetElement` Hook, which simplifies the process of obtaining a target element. This Hook returns a React `Ref` containing the target element:

```tsx
const targetRef = useTargetElement(elementTarget)
```

It accepts a getter function as input to avoid SSR-related errors and also supports a `Ref` containing the element to enhance DX and accommodate a broad range of use cases.

This Hook has found its place in numerous Hooks that require element targeting. It represents a best practice for developers needing to access elements within their Hooks.

### ElementTarget Types {#element-target-types}

:::tip

A "🚥" prefix indicates that the target can be a `getter` function, which is particularly useful in SSR contexts. The "⚛️" prefix denotes that the target can be a `Ref` that contains it.

:::

- 🚥 ⚛️ **window/document**: The global window or document object.
- 🚥 ⚛️ **Element**: Any HTML element.
- 🚥 ⚛️ **Element Selector**: A CSS selector string, such as `#id`, `.class.subclass`, `tag`, etc.
- 🚥 ⚛️ **null/undefined**: These indicate the absence of a target, simplifying error handling while ensuring smooth integration with TypeScript.

### Valid Examples {#valid-examples}

```tsx
const ref = useRef<HTMLDivElement>(null) // <div ref={ref} />
const targetRef = useTargetElement(ref)

const targetRef = useTargetElement('#my-div')
const targetRef = useTargetElement('#my-div .container')

const targetRef = useTargetElement(() => window)
const targetRef = useTargetElement(() => document.getElementById('my-div'))

// NOT recommended, will cause SSR issues
const targetRef = useTargetElement(window)
// NOT recommended, will cause SSR issues
const targetRef = useTargetElement(document.getElementById('my-div'))
```
