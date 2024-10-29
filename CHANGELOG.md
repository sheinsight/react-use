# [1.10.0](https://github.com/sheinsight/react-use/compare/v1.9.4...v1.10.0) (2024-10-29)


### Bug Fixes

* **useGeolocation:** fix TS type definition ([c39ec03](https://github.com/sheinsight/react-use/commit/c39ec03b83d84ed54e62b0d41abf26cedf900acb))
* **useKeyStroke:** fix TS type definition ([a9b1a5f](https://github.com/sheinsight/react-use/commit/a9b1a5fd907b2f1b0ba823d92b85d843038baa2f))
* **usePagingList:** fix TS type definition ([6ceb776](https://github.com/sheinsight/react-use/commit/6ceb776a36de26d18cadcf1b8e9dbfa74e8299be))


### Features

* **useForm:** deprecated `triggerOnChangeWhenReset` options ([28f9a69](https://github.com/sheinsight/react-use/commit/28f9a69919fe19fddfa308556f64ec5678fc26ca))



## [1.9.4](https://github.com/sheinsight/react-use/compare/v1.9.3...v1.9.4) (2024-10-25)


### Bug Fixes

* **useCountdown:** fix TS type definition for `DateLike` ([3615692](https://github.com/sheinsight/react-use/commit/3615692bf1a73ecc724baa0a29fd70802210f185))
* **useCounter:** fix `setState` may not controlled by `max` & `min` options ([67bb246](https://github.com/sheinsight/react-use/commit/67bb24624c4a7bd75de1568c96e8dd0d4d05a411))
* **useDropZone:** fix dataTypes may not work correctly in some cases ([4a44b4b](https://github.com/sheinsight/react-use/commit/4a44b4b8b6ff16f845e56244f104c046ff71b885))
* **useDynamicList:** fix `setList` may not work in some cases ([ef538ab](https://github.com/sheinsight/react-use/commit/ef538abe92b8ae9f4ee505fb07561e459043f0bc))
* **useFavicon:** fix TS type definition ([4998afc](https://github.com/sheinsight/react-use/commit/4998afcbc960a1953573bf0a5332931e589d05ae))



## [1.9.3](https://github.com/sheinsight/react-use/compare/v1.9.2...v1.9.3) (2024-10-23)


### Bug Fixes

* **useInfiniteScroll:** fix reset may not work as expected when frequency is too high ([c129047](https://github.com/sheinsight/react-use/commit/c1290475d9b900d5462d9914ab960b06cb08276d))



## [1.9.2](https://github.com/sheinsight/react-use/compare/v1.9.1...v1.9.2) (2024-10-22)


### Bug Fixes

* **useInfiniteScroll:** fix `loadMore` may not be called when container too large in some cases ([36e10a1](https://github.com/sheinsight/react-use/commit/36e10a170d062e88f7afc7354630768eea1af94e))
* **useQuery:** fix params update issue when data was not changed ([3497c4b](https://github.com/sheinsight/react-use/commit/3497c4b26a103c6c25a70a26059a47ebe0ec1045))
* **useQuery:** fix TS type definition for global `mutate` ([83941ab](https://github.com/sheinsight/react-use/commit/83941ab33e47d0eae87032101a2ce1e0acc988bd))


### Performance Improvements

* **useQuery:** don't cache promise when not set cacheKey ([9e0d513](https://github.com/sheinsight/react-use/commit/9e0d513a4fb29bc6bcf4b12015f21893db1e33e6))



## [1.9.1](https://github.com/sheinsight/react-use/compare/v1.9.0...v1.9.1) (2024-10-16)


### Bug Fixes

* **useAsyncFn:** fix `initialParams` may not work when `initialParams` is a function & params not update after initial call ([2ee1c2f](https://github.com/sheinsight/react-use/commit/2ee1c2f61607c88f7a63209fa2b6f5632b58ae13))
* **useAsyncFn:** fix `initialParams` not working when set ([9b5c7a1](https://github.com/sheinsight/react-use/commit/9b5c7a1dfb4e024e21ce6df83e333f8370cbe6bc))
* **useAsyncFn:** fix TS type definition error ([ccd107e](https://github.com/sheinsight/react-use/commit/ccd107e06ddf9a42c18a668610bc8b7726dd0829))
* **useInfiniteScroll:** fix `loadMore` may be called twice when first mount in some scenarios. ([319c863](https://github.com/sheinsight/react-use/commit/319c86385b73cf6ba33af6de2a97723519f31e4c))
* **useQuery:** fix `onError` params ([921f947](https://github.com/sheinsight/react-use/commit/921f947439f7a740c963f3f58cc5796465a8d50f))



# [1.9.0](https://github.com/sheinsight/react-use/compare/v1.8.0...v1.9.0) (2024-10-09)


### Bug Fixes

* **useManualStateHistory:** fix expired state action ([17b44c6](https://github.com/sheinsight/react-use/commit/17b44c63371be16e4ed9c9907018fc11119e88b3))
* **useQuery:** fix `useQuery` `errorRetryCount` default value, set to 0 ([8521206](https://github.com/sheinsight/react-use/commit/85212068ac15d106c13a1973b591403b00a28d7d))
* **useStepper:** fix expired action ([3abf4d7](https://github.com/sheinsight/react-use/commit/3abf4d70fbd65d9cd967293e0b842011b35cd5b2))
* **useThrottledEffect:** fix influence of first render on throttle, first automatic call should not call throttled callback ([2182b37](https://github.com/sheinsight/react-use/commit/2182b37e43d57c403f34c8ae37f7174a997d750a))
* **useTimeout:** fix `reset` not pause the timer ([d99734c](https://github.com/sheinsight/react-use/commit/d99734ce8cb17a0edd854ce4498eb012d3ab6fc5))
* **useUserIdle:** fix TS type definition error ([1af1476](https://github.com/sheinsight/react-use/commit/1af1476de81feb5193dd5b59cedb35570b3dd076))
* **useVersionedAction:** use object instead of counter to prevent overflow ([9229b4b](https://github.com/sheinsight/react-use/commit/9229b4b4c45dd3f9881da78e9e5d9f896d84cde2))
* **useWindowScroll:** fix maxY & maxX may be negative number ([399d32f](https://github.com/sheinsight/react-use/commit/399d32f486562cd1fb074f8121a1634a6b8c7d3d))


### Features

* **useCounter:** support native `setState` to avoid expired state ([5851637](https://github.com/sheinsight/react-use/commit/5851637cd542847a7ed9760dce81855cdf9c6743))
* **useTextDirection:** support empty string to clear attr ([a6e341a](https://github.com/sheinsight/react-use/commit/a6e341aadc7da3e491b53f873209ee559af527ae))


### Performance Improvements

* **useTimeAgo:** use `useCreation` to improve performance, avoid unnecessary re-renders ([ee9bc75](https://github.com/sheinsight/react-use/commit/ee9bc75c64eeaedeeb0db279356aef6db68a7b1c))



# [1.8.0](https://github.com/sheinsight/react-use/compare/v1.7.0...v1.8.0) (2024-09-26)


### Bug Fixes

* **useCircularList:** fix initial invalid state not fallback to fallback value ([73d6147](https://github.com/sheinsight/react-use/commit/73d614768d334621412392e9b5a313b330359a05))
* **useClonedState:** fix custom cloneFn not working ([12f4d19](https://github.com/sheinsight/react-use/commit/12f4d1915f93dbeb522eee60208f69e3fc7f52c9))
* **useCounter:** fix initial count not limited by max & min options ([882562e](https://github.com/sheinsight/react-use/commit/882562e2d60c1f6acb56a02d01c24a4c91847720))
* **useDateFormat:** fix params type definition ([5b940b2](https://github.com/sheinsight/react-use/commit/5b940b28e1c9a71eb55bdf7aaa74a96be81b0ebd))
* **useDynamicList:** fix `sort` not working as expected ([d8c548e](https://github.com/sheinsight/react-use/commit/d8c548e91ed5283e8158f560145ad78a8e6591f1))
* **useInfiniteScroll:** fix dependencies collection not working ([02a0aca](https://github.com/sheinsight/react-use/commit/02a0acaf4123c80e786e58ad5770464da492f6e5))
* **useSafeState:** fix casual incorrect update after multiple update when using `deep` option in some cases. ([c561168](https://github.com/sheinsight/react-use/commit/c561168166304994da6768180802fbdf8118da8d))
* **useWebSocket:** fix reconnect (or close retry) ([15ffdfb](https://github.com/sheinsight/react-use/commit/15ffdfbbef8640144de1c76fb30d7eedf5a482e7))


### Features

* **useRetryFn:** support `retry.cancel` method to cancel retry ([f50c472](https://github.com/sheinsight/react-use/commit/f50c472550613540e318d876a940ec485ddb5c6c))
* **useTimeAgo:** support more language messages, by passing internal `messages` to props ([9e0a1e9](https://github.com/sheinsight/react-use/commit/9e0a1e92b0de0ea4daa20043fb1e0c704f5ba4e5))
* **useUserIdle:** support dependencies collection ([b1db445](https://github.com/sheinsight/react-use/commit/b1db445a03b47b8c4c3582e3dced7a6cead3816f))


### Performance Improvements

* **useSetState:** not update state when no key is provided ([007680a](https://github.com/sheinsight/react-use/commit/007680a83f92a15cb9f42fdd5171c7dcb1032e04))



# [1.7.0](https://github.com/sheinsight/react-use/compare/v1.6.0...v1.7.0) (2024-09-11)


### Bug Fixes

* **useInfiniteScroll:** fix not loading when it has more space to scroll after first load ([c4036ca](https://github.com/sheinsight/react-use/commit/c4036cade8d9aaee1c4d3d42d199ace63abb74fe))
* **useInfiniteScroll:** use `useLatest` to avoid expired callbacks ([1e8164e](https://github.com/sheinsight/react-use/commit/1e8164e0b0a5a6379160751c2ca7b6de1a2bca67))
* **useMultiSelect:** fix returned type definition ([33dfcd6](https://github.com/sheinsight/react-use/commit/33dfcd6db21643a08c1463bb8caa1a5960841b4c))
* **useQuery:** fix internal behavior params missing bug (should run `refresh`, not `run`) ([3fbfb5e](https://github.com/sheinsight/react-use/commit/3fbfb5e4a4bc00faa8848f77ab8e418f07df3819))
* **useQuery:** fix useQuery `run` method return value when `throttle` and `debounce` are not set ([2f25b3e](https://github.com/sheinsight/react-use/commit/2f25b3ef5b69b2f2266115b22363ea80598ee866))


### Features

* add new Hook `useForm` to handle form state, both for controlled and uncontrolled forms ([44137ff](https://github.com/sheinsight/react-use/commit/44137ffac4090e94457cd195a462d058857b784f))
* add new Hook `useInfiniteList` to handle infinite list ([1538cf9](https://github.com/sheinsight/react-use/commit/1538cf9e09209f81500f15a0b796b945251301e3))
* add new Hook `usePagingList` to handle paging list ([a3b1598](https://github.com/sheinsight/react-use/commit/a3b1598daecbec22841511c63dc436571ace84af))
* add new Hook `useVersionedAction` to run versioned action ([f34bfa7](https://github.com/sheinsight/react-use/commit/f34bfa70702d31b048895c6cd6c98693eecb4f01))
* add new Hook `useWebSocket` to handle WebSocket connections ([edc568c](https://github.com/sheinsight/react-use/commit/edc568cdaf0bf075f2bab3226282daea54225434))
* rename `useProList` to `usePagingList` ([574d37f](https://github.com/sheinsight/react-use/commit/574d37f83647b6f991af822b68d894b36efee5c4))
* **useInfiniteScroll:** add `loadMore` method to load more manually & `reset` to reset, deprecated isLoading, prefer `loading` ([20d4fd8](https://github.com/sheinsight/react-use/commit/20d4fd8c61307dc11496b86738cdc42d31e42b46))
* **useInfiniteScroll:** add `reset` method to reset state & fix horizontal scroll issue ([37ddd58](https://github.com/sheinsight/react-use/commit/37ddd58a0b05e5dc93f81f416053934676f3eb78))
* **useMultiSelect:** add `unselect` and `unselectAll`, deprecated `unSelect` and `unSelectAll`. ([26142ff](https://github.com/sheinsight/react-use/commit/26142ffcefb4df615b6fba48d54211e2a0961722))
* **usePagination:** add `countStart` and `countEnd` to returns ([dcbcad9](https://github.com/sheinsight/react-use/commit/dcbcad9dec99039fd31f407bb52d240ea190808a))
* **usePagination:** add `page` and `pageSize` in returns ([c2e060c](https://github.com/sheinsight/react-use/commit/c2e060caea6ab70acccc9afb47b70c978e42af4b))



# [1.6.0](https://github.com/sheinsight/react-use/compare/v1.5.0...v1.6.0) (2024-08-29)


### Bug Fixes

* **useInfiniteScroll:** fix `isLoading` & `isLoadDone` state not update expectedly ([3ef21b9](https://github.com/sheinsight/react-use/commit/3ef21b9c5f7f8999ae2dd13e2b74d28e865f245a))
* **useQuery:** fix `refresh` not controlled by `debounce` and `throttle` options ([701c7d0](https://github.com/sheinsight/react-use/commit/701c7d0f1d4383dedeb23d04e0cf5507131fbff8))


### Features

* add exports for `package.json` ([df08736](https://github.com/sheinsight/react-use/commit/df0873616db1dcc2165f633c7b2ed89abbeb5efb))
* add new Hook `useVirtualList` to improve large list render performance, support both vertical and horizontal mode. ([429cc3c](https://github.com/sheinsight/react-use/commit/429cc3cbdb1e77867f3222eb47957fd1c5501e8c))



# [1.5.0](https://github.com/sheinsight/react-use/compare/v1.4.0...v1.5.0) (2024-08-21)


### Bug Fixes

* **useQuery:** fix global mutate params error ([3d35a3b](https://github.com/sheinsight/react-use/commit/3d35a3b4c942b00b3d826a0806c649839aa9e29f))


### Features

* add internal `useTrackedRefState` & `useVersionedAction` hooks ([783fa7c](https://github.com/sheinsight/react-use/commit/783fa7c8057dd1a8bffb6fa8102b629f5333bf48))
* add new Hook `useFirstRender` to check whether it's the first render. ([aee59cd](https://github.com/sheinsight/react-use/commit/aee59cdd0a7d0f5bc068123af8cc5d9d2facd8ed))
* **useAsyncFn:** rewrite to use auto-tracked state to improve performance ([3ec255e](https://github.com/sheinsight/react-use/commit/3ec255eb7ab3dfe902b04446679f0fdb79065193))
* **useClipboard:** enhance `legacyCopy` behavior ([bccfecb](https://github.com/sheinsight/react-use/commit/bccfecbe720b0cee99fd8192ac4edf9ead2b137f))
* **useClipboardItems:** rewrite to use auto-tracked state to improve performance ([2d91adb](https://github.com/sheinsight/react-use/commit/2d91adb23941ddafb8bcbb461890eb4b2e45558f))
* **useClipboardItems:** support `onCopy` & `onCopiedReset` callback ([0d1e70d](https://github.com/sheinsight/react-use/commit/0d1e70d4f43dff6874edc4c691524b1f19aff64d))
* **useClipboard:** rewrite to use auto-tracked state to improve performance ([5ce34da](https://github.com/sheinsight/react-use/commit/5ce34dacfc24fa18dadc6433cfd8476866efdcc9))
* **useClipboard:** support `onCopy` & `onCopiedReset` callback ([3871844](https://github.com/sheinsight/react-use/commit/3871844f3ce88dd8c17a2094a54838b21ff3be1a))
* **useLatest:** reduce unnecessary  assignment ([3cad80a](https://github.com/sheinsight/react-use/commit/3cad80a7ed95588aedc0da152d3f632bebee16a2))
* **useLoadingSlowFn:** rewrite to use auto-tracked state to improve performance ([972264a](https://github.com/sheinsight/react-use/commit/972264ac8b1905197d70f9d0713d58c8864e724c))
* **usePagination:** support return sliced list directly (pass `list` in options), add `indexStart`, `indexEnd` in returns ([2ed32ff](https://github.com/sheinsight/react-use/commit/2ed32ffbf400d6156aea458c5da027f0e7d0c002))
* **usePerformance:** support `entryTypes` check ([d9f39e4](https://github.com/sheinsight/react-use/commit/d9f39e462ab5248f4770f19d59de8633e9d5b489))
* **usePrevious:** support `deep` option to deep compare previous state ([204b4b6](https://github.com/sheinsight/react-use/commit/204b4b6c35d74d7f04fc5aa845111af6701b233f))
* **useQuery:** add new Hook `useQuery` renamed from `useRequest` ([11f65e7](https://github.com/sheinsight/react-use/commit/11f65e780622ec1dae662ec48d3a0ead5a577101))
* **useQuery:** rewrite to use auto-tracked state to improve performance ([72adce9](https://github.com/sheinsight/react-use/commit/72adce9c2909d1e7a228a674d5423c9b76a430b4))
* **useQuery:** support `onErrorRetryFailed` option ([357e77a](https://github.com/sheinsight/react-use/commit/357e77ac9f5829932d57c662a296b2f19b1e834a))
* **useRequest:** deprecated `useRequest`, please use `useQuery` instead. ([26c516c](https://github.com/sheinsight/react-use/commit/26c516c2ac5b3e44bb06b71b48dab0a5772f39fd))
* **useWebObserver:** support additional `supported` check for specific observer ([d30a906](https://github.com/sheinsight/react-use/commit/d30a906add884d1a5dac8881bfe826aac27b7ae3))



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



