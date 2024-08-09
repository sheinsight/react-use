# [1.4.0](https://github.com/sheinsight/react-use/compare/v1.3.0...v1.4.0) (2024-08-09)


### Bug Fixes

* **useAsyncFn:** fix race condition bug ([9071e38](https://github.com/sheinsight/react-use/commit/9071e385075e0a10706420a9826e82e62dbf67b7))
* **useResetState:** fix returned `initialValue` ([5e1288f](https://github.com/sheinsight/react-use/commit/5e1288f6a62d4329053d0608fdeac653703fcf10))
* **useToggle:** fix hook returned value ([dd976b9](https://github.com/sheinsight/react-use/commit/dd976b956dadb7f662a0b702a44a8903630bf66c))


### Features

* add new Hook `useInputComposition` to track composition state of `input` element ([5be4b66](https://github.com/sheinsight/react-use/commit/5be4b66bb4562903c5ceb5c2b5d9b5cd7aaeaadf))
* **createSingleLoading:** deprecated, it will be removed in the future, maybe moved to `@shined/reactive` ([8b479c7](https://github.com/sheinsight/react-use/commit/8b479c7a51f66f2d92673eeade3bd611fb591c35))
* new Hook `useLoadingSlowFn` to track loading slow state ([732fa3f](https://github.com/sheinsight/react-use/commit/732fa3f58178038bec1bb560b3b8ca3b87fb9c46))
* new Hook `useReConnect` to run a callback when re-connect ([772aba0](https://github.com/sheinsight/react-use/commit/772aba0cc688dc3278d153b0c9e9933a062a39ab))
* new Hook `useReFocus` to run a callback when re-focus ([88cc9f2](https://github.com/sheinsight/react-use/commit/88cc9f2d87ea5c3ecdbee47c4057955142729aba))
* new Hook `useRetryFn` to create a function with retry mechanism ([2ecebc0](https://github.com/sheinsight/react-use/commit/2ecebc08d3e803d834a229a56c1d1c38067930a7))
* **useAsyncFn:** `mutate` & `refresh` support params ([02ff03d](https://github.com/sheinsight/react-use/commit/02ff03d8de6da5aa1f135b18947d406e06995286))
* **useAsyncFn:** support `compare` options to control render behavior ([dfed260](https://github.com/sheinsight/react-use/commit/dfed260ac2151af40f6b74a4ae76785e9c99d981))
* **useAsyncFn:** support `onError` callback ([072f0cf](https://github.com/sheinsight/react-use/commit/072f0cfa45dfba75a71e324cc51224a881665e1a))
* **useAsyncFn:** support lifecycle callbacks & improve render performance ([fe1b821](https://github.com/sheinsight/react-use/commit/fe1b821dbce3ba26c6538631b5d99e5288c2186c))
* **useAsync:** support `onMutate`, `onCancel`, `onRefresh` callbacks ([a129849](https://github.com/sheinsight/react-use/commit/a129849aedae493a477467ab1722edb01740875c))
* **useReactive:** deprecated, it will be removed in the future, maybe moved to `@shined/reactive` ([03ac5d9](https://github.com/sheinsight/react-use/commit/03ac5d90345352340d07f03f1fcfe56770e533c5))


### Performance Improvements

* **useLoadingSlowFn:**  using getter to refine performance ([31a59ca](https://github.com/sheinsight/react-use/commit/31a59ca6ad01bae045e9e22e04c518ace4d4c3f4))



# [1.3.0](https://github.com/sheinsight/react-use/compare/v1.2.1...v1.3.0) (2024-07-15)


### Features

* new hook `useBoolean` ([5e4f003](https://github.com/sheinsight/react-use/commit/5e4f003aaf4dd2bcd37402a1e24e816da2b48043))



## [1.2.1](https://github.com/sheinsight/react-use/compare/v1.2.0...v1.2.1) (2024-07-10)


### Bug Fixes

* use `useMount` to improve performance ([0237634](https://github.com/sheinsight/react-use/commit/023763484e0cefbe09cf7cdb547f7c28a90c9c49))
* **useUrlSearchParams:** fix wrong Hook usage ([6efb038](https://github.com/sheinsight/react-use/commit/6efb0381dbc5d46262cf0a22ae82a0304697a5ac))



# [1.2.0](https://github.com/sheinsight/react-use/compare/v1.1.4...v1.2.0) (2024-07-10)


### Bug Fixes

* **useActiveElement:** use `useLayoutMount` to prevent layout jitter ([f8e2597](https://github.com/sheinsight/react-use/commit/f8e2597d9a906ceb047f06eb58cc7e0324125021))
* **useBreakpoints:** use `useDeepCompareLayoutEffect` to prevent layout jitter ([5a58843](https://github.com/sheinsight/react-use/commit/5a5884347fde156bbde5bdcdc531dfe94f8fc977))
* **useCssVar:** use `useLayoutMount` to prevent layout jitter ([7935a16](https://github.com/sheinsight/react-use/commit/7935a16595e618f1122c9790405d718233797217))
* **useFavicon:** use `useLayoutMount` to prevent layout jitter ([d0c8233](https://github.com/sheinsight/react-use/commit/d0c8233dfad8e5bbcb202813de6ad4e51ff48a4d))
* **useFocus:** use `useLayoutMount` to prevent layout jitter ([f295032](https://github.com/sheinsight/react-use/commit/f295032745b1c374a922df9be25d13217262bf92))
* **useMediaQuery:** use `useDeepCompareLayoutEffect` to prevent layout jitter ([11f164f](https://github.com/sheinsight/react-use/commit/11f164f4f4755b951e7fc28302aee5f1f79cce5d))
* **useNetwork:** use `useIsomorphicLayoutEffect` to prevent layout jitter ([04255e7](https://github.com/sheinsight/react-use/commit/04255e7f4c59db9ca61e62dc57f4e1d34d6413c1))
* **useSupported:** use `useIsomorphicLayoutEffect` to prevent layout jitter ([b53787a](https://github.com/sheinsight/react-use/commit/b53787a1933c6de602ee67cb281ffc3950ffea60))
* **useTextDirection:** use `useLayoutMount` to prevent layout jitter ([fc4743e](https://github.com/sheinsight/react-use/commit/fc4743efb1b0caa2ec32840ffcf40b211e9b3600))
* **useUrlSearchParams:** use `useLayoutMount` to prevent layout jitter ([584d1f8](https://github.com/sheinsight/react-use/commit/584d1f88de5e686707399889093637037d8da6e8))
* **useWindowFocus:** use `useLayoutMount` to prevent layout jitter ([273e959](https://github.com/sheinsight/react-use/commit/273e959b992f7b5ea392285066e9b520be1e9920))
* **useWindowScroll:** use `useLayoutMount` to prevent layout jitter ([d136b2d](https://github.com/sheinsight/react-use/commit/d136b2d80c00b27403fcde4d481f748917cb5e5d))
* **useWindowSize:** use `useLayoutMount` to prevent layout jitter ([c1d0b90](https://github.com/sheinsight/react-use/commit/c1d0b90867e6b154234bc7376a96e4d35509c35c))


### Features

* **useLayoutMount:** add `useLayoutMount` Hook ([25bb07f](https://github.com/sheinsight/react-use/commit/25bb07f4b45546a440d9850cbc6ead53fb838642))



## [1.1.4](https://github.com/sheinsight/react-use/compare/v1.1.3...v1.1.4) (2024-07-09)


### Bug Fixes

* **useControlledComponent:** fix  TS generic type error ([7292a1b](https://github.com/sheinsight/react-use/commit/7292a1b4feedf7656a0192b86f6c92b8925f5201))



## [1.1.3](https://github.com/sheinsight/react-use/compare/v1.1.2...v1.1.3) (2024-07-03)


### Bug Fixes

* **useInfiniteScroll:** fix `onScroll` event not being triggered when target scroll ([73a9c98](https://github.com/sheinsight/react-use/commit/73a9c98ac87caf52e092ca09a9b239f578de5572))
* **useParallax:** remove unused options. ([10f6b77](https://github.com/sheinsight/react-use/commit/10f6b77f62933213396e3368e361af16136ba576))
* **useTargetElement:** advance the reffable value resolve time in target element ([e376649](https://github.com/sheinsight/react-use/commit/e376649a580ee39dd25f29566e3897f315e7dd70))
* **useTitle:** correct unify type name ([19338b9](https://github.com/sheinsight/react-use/commit/19338b9324b8b5851d0d20ae0dd3c5515985e80f))



## [1.1.2](https://github.com/sheinsight/react-use/compare/v1.1.1...v1.1.2) (2024-07-02)


### Bug Fixes

* **createSingleLoading, useReactive:** use `create` option to avoid import and ESM require error ([2b8548c](https://github.com/sheinsight/react-use/commit/2b8548cab08faef45a3c9bcc2cad537c2f9dd090))



## [1.1.1](https://github.com/sheinsight/react-use/compare/v1.1.0...v1.1.1) (2024-07-02)


### Bug Fixes

* **useReactive, createSingleLoading:** use require to dynamic import to avoid no dep error ([fc9d1ee](https://github.com/sheinsight/react-use/commit/fc9d1ee42057a924b618a69bfaa337c7662f3dd8))



# [1.1.0](https://github.com/sheinsight/react-use/compare/v1.0.2...v1.1.0) (2024-07-02)


### Bug Fixes

* **useEventListener:** should re-add-and-remove event when `ref.current` changed ([6ffdc9d](https://github.com/sheinsight/react-use/commit/6ffdc9d9549aa4266b10b38b317742af672291e1))
* **useUrlSearchParams:** fix type import ([2fc0366](https://github.com/sheinsight/react-use/commit/2fc0366e0ffab593a13f300a21faa20d156249cc))


### Features

* **useDynamicList:** add `setList` method in return actions ([0eff4b4](https://github.com/sheinsight/react-use/commit/0eff4b4a4743909ba444a653f093c16ad2e913db))



## [1.0.2](https://github.com/sheinsight/react-use/compare/v1.0.1...v1.0.2) (2024-06-26)


### Bug Fixes

* use union TS type name ([8ac5221](https://github.com/sheinsight/react-use/commit/8ac5221a7557a48c26794308ec6dfb8e7479e0a7))
* **useCircularList:** use uniform type name ([777f851](https://github.com/sheinsight/react-use/commit/777f851217fb330d72496fc32229bfe201e0db5c))


### Performance Improvements

* make TS type more strict (add `readonly` to tuple returns) ([d5dda51](https://github.com/sheinsight/react-use/commit/d5dda51b5d24a07130912f4ba26cda8be032dfb7))



## [1.0.1](https://github.com/sheinsight/react-use/compare/v1.0.0...v1.0.1) (2024-06-25)


### Bug Fixes

* **useAsyncEffect:** fix `isCancelled` method in callback arguments. ([07d3aa4](https://github.com/sheinsight/react-use/commit/07d3aa4458bfc5c359850e84ad6737bda9b0e9e8))



# [1.0.0](https://github.com/sheinsight/react-use/compare/v1.0.0-alpha.4...v1.0.0) (2024-06-25)



# [1.0.0-alpha.4](https://github.com/sheinsight/react-use/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2024-06-24)


### Bug Fixes

* fix debounce ([cfb347c](https://github.com/sheinsight/react-use/commit/cfb347c4ac97d7829f46eff352bb8a92c8405b28))
* fix read in useClipboard ([30f6155](https://github.com/sheinsight/react-use/commit/30f6155a185649442bc3c192dde3418ee6a50369))
* fix use toggle & modify docs ([5da2539](https://github.com/sheinsight/react-use/commit/5da253931c716ddba35f0a78c5e9fc0c0388b7b2))
* use global method ([031b643](https://github.com/sheinsight/react-use/commit/031b6430e63987ed28d2b8f0320079b828710b4b))



# [1.0.0-alpha.3](https://github.com/sheinsight/react-use/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2024-06-21)



# [1.0.0-alpha.2](https://github.com/sheinsight/react-use/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2024-06-21)



# [1.0.0-alpha.1](https://github.com/sheinsight/react-use/compare/e1e3f6386cfcbd212809069f756778a16415ccd3...v1.0.0-alpha.1) (2024-06-21)


### Bug Fixes

* fix baseUrl ([e1e3f63](https://github.com/sheinsight/react-use/commit/e1e3f6386cfcbd212809069f756778a16415ccd3))
* fix baseUrl & link error ([f7416bf](https://github.com/sheinsight/react-use/commit/f7416bf20d4837bd2277261a653547d5e156f0e4))
* fix circular import dependencies ([7d29fc2](https://github.com/sheinsight/react-use/commit/7d29fc2ee4ff021b865157bc0205ff0dc2e07f4e))
* fix element bounding ([8b44742](https://github.com/sheinsight/react-use/commit/8b447424abd7c84a4edfc613410872bbc6f389d0))
* fix extension ([c2401ed](https://github.com/sheinsight/react-use/commit/c2401ed76308a85fe656bdb92fbc136f6f907bf7))
* fix import path ([ad0aa52](https://github.com/sheinsight/react-use/commit/ad0aa52f0fa3cf2e34806e24a368c7fea113fdee))
* fix SSR error ([857efcd](https://github.com/sheinsight/react-use/commit/857efcd54a49e30344601555f6cb7d0c9cf79c4b))
* fix ssr match error ([0283d1e](https://github.com/sheinsight/react-use/commit/0283d1e878205b777cee667d68e64ca24d5d7cef))
* fix use key stroke once ([306fc27](https://github.com/sheinsight/react-use/commit/306fc27a1011fa11706c2a5b576e2b13da495cd4))
* fix useCssVar ([c7b7e5e](https://github.com/sheinsight/react-use/commit/c7b7e5ed88a7a851a7665ed3111ce2bd5a32388a))
* fix useFavicon return ([8dceea6](https://github.com/sheinsight/react-use/commit/8dceea6cabc637566e04a63da223ea04000374d0))
* lint code & fix SSR issue with useFps ([6767a32](https://github.com/sheinsight/react-use/commit/6767a32072891b7d0a7096d00e77dce85507b2ce))


### Features

* add unicode symbol format mode ([4afbb08](https://github.com/sheinsight/react-use/commit/4afbb08e8dc2ac6bcb53e63d92cbc9dfd2e110fd))
* return `restore` in useTitle ([fbdabd2](https://github.com/sheinsight/react-use/commit/fbdabd2cd3533318014cdc198af3adfd5e1b3e7e))
* support restoreOnUnmount in useFavicon ([9381e77](https://github.com/sheinsight/react-use/commit/9381e77dc691bd0d86d1bc60acd8974f89646793))
* **useTitle:** support gettable title in SSR ([16c9d5a](https://github.com/sheinsight/react-use/commit/16c9d5ae5b5002bed2f2a36874018b1f45a31a91))



