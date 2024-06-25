---
sidebar_position: 1
---

# Introduction

`@shined/react-use` is an SSR-friendly and highly optimized React Hooks library that offers a variety of **useful**, **reusable** Hooks written in **TypeScript**.

Primarily inspired by [VueUse](https://vueuse.org/), along with influences from [react-use](https://github.com/streamich/react-use), [ahooks](https://ahooks.js.org/), and many other excellent libraries within the community. Huge thanks to the Open Source community, especially the authors of the libraries mentioned above, for their great work and inspiration.

## 🚀 Features

- **Flexibility**: Features include [ElementTarget](/docs/features/element-target), [Ref Getter](/docs/features/ref-getter), [Pausable](/docs/features/pausable), and more.
- **Tree-shakable**: Designed and delivered with [ESM](https://nodejs.org/api/esm.html), import only what you need.
- **Interactive Documentation**: Interactive documentation with live examples and [Playground](https://react-online.vercel.app/#code=aW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnCmltcG9ydCB7IHVzZU1vdXNlLCB1c2VSZWFjdGl2ZSB9IGZyb20gJ0BzaGluZWQvcmVhY3QtdXNlJwoKCmZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHgsIHkgfSA9IHVzZU1vdXNlKCkKICBjb25zdCBbeyBjb3VudCB9LCBtdXRhdGVdID0gdXNlUmVhY3RpdmUoeyBjb3VudDogMCB9KQoKICBjb25zdCBhZGRPbmUgPSAoKSA9PiBtdXRhdGUuY291bnQrKwoKICByZXR1cm4gKAogICAgPGRpdj4KICAgICAgPGRpdj4oeCwgeSk6ICh7eH0sIHt5fSk8L2Rpdj4KICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthZGRPbmV9PkNvdW50OiB7Y291bnR9PC9idXR0b24%2BCiAgICA8L2Rpdj4KICApCn0KCmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcig8QXBwIC8%2BKQo%3D).
- **Lightweight**: Boasts [zero dependencies](https://github.com/sheinsight/react-use/blob/main/package.json).
- **SSR-friendly**: Ensures that all Hooks are compatible with Server-side Rendering (SSR).
- **First-class TypeScript Support**: Written in [TypeScript](https://www.typescriptlang.org/) with well-named type definitions and [JSDoc](https://jsdoc.app/) Comment.
- **~~Comprehensive Testing~~**: (Coming soon...)

Visit the [Get Started](/docs/get-started) section to explore how it can be integrated into your project.

## ⚡️ Optimizations

- **Safe State**: Implements a [safe state](/docs/optimization/safe-state) strategy for all stateful Hooks, reducing bugs and unwanted behaviors.
- **Stable functions**: Every exported function benefits from [stabilization](/docs/optimization/stabilization) by default.
- **Latest State**: Avoids the expired closure issues by using [latest](/docs/optimization/latest-state) state internally.
- **Reduced Unnecessary Rerenders**: Use [Pausable](/docs/features/pausable) instance to control the behavior of some Hooks optionally.
