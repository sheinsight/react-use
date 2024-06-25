---

sidebar_position: 2

---

# ElementTarget

`ElementTarget` 是一个联合类型，表示 React 中可以被定位的各种元素类型。

## 简而言之

- 在 React 中访问元素进行点击、悬停等操作是很常见的。
- 传统的方法包括使用 `Ref` 或 DOM 查询，这在服务器端渲染（SSR）环境中可能会有挑战。
- 为了提升开发者体验（DX）和对 SSR 的支持，我们引入了 `useTargetElement`。
- 这是一个对 SSR 友好的 React Hook，简化了定位元素的过程。

如果您正在寻找 `ElementTarget` 类型，请参考 [ElementTarget Types](#elementtarget-types)。

## 动机

React Hooks 经常需要访问 DOM 元素来执行如点击组件外部（`useClickAway`）、悬停（`useHover`）或滚动（`useScroll`）等操作。

传统上，React 中访问 HTML 元素主要有两种方法：

- **React Ref**：使用 `ref={ref}` 将 `Ref` 附加到一个元素上，并通过 `ref.current` 访问它。
- **DOM 查询**：直接使用 `document` 的方法获得元素，如 `querySelector`。

```tsx
// React Ref
useEffect(() => {
  if (ref.current) {
    // 对 ref.current 做一些操作
  }
}, [])

// DOM 查询
useEffect(() => {
  const el = document.getElementById('target')
  // 对 el 做一些操作
}, [])
```

虽然这些方法行之有效，但它们在 SSR 环境中引入了挑战，因为在渲染阶段直接访问元素或浏览器特定对象是不可能的。相反，开发者必须使用 `useEffect` 或 `Ref` 在客户端访问这些元素或对象。

此外，经常希望通过传递 `Ref` 直接访问元素，这在许多 Hooks 和日常使用场景中是一个共同的需求。

## 介绍 `useTargetElement`

为了解决这些问题，我们创建了 `useTargetElement` Hook，它简化了获取目标元素的过程。这个 Hook 返回一个包含目标元素的 React `Ref`:

```tsx
const targetRef = useTargetElement(elementTarget)
```

它接受一个 getter 函数作为输入以避免 SSR 相关的错误，并且还支持包含元素的 `Ref`，以增强 DX 并适应广泛的使用场景。

这个 Hook 在许多需要元素定位的 Hooks 中找到了它的位置。它代表了需要在其 Hooks 内访问元素的开发者的最佳实践。

### ElementTarget 类型

:::tip

一个 "🚥" 前缀表示目标可以是一个 `getter` 函数，这在 SSR 上下文中特别有用。"⚛️" 前缀表示目标可以是包含它的 `Ref`。

:::

- 🚥 ⚛️ **window/document**：全局 window 或 document 对象。
- 🚥 ⚛️ **Element**：任何 HTML 元素。
- 🚥 ⚛️ **Element Selector**：一个 CSS 选择器字符串，例如 `#id`、`.class.subclass`、`tag` 等。
- 🚥 ⚛️ **null/undefined**：这些表示无目标，简化了错误处理，同时确保了与 TypeScript 的顺畅集成。

### 有效示例

```tsx
const ref = useRef<HTMLDivElement>(null) // <div ref={ref} />
const targetRef = useTargetElement(ref)

const targetRef = useTargetElement('#my-div')
const targetRef = useTargetElement('#my-div .container')

const targetRef = useTargetElement(() => window)
const targetRef = useTargetElement(() => document.getElementById('my-div'))

// 不推荐，会引起 SSR 问题
const targetRef = useTargetElement(window)
// 不推荐，会引起 SSR 问题
const targetRef = useTargetElement(document.getElementById('my-div'))
```
