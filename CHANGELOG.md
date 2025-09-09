# Change Log

All notables changes to this project are documented in this file.

The format is inspired by [Keep a Changelog].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

<!-- markdownlint-disable no-duplicate-heading -->

<!-- NOTE: towncrier will not alter content above the TOWNCRIER line below. -->

<!-- TOWNCRIER -->

## 1.1.3 (2025-09-09)

### Features

- Discover: Backport discovery design fixes to stable branch
  ([#289](https://github.com/oasisprotocol/rose-app/issues/289))

### Internal Changes

- Run GH linter on pushes / PRs to the stable branch
  ([#291](https://github.com/oasisprotocol/rose-app/issues/291))

## 1.1.2 (2025-08-19)

### Bug Fixes and Improvements

- move: Fix by removing oasisscan as an alternative source for consensus nonce
  ([#273](https://github.com/oasisprotocol/rose-app/issues/273))

## 1.1.1 (2025-05-22)

### Bug Fixes and Improvements

- wrap: Unify background color
  ([#233](https://github.com/oasisprotocol/rose-app/issues/233))

- Add missing svgrrc config file
  ([#240](https://github.com/oasisprotocol/rose-app/issues/240))

### Internal Changes

- Update dependencies
  ([#179](https://github.com/oasisprotocol/rose-app/issues/179),
   [#228](https://github.com/oasisprotocol/rose-app/issues/228))

- Update README
  ([#229](https://github.com/oasisprotocol/rose-app/issues/229))

- discover: Move ecosystem icons to assets.oasis.io
  ([#231](https://github.com/oasisprotocol/rose-app/issues/231))

- Move brand logo to assets.oasis.io
  ([#236](https://github.com/oasisprotocol/rose-app/issues/236))

## 1.1.0 (2025-04-02)

### Features

- Remove /#/ from URLs
  ([#224](https://github.com/oasisprotocol/rose-app/issues/224))

### Bug Fixes and Improvements

- move: Fix withdrawing/depositing after navigating away and back without reload
  ([#155](https://github.com/oasisprotocol/rose-app/issues/155))

- move: Block react-router navigation while withdrawing/depositing
  ([#208](https://github.com/oasisprotocol/rose-app/issues/208))

- move: Fix withdrawing small amounts
  ([#210](https://github.com/oasisprotocol/rose-app/issues/210))

- move: Count rose.prd.oasis.io URL as production deploy
  ([#221](https://github.com/oasisprotocol/rose-app/issues/221))

### Internal Changes

- Add basic e2e navigation tests
  ([#218](https://github.com/oasisprotocol/rose-app/issues/218),
   [#219](https://github.com/oasisprotocol/rose-app/issues/219))

- Upgrade axios dependency
  ([#220](https://github.com/oasisprotocol/rose-app/issues/220))

- Rename playwright install script
  ([#223](https://github.com/oasisprotocol/rose-app/issues/223))

## 1.0.3 (2025-02-21)

### Internal Changes

- Fix release workflow
  ([#214](https://github.com/oasisprotocol/rose-app/issues/214))

## 1.0.2 (2025-02-21)

### Bug Fixes and Improvements

- wrap: Fix BN to bigint conversion
  ([#204](https://github.com/oasisprotocol/rose-app/issues/204))

- Show correct ROSE App version in footer
  ([#206](https://github.com/oasisprotocol/rose-app/issues/206))

- move: Fix race conditions when withdrawing to second destination address
  ([#207](https://github.com/oasisprotocol/rose-app/issues/207))

### Internal Changes

- Fix pnpm cache and install order in CI
  ([#209](https://github.com/oasisprotocol/rose-app/issues/209))

## 1.0.1 (2025-02-17)

### Internal Changes

- Replace GitHub pages deployment with GitHub release
  ([#201](https://github.com/oasisprotocol/rose-app/issues/201))

- Fix path of release build artifacts
  ([#202](https://github.com/oasisprotocol/rose-app/issues/202))

## 1.0.0 (2025-02-14)

### Process Changes

- Add Change Log and the Change Log fragments process for assembling it
  ([#173](https://github.com/oasisprotocol/rose-app/issues/173))

  This follows the same Change Log fragments process as is used by [Oasis Core].

  For more details, see [Change Log fragments].

  [Oasis Core]: https://github.com/oasisprotocol/oasis-core
  [Change Log fragments]: .changelog/README.md
