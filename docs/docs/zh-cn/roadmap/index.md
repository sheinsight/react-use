# 后期规划（Roadmap）

## v1 版本（当前版本） \{#v1-version}

> 功能已基本完善，后期主要针对现有 Hooks 进行功能迭代、问题修复和生态扩充。

### 自动依赖收集 \{#automatic-dependency-collection}

迁移更多 Hooks 以使用**自动依赖收集**方案。对用户使用无感，但能显著降低不必要的渲染，详情参考 [依赖收集](/docs/features/dependencies-collection)。

## v2 版本 \{#v2-version}

针对当前 v1 版本的问题和不足进行改进优化，会引入破坏性变更：

### 调整 `useSupported` \{#adjustments-to-use-supported}

调整 API 返回，以对象的形式暴露 `isSupported` 属性，以启用自动依赖收集方案。同时，在 API 层面强制用户显式指定「当浏览器不支持该特性时的」回退处理函数，这一更改旨在显式提醒开发者处理可能存在的兼容性问题，以降低错误使用的可能性。

> 将会对所有内部依赖 `useSupported` 的 Hooks 进行调整，以适配新的 API 返回形式。

```tsx
// === 更改前 (v1) ===
const isSupported = useSupported(() => 'IntersectionObserver' in window)
console.log(isSupported) // true

// === 更改后 (v2) ===
const { isSupported } = useSupported(() => 'IntersectionObserver' in window, {
  // onUnsupported 必须显式指定
  onUnsupported: () => {
    console.log('IntersectionObserver is unsupported.')
  }
})
console.log(isSupported) // true
```
