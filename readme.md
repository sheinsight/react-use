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
  <a href="https://pkg-size.dev/@shined/react-use"><img src="https://pkg-size.dev/badge/bundle/125650"></a>
<p>

<p align="center">
 <a href="https://sheinsight.github.io/react-use">Documentation</a> | <a href="https://sheinsight.github.io/react-use/docs/get-started">Get Started</a> | <a href="https://sheinsight.github.io/react-use/reference">Reference</a>
</p>
<p align="center">
<a href="https://sheinsight.github.io/react-use/zh-cn/">中文文档</a>
</p>

<br>

## 🎉 Introduction


`@shined/react-use` aims to **reshape the new programming paradigm of React development**. It enhances development efficiency, fosters better programming habits, and reduces the reliance on `useEffect` and `useState` by offering a multitude of high-quality, semantic Hooks. It encourages developers to gradually adapt to a React development (programming) paradigm that prioritizes '**Hooks first**'.

Fundamentally, it's a **SSR (Server-Side Rendering) friendly**, **comprehensive**, and **highly optimized** React Hooks library that provides flexible and efficient Hook solutions, entirely developed in **TypeScript**, and comes with interactive documentation filled with rich examples 🔥.

It's primarily inspired by [VueUse](https://vueuse.org/), while also drawing from [react-use](https://github.com/streamich/react-use), [ahooks](https://ahooks.js.org/), and many other outstanding libraries within the community. Special thanks to the open-source community, especially the authors of the aforementioned libraries, for their exceptional work and inspiration.


## 🚀 Features

- **Flexibility**: [Dependencies Collection](https://sheinsight.github.io/react-use/docs/features/dependencies-collection), [ElementTarget](https://sheinsight.github.io/react-use/docs/features/element-target), [Ref Getter](https://sheinsight.github.io/react-use/docs/features/ref-getter), [Pausable](https://sheinsight.github.io/react-use/docs/features/pausable), and [more](https://sheinsight.github.io/react-use/docs/introduction#features).
- **Tree-shakable**: Designed and delivered with [ESM](https://nodejs.org/api/esm.html), import only what you need.
- **Interactive Documentation**: Interactive documentation with live examples and [Playground](https://react-online.vercel.app/#code=eNqNk02P0zAQhu%2F5FUMvSaS6aVdFWq2aClhx4AAHTiDEIbEnbYQ%2FItthE6L8d6ZJ191PaS%2F22H7nmfGMXavGWA8DcIuFx%2B%2FGeBihskZBTDvcM2FUxmWN2sdRULcOvxoalifr1rTaow1%2BH9yx1iiy2Z8EcRRVrea%2BNho%2BNk2SwhABcKPdidUtoSffPECTNJz%2B4if2EghEzu73rDoHTNZpREqLvrUaEjIBdqL%2BC1wWzn0rFObxHataKaEy2jNltIGDrQU0suDIKISnazFOA9p4PwFeQrxfr5sOPHb32tm%2B6mRweu6mSLCO98%2BKsctI%2BLrbRN52cg5RqJKiqZ5dx%2FsfNzB04xJ%2B0tyPTzFl673RYU0FDMyFpXoJFFAaKwg3T8wZSaU4L%2BZATce20PTsavEAZPStrPmffKC%2B5fv7VqxqzZNNOgbhJReAqUGU5tS9i2SXzVmGSj%2B8w5NCLO7Yhop%2BZI5eJmooD3OO2fYaipJybz3CP7ZZgPO9xHwYQGJFQTtgsIFxhOx18pl5nEK8gexNc0OP9DE4ZJ9GYxRd%2Fk8iDG8VvZPVAf1niSfzU%2F9FJLGl0zh9l64sUj9ssqPPQLQ0%2Bg%2BbPxib).
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
