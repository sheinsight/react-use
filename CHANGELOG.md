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



