# Change Log

All notables changes to this project are documented in this file.

The format is inspired by [Keep a Changelog].

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

<!-- markdownlint-disable no-duplicate-heading -->

<!-- NOTE: towncrier will not alter content above the TOWNCRIER line below. -->

<!-- TOWNCRIER -->

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
