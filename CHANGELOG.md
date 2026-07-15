# [0.12.0](https://github.com/frank3ling/brick-relic/compare/v0.11.2...v0.12.0) (2026-07-15)


### Features

* **design:** apply BrickRelic visual design v1.0 across UI ([1c635d0](https://github.com/frank3ling/brick-relic/commit/1c635d03f5c7565cebdcca0179fdbdd3cf4d4041))

## [0.11.2](https://github.com/frank3ling/brick-relic/compare/v0.11.1...v0.11.2) (2026-07-15)


### Bug Fixes

* **layout:** prevent app-container from stretching on horizontal list overflow ([d2a69a3](https://github.com/frank3ling/brick-relic/commit/d2a69a36b37275f7c0e47b6f1131c09f9463771f))

## [0.11.1](https://github.com/frank3ling/brick-relic/compare/v0.11.0...v0.11.1) (2026-07-15)


### Bug Fixes

* **relics:** correct back button navigation in digmode to return to scanner ([185fec9](https://github.com/frank3ling/brick-relic/commit/185fec964700a9e15000e0bc4d53ffc45290c30c))
* **relics:** resolve svelte state array mutation reactivity issue and remove unused scan button from digmode header ([e963c0e](https://github.com/frank3ling/brick-relic/commit/e963c0eb79268351e0efdaa66e1d0695a2888c80))

# [0.11.0](https://github.com/frank3ling/brick-relic/compare/v0.10.0...v0.11.0) (2026-07-15)


### Features

* **relics:** decommission bookmark and saved relics feature ([18a1fe7](https://github.com/frank3ling/brick-relic/commit/18a1fe7375cea30523bd63a48fc17cce41e47e89))

# [0.10.0](https://github.com/frank3ling/brick-relic/compare/v0.9.0...v0.10.0) (2026-07-15)


### Features

* **bookmark:** implement localStorage bookmarking, resume dig site grid, and active target pinning ([3526342](https://github.com/frank3ling/brick-relic/commit/3526342966f664d53d521894716f52490b586614))
* **bookmark:** support bookmarkList navigation source routing and resume states ([fbab744](https://github.com/frank3ling/brick-relic/commit/fbab74401165a4f51196a601c9fdcc73dc6f5f57))

# [0.9.0](https://github.com/frank3ling/brick-relic/compare/v0.8.0...v0.9.0) (2026-07-15)


### Features

* **detail:** remove external links and lock scanned items shelf height to prevent scrollbar layout shifts ([fdf2b40](https://github.com/frank3ling/brick-relic/commit/fdf2b40120eb970e63640ab35e297612c616e8cf))

# [0.8.0](https://github.com/frank3ling/brick-relic/compare/v0.7.1...v0.8.0) (2026-07-15)


### Features

* **detail:** unify detail header, enlarge set image, and add external links to BrickLink and Rebrickable ([b9c9757](https://github.com/frank3ling/brick-relic/commit/b9c975740f8e034a41cbbccef390708f45c91078))

## [0.7.1](https://github.com/frank3ling/brick-relic/compare/v0.7.0...v0.7.1) (2026-07-15)


### Bug Fixes

* **ui:** revert app-container fixed height to min-height to prevent vertical clipping layout break ([8285039](https://github.com/frank3ling/brick-relic/commit/82850398b218996f915d75fa2983de45da5ffee2))

# [0.7.0](https://github.com/frank3ling/brick-relic/compare/v0.6.2...v0.7.0) (2026-07-15)


### Features

* **detail:** optimize detail view part image size and adapt terminology to relic hunt context ([c918e9a](https://github.com/frank3ling/brick-relic/commit/c918e9a311a5f18ff55a6de349f058853842cab8))

## [0.6.2](https://github.com/frank3ling/brick-relic/compare/v0.6.1...v0.6.2) (2026-07-15)


### Bug Fixes

* **ui:** hide horizontal scrollbar and constrain app-container to 100dvh ([15adcab](https://github.com/frank3ling/brick-relic/commit/15adcab68405c4d0dc2e7a7fd27affaf52641f3a))

## [0.6.1](https://github.com/frank3ling/brick-relic/compare/v0.6.0...v0.6.1) (2026-07-15)


### Bug Fixes

* **ui:** prevent horizontal flex stretch on shelf and fix delete button scroll bounds ([020e6fa](https://github.com/frank3ling/brick-relic/commit/020e6faad905dd7a7ebef38b4d34ff41fda44b3b))

# [0.6.0](https://github.com/frank3ling/brick-relic/compare/v0.5.0...v0.6.0) (2026-07-15)


### Bug Fixes

* **color:** correct color resolution lookup in camera viewfinder and wrap in reactive key catalogReady blocks ([d0d3491](https://github.com/frank3ling/brick-relic/commit/d0d3491bc91bcacb96c6e0c02f394d5ced8c22bd))


### Features

* **color:** connect camera analyzer to full 275+ colors catalog and optimize mobile layouts ([c93a0c2](https://github.com/frank3ling/brick-relic/commit/c93a0c2e58abb96cd1770380b0593d60a1ff2cb1))


### Performance Improvements

* **color:** load colors.json separately to prevent camera analyzer blocking on large datasets ([3a2a3d7](https://github.com/frank3ling/brick-relic/commit/3a2a3d7111011a6b53c18e522990c5a7392555f0))

# [0.5.0](https://github.com/frank3ling/brick-relic/compare/v0.4.0...v0.5.0) (2026-07-15)


### Features

* **ui:** remove log scan, remove stop camera HUD, and optimize color legend alignment ([38a99f1](https://github.com/frank3ling/brick-relic/commit/38a99f1e46ee80e0765da7e7fb181019481e2734))

# [0.4.0](https://github.com/frank3ling/brick-relic/compare/v0.3.0...v0.4.0) (2026-07-15)


### Features

* **desktop:** support webcam scanning via mouse click and spacebar shortcut ([8c1a035](https://github.com/frank3ling/brick-relic/commit/8c1a03543c95df92ee92b35a6aa9696f1a08bb0f))
* **ui:** rename Set Radar to Relic Radar, simplify headers, and remove compass icon ([7df2773](https://github.com/frank3ling/brick-relic/commit/7df27738614d3b40a3c20f1a2071a9dee9e8b2e6))

# [0.3.0](https://github.com/frank3ling/brick-relic/compare/v0.2.9...v0.3.0) (2026-07-15)


### Bug Fixes

* **api:** change topMatches limit to 3 to match UI display ([85ed64f](https://github.com/frank3ling/brick-relic/commit/85ed64f94a848fb7ccfb41b827cef0039b430f16))
* **build:** resolve Rolldown missing export build error and align specifications ([c3e7889](https://github.com/frank3ling/brick-relic/commit/c3e7889f75058b518b8ded564e3eceabfd4b496b))
* **ci:** correct node-version parameter typo in ci workflow ([31e665c](https://github.com/frank3ling/brick-relic/commit/31e665c8d50e9ab3defab6683e43aca4e1355c6c))
* **middleware:** remove unused catch parameter ([3ef9b93](https://github.com/frank3ling/brick-relic/commit/3ef9b939ef1dc47ea05386003d352972a2679d49))
* **vercel:** export middleware function as default export ([5aa9ee9](https://github.com/frank3ling/brick-relic/commit/5aa9ee95e21a54eab9555f9395ec1de6fc5f68ba))


### Features

* **ci:** add checkout step to close-prs workflow ([e5ed98b](https://github.com/frank3ling/brick-relic/commit/e5ed98be2efaf12e65cc3e5079a7ea62755356cd))
* **ci:** add workflow to auto-close external pull requests ([40dc0c4](https://github.com/frank3ling/brick-relic/commit/40dc0c4aa56b2b12dd65a5240c21f16b3eda4e24))
* **ci:** bypass checkout on private repo in close-prs workflow ([69ca706](https://github.com/frank3ling/brick-relic/commit/69ca706614006afccf6ea75f54c5e346c593c9d0))
* **ci:** configure write permissions and use native gh cli in auto-close workflow ([6d9678c](https://github.com/frank3ling/brick-relic/commit/6d9678cfb8e48e8024cd0aa53397e80da5defa40))
* **logo:** implement stylized excavation brush logo and typography ([dc16be6](https://github.com/frank3ling/brick-relic/commit/dc16be6a8bb96f86e1614498e56743758c3e2c05))
* **logo:** restore compass logo in app and update static README logo to match ([c3370b5](https://github.com/frank3ling/brick-relic/commit/c3370b5a654ae001051e462574939007bf42e0a6))
* **logo:** update favicon to match the new compass logo branding ([ffcc244](https://github.com/frank3ling/brick-relic/commit/ffcc24495ea6c89bbbc26d6a8a5c3a2bf7641e5d))
* **offline:** migrate database catalog and matching engine to browser ([e2f1d35](https://github.com/frank3ling/brick-relic/commit/e2f1d35b3e9a7eadfadb6dc66566cb5881b3d4ee))
* **redesign:** implement premium dark theme and start screen for AFOLs ([f31b783](https://github.com/frank3ling/brick-relic/commit/f31b783ec1c73f5dd8dd26a728a8c88808117407))
* **setup:** completely remove heap simulator, mock datasets, and mock matching/identification fallbacks ([0c3d96b](https://github.com/frank3ling/brick-relic/commit/0c3d96bc2c091c2e1158640efe348902b8155a73))


### Performance Improvements

* **perf:** optimize base-part lookup ([08af1b1](https://github.com/frank3ling/brick-relic/commit/08af1b11133061a83ab57c9db7b366804fb98d75))

## [0.2.9](https://github.com/frank3ling/brick-relic/compare/v0.2.8...v0.2.9) (2026-07-14)


### Bug Fixes

* **ui:** adjust topMatches slice to 5 and resolve mobile header text overflow and delete icon overlap ([68d5d9a](https://github.com/frank3ling/brick-relic/commit/68d5d9a14e3379eaff10bfcc90612b677117a62a))

## [0.2.8](https://github.com/frank3ling/brick-relic/compare/v0.2.7...v0.2.8) (2026-07-14)


### Bug Fixes

* **matching:** optimize matching algorithm and resolve api query limits ([14ca80b](https://github.com/frank3ling/brick-relic/commit/14ca80b58c7262a93a7668ad7dd9def584ef274c))

## [0.2.7](https://github.com/frank3ling/brick-relic/compare/v0.2.6...v0.2.7) (2026-07-13)


### Bug Fixes

* **ui:** load set images with error fallback in SetRadar and DigMode ([0c6048a](https://github.com/frank3ling/brick-relic/commit/0c6048a595af4576cbadc0ba742467219e31006d))
* **ui:** redesign set radar card layout with left thumb, center details, right score ([3f090ce](https://github.com/frank3ling/brick-relic/commit/3f090ce45adbdd0e4749cc92518471e360c6562b))

## [0.2.6](https://github.com/frank3ling/brick-relic/compare/v0.2.5...v0.2.6) (2026-07-13)


### Bug Fixes

* **ui:** remove color status text and sets abgeglichen count label ([d37918b](https://github.com/frank3ling/brick-relic/commit/d37918bb0e29ce96be7bb45d00aee55547238b29))

## [0.2.5](https://github.com/frank3ling/brick-relic/compare/v0.2.4...v0.2.5) (2026-07-13)


### Bug Fixes

* **ui:** increase scanned parts card size and make remove button larger & permanently visible ([bad6e3f](https://github.com/frank3ling/brick-relic/commit/bad6e3f5defb118f4551fa2333972b54da825b76))

## [0.2.4](https://github.com/frank3ling/brick-relic/compare/v0.2.3...v0.2.4) (2026-07-13)


### Bug Fixes

* **ui:** slice Set Radar list to show only top 3 sets ([d2db13f](https://github.com/frank3ling/brick-relic/commit/d2db13f6b28ea455e546c6552d89b2be5199d57b))

## [0.2.3](https://github.com/frank3ling/brick-relic/compare/v0.2.2...v0.2.3) (2026-07-13)


### Bug Fixes

* **simulator:** bypass database RPC and use local matchSets in simulator mode ([7fea2fa](https://github.com/frank3ling/brick-relic/commit/7fea2fa6fe740cfd27b0e7160294c6b584e7c0b5))
* **ui:** show scanned brick images with fallback, simplify set radar card ([962a4b3](https://github.com/frank3ling/brick-relic/commit/962a4b37ec617e2ae8c1109947f91561f2312cfc))

## [0.2.2](https://github.com/frank3ling/brick-relic/compare/v0.2.1...v0.2.2) (2026-07-13)


### Bug Fixes

* **camera:** restrict simulator to ?simulator URL and remove RADAR AKTIV pill & footer ([e5326d9](https://github.com/frank3ling/brick-relic/commit/e5326d93410d75b03bad510b498d4dc45d687dfa))

## [0.2.1](https://github.com/frank3ling/brick-relic/compare/v0.2.0...v0.2.1) (2026-07-13)


### Bug Fixes

* **ui:** hide set radar when empty, remove external images, hide overlay when inactive ([ef34e14](https://github.com/frank3ling/brick-relic/commit/ef34e148a9466090b43fb4bf18dca0a861399276))

# [0.2.0](https://github.com/frank3ling/brick-relic/compare/v0.1.3...v0.2.0) (2026-07-13)


### Features

* **camera:** add webcam support, start-stop toggle, and real classification ([cdf2b7c](https://github.com/frank3ling/brick-relic/commit/cdf2b7c466f399a9c5a6c04d321425b63b6638f3))

## [0.1.3](https://github.com/frank3ling/brick-relic/compare/v0.1.2...v0.1.3) (2026-07-13)


### Bug Fixes

* **camera:** resolve mobile browser binding race condition ([12c19fd](https://github.com/frank3ling/brick-relic/commit/12c19fdca5c9f408d584ade9113dddb942c4956c))

## [0.1.2](https://github.com/frank3ling/brick-relic/compare/v0.1.1...v0.1.2) (2026-07-13)


### Bug Fixes

* **build:** resolve Svelte browser exports correctly in Vite 8 / Rolldown ([56a76c4](https://github.com/frank3ling/brick-relic/commit/56a76c46616f9616a93a0d3a675a6ab6b53eb028))

## [0.1.1](https://github.com/frank3ling/brick-relic/compare/v0.1.0...v0.1.1) (2026-07-13)


### Bug Fixes

* **setup:** make database connection resilient to missing environment variables ([51c58fa](https://github.com/frank3ling/brick-relic/commit/51c58fa3f09efce93cd3d4f8fbe4e684136ee30f))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-13

### Added
- Established the initial project structure and repository guidelines.
- Defined the mathematical foundation for set matching (rarity and least mismatch color scoring).
- Built the initial mobile-first frontend with React, offering a camera viewfinder simulation and "Set Radar".
- Migrated the React SPA to Svelte 5 (Vite + TypeScript + Runes) for maximum client-side performance.
- Built the client-side matching engine with an in-memory rarity/color scoring model over a compiled Rebrickable catalog (sets, diagnostic parts, and color profiles).
- Added license, PR templates, and trademark legal disclaimers.
- Configured GitHub Actions CI pipeline and README.md instructions.
