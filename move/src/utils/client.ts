import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { oasisConfig, sapphireConfig } from './oasisConfig.ts'

const { PROD } = import.meta.env

export function getNodeInternal(grpcConfig = PROD ? oasisConfig.mainnet.grpc : oasisConfig.testnet.grpc) {
  return new oasis.client.NodeInternal(grpcConfig)
}

export function getConsensusAccountsWrapper(
  runtimeId = PROD ? sapphireConfig.mainnet.runtimeId : sapphireConfig.testnet.runtimeId
) {
  return new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(runtimeId))
}
