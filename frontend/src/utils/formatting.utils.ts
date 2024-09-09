import * as oasis from '@oasisprotocol/client'

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
}
