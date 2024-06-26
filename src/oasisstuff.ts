import * as oasis from '@oasisprotocol/client';
import * as oasisRT from '@oasisprotocol/client-rt';
export type OasisClient = oasis.client.NodeInternal

export type NetworkType = 'testnet' | 'mainnet'

const sapphireConfig = {
  mainnet: {
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  gasPrice: 100n,
  feeGas: 70_000n, // hardcoded. TODO: update when sapphire is upgraded
  decimals: 18,
}

const consensusConfig = {
  decimals: 9,
}

const multiplyConsensusToSapphire = 10n ** BigInt(sapphireConfig.decimals - consensusConfig.decimals)


enum BackendAPIs {
    OasisMonitor = 'oasismonitor',
    OasisScan = 'oasisscan',
}

type BackendApiUrls = {
    explorer: string
    blockExplorer: string
    blockExplorerParatimes?: string
}

type BackendProviders = {
    grpc: string
    ticker: string // from nic.stakingTokenSymbol()
    min_delegation: number // from nic.stakingConsensusParameters().min_delegation
    consensusAddress: string
    runtimeId: string
    [BackendAPIs.OasisMonitor]: BackendApiUrls
    [BackendAPIs.OasisScan]: BackendApiUrls
}

type BackendConfig = {
    [key in NetworkType]: BackendProviders
}

const config: BackendConfig = {
    mainnet: {
      grpc: 'https://grpc.oasis.io',
      ticker: 'ROSE',
      min_delegation: 100,
      consensusAddress: sapphireConfig.mainnet.address,
      runtimeId: sapphireConfig.mainnet.runtimeId,
      [BackendAPIs.OasisMonitor]: {
        explorer: 'https://monitor.oasis.dev',
        blockExplorer: 'https://oasismonitor.com/operation/{{txHash}}',
      },
      [BackendAPIs.OasisScan]: {
        explorer: 'https://api.oasisscan.com/mainnet',
        blockExplorer: 'https://oasisscan.com/transactions/{{txHash}}',
        blockExplorerParatimes: 'https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      },
    },
    testnet: {
      grpc: 'https://testnet.grpc.oasis.io',
      ticker: 'TEST',
      min_delegation: 100,
      consensusAddress: sapphireConfig.testnet.address,
      runtimeId: sapphireConfig.testnet.runtimeId,
      [BackendAPIs.OasisMonitor]: {
        explorer: 'https://monitor.oasis.dev/api/testnet',
        blockExplorer: 'https://testnet.oasismonitor.com/operation/{{txHash}}',
      },
      [BackendAPIs.OasisScan]: {
        explorer: 'https://api.oasisscan.com/testnet',
        blockExplorer: 'https://testnet.oasisscan.com/transactions/{{txHash}}',
        blockExplorerParatimes:
          'https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      },
    },
    /*
    local: {
      grpc: 'http://localhost:42280',
      ticker: 'TEST',
      min_delegation: 100,
      [BackendAPIs.OasisMonitor]: {
        explorer: 'http://localhost:9001',
        blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      },
      [BackendAPIs.OasisScan]: {
        explorer: 'http://localhost:9001',
        blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
        blockExplorerParatimes:
          'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
      },
    },
    */
}

function getEvmBech32Address(evmAddress:`0x${string}`) {
  const evmBytes = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const address = oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  return oasisRT.address.toBech32(address);
}

export class OasisSigner {
  public readonly signer: oasis.signature.Signer;
  public readonly address: Uint8Array;
  public readonly addressBech32: string;

  constructor(public readonly client: OasisClient, public readonly secret: Uint8Array) {
    this.signer = oasis.signature.NaclSigner.fromSecret(secret, 'this key is not important');
    this.address = oasis.staking.addressFromPublicKey(this.signer.public())
    this.addressBech32 = oasis.staking.addressToBech32(this.address);
  }

  async nonce() {
    const nonce = await this.client.consensusGetSignerNonce({
      account_address: this.address,
      height: 0,
    });

    return BigInt(nonce || 0n);
  }

  async balance() {
    return await this.client.stakingAccount({
      height: 0,
      owner: this.address
    });
  }

  async niceBalance() {
    interface NiceBalance {
      balance?: bigint;
      allowances?: Map<Uint8Array, Uint8Array>;
    }
    const result: NiceBalance = {};

    const acct = await this.balance();
    if( acct.general ) {
      result.allowances = acct.general.allowances;
      if( acct.general.balance ) {
        result.balance = oasis.quantity.toBigInt(acct.general.balance);
      }
    }

    return result;
  }

  async setAllowance(who:Uint8Array, amount:bigint) {
      const tw = oasis.staking.allowWrapper()
      tw.setNonce(await this.nonce())
      tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
      tw.setBody({
        beneficiary: who,
        negative: false,
        amount_change: oasis.quantity.fromBigInt(amount), // TODO: this assumes that initial allowance is 0
      })
      const gas = await tw.estimateGas(this.client, this.signer.public())
      tw.setFeeGas(gas)

      const chainContext = await this.client.consensusGetChainContext()
      await tw.sign(new oasis.signature.BlindContextSigner(this.signer), chainContext)
      await tw.submit(this.client)
      return tw.hash()
  }

  async depositToSapphire(sapphireAddress:`0x${string}`, amountToDeposit:bigint) {
    const rtw = new oasisRT.consensusAccounts.Wrapper(
      oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId),
    ).callDeposit()
    rtw
      .setBody({
        amount: [oasis.quantity.fromBigInt(amountToDeposit * multiplyConsensusToSapphire), oasisRT.token.NATIVE_DENOMINATION],
        to: oasis.staking.addressFromBech32(getEvmBech32Address(sapphireAddress)),
      })
      .setFeeAmount([oasis.quantity.fromBigInt(0n), oasisRT.token.NATIVE_DENOMINATION])
      .setFeeGas(sapphireConfig.feeGas)
      .setFeeConsensusMessages(1)
      .setSignerInfo([
        {
          address_spec: {
            signature: { ed25519: this.signer.public() },
          },
          nonce: await this.nonce(),
        },
      ])

    const chainContext = await this.client.consensusGetChainContext()
    await rtw.sign([new oasis.signature.BlindContextSigner(this.signer)], chainContext)
    await rtw.submit(this.client)

    // XXX: how to get transaction ID?
  }
}

/**
 * Return a nic client for the specified network,
 * or by default, for the currently selected network
 */
export function getOasisNic(network: NetworkType)
{
    const url = config[network].grpc
    return new oasis.client.NodeInternal(url)
}
