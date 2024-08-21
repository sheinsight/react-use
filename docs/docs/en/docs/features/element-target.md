# 🎯 Element Target {#element-target}

`ElementTarget` is a union type that represents various kinds of elements that can be targeted in `@shined/react-use`.

## TL; DR {#tl-dr}

- Accessing elements for clicks, hovering, and other interactions is very common and reasonable in React.
- Traditional methods of using `Ref` or DOM queries face challenges in a Server-Side Rendering (SSR) environment.
- To improve Developer Experience (DX) while supporting SSR, we introduced `useTargetElement`.
- It simplifies the process of accessing different types of elements, ensuring consistency in the developer experience by abstracting the different ways of element access.

If you are looking for the `ElementTarget` type, please refer to [ElementTarget Types](#element-target-types).

## Motivation {#motivation}

React Hooks often require access to DOM elements to perform operations like clicking outside a component (`useClickAway`), hovering (`useHover`), or scrolling (`useScroll`).

Traditionally, accessing HTML elements in React is mainly done in two ways:

- **React Ref**: Attaching a `Ref` to an element using `ref={ref}` and accessing it in `useEffect` and similar places via `ref.current`.
- **DOM Queries**: Directly using instance methods on the `document` object to obtain elements in `useEffect` and similar places, like `querySelector`.

```tsx
// React Ref
useEffect(() => {
  if (ref.current) {
    // Perform some operations on ref.current
  }
}, [])

// Direct DOM query during rendering phase
const body = document.querySelector('body') // Not SSR friendly, not recommended

// DOM query inside useEffect
useEffect(() => {
  const el = document.getElementById('target')
  // Perform some operations on el
}, [])
```

While these methods are effective, they pose challenges in an SSR environment, as direct access to elements or browser-specific objects during rendering is not possible. Instead, developers must access these elements or objects on the client-side using `useEffect` or `Ref`. Moreover, developers often wish to access elements directly via passing `Ref`, which is a common requirement in many Hooks and daily use scenarios.

## useTargetElement {#use-target-element}

To address these issues, we created the `useTargetElement` Hook, which simplifies the process of obtaining the target element. This Hook returns a React `Ref` containing the target element:

```tsx
const targetRef = useTargetElement(elementTarget)
```

It can accept a Getter function as input to avoid SSR-related errors and also supports a `Ref` containing the element to enhance Developer Experience (DX) and accommodate a wide range of scenarios.

This Hook has been used in many core functionalities of `@shined/react-use`, such as `useClickAway`, `useHover`, and `useScroll`, representing best practices for developers needing to access elements within their Hooks.

### ElementTarget Types {#element-target-types}

:::tip Tip
The "🚥" prefix indicates it can be a Getter function, especially useful in SSR. The "⚛️" prefix indicates it can be a `Ref` containing it.
:::

- 🚥 ⚛️ **window/document**: The global window or document object.
- 🚥 ⚛️ **Element**: Any HTML element.
- 🚥 ⚛️ **Element Selector**: A CSS selector string, such as `#id`, `.class.subclass`, `tag`, etc.
- 🚥 ⚛️ **null/undefined**: Indicates no target, simplifying error handling while ensuring smooth integration with TypeScript.

### Valid Examples {#valid-examples}

```tsx
const ref = useRef<HTMLDivElement>(null) // <div ref={ref} />
const targetRef = useTargetElement(ref)

const targetRef = useTargetElement('#my-div')
const targetRef = useTargetElement('#my-div .container')

const targetRef = useTargetElement(() => window)
const targetRef = useTargetElement(() => document.getElementById('my-div'))

// Not recommended, may cause SSR issues
const targetRef = useTargetElement(window)
// Not recommended, may cause SSR issues
const targetRef = useTargetElement(document.getElementById('my-div'))
```
