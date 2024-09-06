import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Buffer: any

export abstract class FormattingUtils {
  static async toUint8Array(hex: string): Promise<Uint8Array> {
    return Uint8Array.from(Buffer.from(hex.replace('0x', ''), 'hex'))
  }

  static async toBech32(hexAddress: string): Promise<string> {
    const bech32Uint8Array = await FormattingUtils.toUint8Array(hexAddress)
    return oasis.staking.addressToBech32(bech32Uint8Array)
  }

  static async toSecp256k1eth(hexAddress: string) {
    return await oasis.address.fromData(
      oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
      oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
      oasis.misc.fromHex(hexAddress.replace('0x', ''))
    )
  }
}
