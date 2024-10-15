# ROSE Move

A dApp that enables you to easily transfer ROSE from your consensus account
(e.g. on a centralized exchange) to your account on Oasis Sapphire, or vice
versa.

## Architecture

- Deposit:

```mermaid
flowchart TD
  a["metamask sapphire account"]
  a --> b["sign-in with ethereum signature"]
  b --> c["sha512_256"]
  c --> d["consensus account private key"]
  d --> e["wait for a transfer into consensus account"]
  e --> f["set allowance"]
  f --> g["deposit"]
  g --> a
```

- TODO: Withdraw

```mermaid
flowchart TD
  a["metamask sapphire account"]
  a --> b["sign-in with ethereum signature"]
  b --> c["sha512_256"]
  c --> d["sapphire account private key"] & e["consensus account private key"]

  d --> f["wait for a transfer into sapphire account"]
  f --> g["withdraw"]

  e --> h["wait for a withdraw into consensus account"]
  h --> i["transfer"]
  i --> j["input consensus address"]

  g -..-> h
```

## Getting started

### Installing and running from source code

```sh
yarn
yarn dev

# to see all steps without transferring ROSE, type this into browser console
mock = true
```
