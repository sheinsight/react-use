<p align="center">
<img src="https://sheinsight.github.io/react-use/logo.svg" height="150">
</p>

<h1 align="center">
@shined/react-use
</h1>
<p align="center">
A New Programming Paradigm to Reshape React Development.
<p>
<p align="center">
  <a href="https://www.npmjs.com/package/@shined/react-use"><img src="https://img.shields.io/npm/v/%40shined%2Freact-use?style=flat&labelColor=%23ffffff&color=%232e8555"></a>
  <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome"></a>
  <a href="https://pkg-size.dev/@shined/react-use"><img src="https://pkg-size.dev/badge/bundle/108293"></a>
<p>

<p align="center">
 <a href="https://sheinsight.github.io/react-use">Documentation</a> | <a href="https://sheinsight.github.io/react-use/docs/get-started">Get Started</a> | <a href="https://sheinsight.github.io/react-use/reference">Reference</a>
</p>
<p align="center">
<a href="https://sheinsight.github.io/react-use/zh-cn/">中文文档</a>
</p>

<br>

## 🎉 Introduction

`@shined/react-use` is a new Programming Paradigm to reshape React development. It's essentially an **SSR-friendly**, **comprehensive**, and **highly optimized** React Hooks library that delivers flexible and efficient hook solutions. Fully developed with **TypeScript**, it comes equipped with an interactive documentation filled with rich examples 🔥.

Primarily inspired by [VueUse](https://vueuse.org/), along with influences from [react-use](https://github.com/streamich/react-use), [ahooks](https://ahooks.js.org/), and many other excellent libraries within the community. Huge thanks to the Open Source community, especially the authors of the libraries mentioned above, for their great work and inspiration.


## 🚀 Features

- **Flexibility**: [Dependencies Collection](https://sheinsight.github.io/react-use/docs/features/dependencies-collection), [ElementTarget](https://sheinsight.github.io/react-use/docs/features/element-target), [Ref Getter](https://sheinsight.github.io/react-use/docs/features/ref-getter), [Pausable](https://sheinsight.github.io/react-use/docs/features/pausable), and [more](https://sheinsight.github.io/react-use/docs/introduction#features).
- **Tree-shakable**: Designed and delivered with [ESM](https://nodejs.org/api/esm.html), import only what you need.
- **Interactive Documentation**: Interactive documentation with live examples and [Playground](https://react-online.vercel.app/#code=aW1wb3J0IHsgY3JlYXRlIH0gZnJvbSAnQHNoaW5lZC9yZWFjdGl2ZScKaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnCmltcG9ydCB7IHVzZU1vdXNlLCB1c2VSZWFjdGl2ZSB9IGZyb20gJ0BzaGluZWQvcmVhY3QtdXNlJwoKCmZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHgsIHkgfSA9IHVzZU1vdXNlKCkKICBjb25zdCBbeyBjb3VudCB9LCBtdXRhdGVdID0gdXNlUmVhY3RpdmUoeyBjb3VudDogMCB9LCB7IGNyZWF0ZSB9KQoKICBjb25zdCBhZGRPbmUgPSAoKSA9PiBtdXRhdGUuY291bnQrKwoKICByZXR1cm4gKAogICAgPGRpdj4KICAgICAgPGRpdj4oeCwgeSk6ICh7eH0sIHt5fSk8L2Rpdj4KICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthZGRPbmV9PkNvdW50OiB7Y291bnR9PC9idXR0b24%2BCiAgICA8L2Rpdj4KICApCn0KCmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcig8QXBwIC8%2BKQo%3D).
- **Lightweight**: Boasts [zero dependencies](https://github.com/sheinsight/react-use/blob/main/package.json).
- **SSR-friendly**: Ensures that all Hooks are compatible with Server-side Rendering (SSR).
- **First-class TypeScript Support**: Written in [TypeScript](https://www.typescriptlang.org/) with well-named type definitions and [JSDoc](https://jsdoc.app/) Comment.
- **~~Comprehensive Testing~~**: (Coming soon...)

Visit the [Get Started](https://sheinsight.github.io/react-use/docs/get-started) section to explore how it can be integrated into your project.

## ⚡️ Optimizations

- **Safe State**: Implements a [safe state](https://sheinsight.github.io/react-use/docs/optimization/safe-state) strategy for all stateful Hooks, reducing bugs and unwanted behaviors.
- **Stable functions**: Every exported function benefits from [stabilization](https://sheinsight.github.io/react-use/docs/optimization/stabilization) by default.
- **Latest State**: Avoids the expired closure issues by using [latest](https://sheinsight.github.io/react-use/docs/optimization/latest-state) state internally.
- **Reduced Unnecessary Rerenders**: Use [Pausable](https://sheinsight.github.io/react-use/docs/features/pausable) instance to control the behavior of some Hooks optionally.

## 🪪 License

MIT © @shined
