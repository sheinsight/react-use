# Roadmap

## v1 Version (Current Version) \{#v1-version}

> The functionalities are basically complete. Future work will focus on iterations over existing hooks, bug fixes, and ecosystem expansion.

### Automatic Dependency Collection \{#automatic-dependency-collection}

Migrating more hooks to use the **Automatic Dependency Collection** scheme. This is transparent to users but can significantly reduce unnecessary renders. For details, see [Dependency Collection](/docs/features/dependencies-collection).

## v2 Version \{#v2-version}

Improvements and optimizations will be made to address the issues and shortcomings of the current v1 version, which will introduce breaking changes:

### Adjust `useSupported` \{#adjust-use-supported}

Adjust the API return to expose the `isSupported` attribute as an object, enabling the Automatic Dependency Collection scheme. At the same time, force the user to explicitly specify a fallback function for "when the browser does not support the feature," aiming to explicitly remind developers to handle potential compatibility problems and reduce the likelihood of misuse.

> All internal hooks that depend on `useSupported` will be adjusted to fit the new API return format.

```tsx
// === Before Changing (v1) ===
const isSupported = useSupported(() => 'IntersectionObserver' in window)
console.log(isSupported) // true

// === After Changing (v2) ===
const { isSupported } = useSupported(() => 'IntersectionObserver' in window, {
  // onUnsupported must be explicitly specified
  onUnsupported: () => {
    console.log('IntersectionObserver is unsupported.')
  }
})
console.log(isSupported) // true
```
