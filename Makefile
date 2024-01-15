all:
	@echo ...

clean:
	pnpm --filter dapp-staking-contracts $@
	pnpm --filter dapp-staking-model $@
	pnpm --filter dapp-staking-cli $@

build:
	pnpm --filter dapp-staking-contracts $@
	pnpm --filter dapp-staking-model $@
	pnpm --filter dapp-staking-cli $@

