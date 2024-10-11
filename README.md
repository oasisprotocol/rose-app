```sh
yarn
(cd move && yarn)
(cd stake && pnpm install --frozen-lockfile --ignore-scripts && pnpm --filter @oasisprotocol/dapp-staker-subcall build)

(cd move && yarn build -w) # terminal 1
(cd stake && pnpm --filter @oasisprotocol/dapp-staker-frontend build -w) # terminal 2
# results of these are symlinked into ./public/

yarn dev # terminal 3
```
