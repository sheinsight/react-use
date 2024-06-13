---
sidebar_position: 1
---

# Introduction

`@shined/use` is an SSR-friendly and highly optimized React Hooks library that offers a variety of **useful**, **reusable** Hooks written in **TypeScript**.

## 🚀 Features

Primarily inspired by [VueUse](https://vueuse.org/), along with influences from [react-use](https://github.com/streamich/react-use), [ahooks](https://ahooks.js.org/), and many other excellent libraries within the community.

- **Flexibility**: Features include [ElementTarget](/docs/features/element-target), [Ref Getter](/docs/features/ref-getter), [Pausable](/docs/features/pausable), and more.
- **SSR-friendly**: Ensures that all Hooks are compatible with Server-side Rendering (SSR).
- **Tree-shakable**: Designed and delivered with ESM, import only what you need.
- **Lightweight**: Boasts [zero dependencies](https://github.com/sheinsight/use/blob/main/package.json).
- **First-class TypeScript Support**: Written in [TypeScript](https://www.typescriptlang.org/) with well-named type definitions.
- **~~Comprehensive Testing~~**: (Coming soon...)

Visit the [Get Started](/docs/get-started) section to explore how it can be integrated into your project.

## ⚡️ Optimizations

- **Safe State**: Implements a [safe state](/docs/optimization/safe-state) strategy for all stateful Hooks, reducing bugs and unwanted behaviors.
- **Stable functions**: Every exported function benefits from [stabilization](/docs/optimization/stabilization) by default.
- **Latest State**: Avoids the expired closure issues by using [latest](/docs/optimization/latest-state) state internally.
- **Reduced Unnecessary Rerenders**: Use [Pausable](/docs/features/pausable) instance to control the behavior of some Hooks optionally.
