import * as oasis from "@oasisprotocol/client";
import nacl from "tweetnacl";
export type OasisClient = oasis.client.NodeInternal;

import { staking } from "@oasisprotocol/client";
import type { Signer } from "@oasisprotocol/client/dist/signature";

type TransactionWrapper<T> = oasis.consensus.TransactionWrapper<T>;

export type NetworkType = "local" | "testnet" | "mainnet";

enum BackendAPIs {
  OasisMonitor = "oasismonitor",
  OasisScan = "oasisscan",
}

type BackendApiUrls = {
  explorer: string;
  blockExplorer: string;
  blockExplorerParatimes?: string;
};

type BackendProviders = {
  grpc: string;
  ticker: string; // from nic.stakingTokenSymbol()
  min_delegation: number; // from nic.stakingConsensusParameters().min_delegation
  [BackendAPIs.OasisMonitor]: BackendApiUrls;
  [BackendAPIs.OasisScan]: BackendApiUrls;
};

type BackendConfig = {
  [key in NetworkType]: BackendProviders;
};

const config: BackendConfig = {
  mainnet: {
    grpc: "https://grpc.oasis.io",
    ticker: "ROSE",
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: "https://monitor.oasis.dev",
      blockExplorer: "https://oasismonitor.com/operation/{{txHash}}",
    },
    [BackendAPIs.OasisScan]: {
      explorer: "https://api.oasisscan.com/mainnet",
      blockExplorer: "https://oasisscan.com/transactions/{{txHash}}",
      blockExplorerParatimes: "https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}",
    },
  },
  testnet: {
    grpc: "https://testnet.grpc.oasis.io",
    ticker: "TEST",
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: "https://monitor.oasis.dev/api/testnet",
      blockExplorer: "https://testnet.oasismonitor.com/operation/{{txHash}}",
    },
    [BackendAPIs.OasisScan]: {
      explorer: "https://api.oasisscan.com/testnet",
      blockExplorer: "https://testnet.oasisscan.com/transactions/{{txHash}}",
      blockExplorerParatimes: "https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}",
    },
  },
  local: {
    grpc: "http://localhost:42280",
    ticker: "TEST",
    min_delegation: 100,
    [BackendAPIs.OasisMonitor]: {
      explorer: "http://localhost:9001",
      blockExplorer: "http://localhost:9001/data/transactions?operation_id={{txHash}}",
    },
    [BackendAPIs.OasisScan]: {
      explorer: "http://localhost:9001",
      blockExplorer: "http://localhost:9001/data/transactions?operation_id={{txHash}}",
      blockExplorerParatimes: "http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}",
    },
  },
};

export async function getAccountFromSecret(secret: Uint8Array) {
  const s = oasis.signature.NaclSigner.fromSecret(secret, "this key is not important");
  const a = await oasis.staking.addressFromPublicKey(s.public());
  return {
    signer: s,
    address: a,
    addressBech32: oasis.staking.addressToBech32(a),
  };
}

export async function getAccountBalance(nic: OasisClient, stakingAddress: Uint8Array) {
  const x = await nic.consensusGetStatus();
  console.log("consensus status", x);
  const acct = await nic.stakingAccount({
    height: x.latest_height,
    owner: stakingAddress,
  });
  console.log("Allowances", acct.general?.allowances);
  if (acct.general) {
    if (acct.general.balance) {
      return {
        balance: oasis.quantity.toBigInt(acct.general.balance),
      };
    }
  }
  return {
    balance: 0n,
  };
}

/**
 * Return a nic client for the specified network,
 * or by default, for the currently selected network
 */
export function getOasisNic(network: NetworkType) {
  const url = config[network].grpc;
  return new oasis.client.NodeInternal(url);
}

async function getNonce(nic: OasisClient, signer: Signer): Promise<bigint> {
  const nonce = await nic.consensusGetSignerNonce({
    account_address: await staking.addressFromPublicKey(signer.public()),
    height: 0,
  });

  return BigInt(nonce || 0n);
}

export async function buildTransfer(
  nic: OasisClient,
  signer: Signer,
  to: string,
  amount: bigint,
): Promise<TransactionWrapper<oasis.types.StakingTransfer>> {
  const tw = oasis.staking.transferWrapper();
  const nonce = await getNonce(nic, signer);
  tw.setNonce(nonce);
  tw.setFeeAmount(oasis.quantity.fromBigInt(0n));
  tw.setBody({
    to: staking.addressFromBech32(to),
    amount: oasis.quantity.fromBigInt(amount),
  });

  const gas = await tw.estimateGas(nic, signer.public());
  tw.setFeeGas(gas);

  return tw;
}
