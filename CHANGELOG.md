# [2.0.0](https://github.com/rebelstackio/pgfilter/compare/v1.5.0...v2.0.0) (2023-10-15)


### Bug Fixes

* fix integration tests ([4af22df](https://github.com/rebelstackio/pgfilter/commit/4af22df3155b115891cb313d2f22beb19da2d8ea))
* lint issue ([1b26b33](https://github.com/rebelstackio/pgfilter/commit/1b26b331b35ae520efd43c85de499537309a7b5a))


### Code Refactoring

* remove support for node 16 ([ad2d890](https://github.com/rebelstackio/pgfilter/commit/ad2d8909eb15006a54acf5c4124331ec1c3152d5))
* update dependecies ([4d37c50](https://github.com/rebelstackio/pgfilter/commit/4d37c5092d2ee43fe6aa920c591aa595e2557f52))


### BREAKING CHANGES

* Update @faker-js@faker to 8.1.0
* add support for node 18 and fix all the dependecies issues

# [1.5.0](https://github.com/rebelstackio/pgfilter/compare/v1.4.0...v1.5.0) (2022-08-31)


### Features

* **filter:** allow more duration expression on filter function ([1c8363f](https://github.com/rebelstackio/pgfilter/commit/1c8363f16f18179e698324aacd5730c795962e10))

# [1.4.0](https://github.com/rebelstackio/pgfilter/compare/v1.3.1...v1.4.0) (2022-08-17)


### Bug Fixes

* **cli:** fix buffer argument validation ([10cb284](https://github.com/rebelstackio/pgfilter/commit/10cb284be1d35a1cf56583100d5bded1fde09dcb))


### Features

* **test:** add more testing tool and fix common errors ([b2241d9](https://github.com/rebelstackio/pgfilter/commit/b2241d9358604e86c254bb38abaf9f4009fcbb15))

## [1.3.1](https://github.com/rebelstackio/pgfilter/compare/v1.3.0...v1.3.1) (2022-08-09)


### Bug Fixes

* **husky:** fail silently husky installation ([a0df2aa](https://github.com/rebelstackio/pgfilter/commit/a0df2aaf3fd6c6068210f15f8df7f745c303fe88))

# [1.3.0](https://github.com/rebelstackio/pgfilter/compare/v1.2.2...v1.3.0) (2022-08-09)


### Bug Fixes

* **ci:** try avoid husky reject the commit from semantic-release ([fc17ded](https://github.com/rebelstackio/pgfilter/commit/fc17ded90fc6c29b59f2854a6a4deb0baf5962e0))
* **vagrant:** fix test database provision ([44ebc6d](https://github.com/rebelstackio/pgfilter/commit/44ebc6d7bfe46140b4b27c8710e4d84216932b04))
* **vagrant:** fix vagrant provision script ([250af84](https://github.com/rebelstackio/pgfilter/commit/250af84f80bb0e4a693e35e0b79a8d686639119e))


### Features

* **dependecies:** upgrade faker, yargs and eslint and adjust code based on faker breaking changes ([2daab72](https://github.com/rebelstackio/pgfilter/commit/2daab7281736ab575ccf004011da65d0f4bfd448))
* **lint:** add husky to enforce commit message format ([7b44711](https://github.com/rebelstackio/pgfilter/commit/7b447114181f6fb9928d31b53b1b1f6c3872d0f2))

## [1.2.2](https://github.com/rebelstackio/pgfilter/compare/v1.2.1...v1.2.2) (2022-06-16)


### Bug Fixes

* **dependecies:** Fix npm audit warnings ([c6515bc](https://github.com/rebelstackio/pgfilter/commit/c6515bc3ceea2984edcdcf2181464995660a1501))

## [1.2.1](https://github.com/rebelstackio/pgfilter/compare/v1.2.0...v1.2.1) (2022-04-14)


### Bug Fixes

* **dependecies:** Remove npm audit warning ([633533d](https://github.com/rebelstackio/pgfilter/commit/633533d02c399ed0c0b29313facdaf498884d04e))
* **tests:** Fix unit tests ([f35d91e](https://github.com/rebelstackio/pgfilter/commit/f35d91e8596be16ca97cb14d8bf4c1503e7dfed4))
* **typos:** Rename variable and fix several typos in the docs ([d2ad1a8](https://github.com/rebelstackio/pgfilter/commit/d2ad1a8acd9933e3778c8066952f64b7b7ab1e91))

# [1.2.0](https://github.com/rebelstackio/pgfilter/compare/v1.1.2...v1.2.0) (2022-02-21)


### Bug Fixes

* **docs:** Fix typos ([9c13472](https://github.com/rebelstackio/pgfilter/commit/9c134720820f24bfcdf1ab093c8bb269b3706de6))
* **docs:** Remove tabs from on usage entry ([614689d](https://github.com/rebelstackio/pgfilter/commit/614689dce5402cd5c776d4f8b33b66a25f37082c))
* **provision:** Fix provision script for vagrant env ([8d2f968](https://github.com/rebelstackio/pgfilter/commit/8d2f968e81b66dfcabe26e284271e3b54d197c40))


### Features

* **docker:** Add docker file to allow test the CLI on no-node envs ([5560183](https://github.com/rebelstackio/pgfilter/commit/5560183ea01def413cfa4524233933d506b958cf))
* **docker:** Add initial dockefile to allow test the CLI on no-node envs ([258e3c7](https://github.com/rebelstackio/pgfilter/commit/258e3c7f4e49ca7ae0dc7066f9916808ccf44907))
* **docs:** Remove steps section ([a345408](https://github.com/rebelstackio/pgfilter/commit/a345408bf6f8168a2cb0b8265db27cca6702e9b0))
* **docs:** Update docs ([0d0e0cf](https://github.com/rebelstackio/pgfilter/commit/0d0e0cfd0555f57383f6af04ec3da571fc767e13))
* **structure:** Remove src folder and move funciton under lib ([00446b9](https://github.com/rebelstackio/pgfilter/commit/00446b99b38ae32457527baa5ebf85e3d4b055c6))
* **test:**  Create a schema file ([63480e7](https://github.com/rebelstackio/pgfilter/commit/63480e7e3f0df36ef08598bcceaa5aa346541998))
* **test:** Add pganonymize pip packages for comparison ([9f2d5cd](https://github.com/rebelstackio/pgfilter/commit/9f2d5cd4d89db57289e34731eade56024445f304))

## [1.1.2](https://github.com/rebelstackio/pgfilter/compare/v1.1.1...v1.1.2) (2022-01-26)


### Bug Fixes

* **build:** Remove useless npm packages and reduce npm package size ([cacf413](https://github.com/rebelstackio/pgfilter/commit/cacf41312a8d465e794dc0bb52421fe32568b594))

## [1.1.1](https://github.com/rebelstackio/pgfilter/compare/v1.1.0...v1.1.1) (2022-01-25)


### Bug Fixes

* **build:** Fix typo on build ([2388ed4](https://github.com/rebelstackio/pgfilter/commit/2388ed472576ea610e0e5cde79c3150addf9e7eb))
* **build:** Use a different token ([8437b2d](https://github.com/rebelstackio/pgfilter/commit/8437b2df67634685bb5334140c0793983287a87b))
* **build:** Use a generated token instead ([9f685fa](https://github.com/rebelstackio/pgfilter/commit/9f685fa280c56a2e6fcd25f4b9320d06b0830ab7))
* **build:** Use correct token and give correct permissions ([bdabdd9](https://github.com/rebelstackio/pgfilter/commit/bdabdd98ab3de6b30461f60d0ff5484908ac4d8e))
* **githubactions:** Fix workflow and add custom config file file for semantic-releases ([e932c0b](https://github.com/rebelstackio/pgfilter/commit/e932c0ba3b4b189ea9b4a05d15f13de27a1e27d3))
* **githubactions:** Fix workflow and use environment ([08cacb6](https://github.com/rebelstackio/pgfilter/commit/08cacb6aa9b84f926dc1ceba0335a916be574c32))
* **semantic-release:** Fix release.config.js file ([6adc183](https://github.com/rebelstackio/pgfilter/commit/6adc183540fc192c301ed28f916f39d7629b1dce))
* **semantic-release:** Fix semantic-release config ([ddddd6f](https://github.com/rebelstackio/pgfilter/commit/ddddd6ffb12de83c909dc883ccad2e8007189566))
* **semantic-releases:** Try using personal token ([feb89cb](https://github.com/rebelstackio/pgfilter/commit/feb89cb7b993400b9eb5bc40846d1b9c216d9f44))
* **semantic-releases:** Use persist-credentials property on checkout ([fcd4b30](https://github.com/rebelstackio/pgfilter/commit/fcd4b30ebce1380df3a0e2074077899f85aa41c0))
