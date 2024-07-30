// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Buffer: any

export abstract class FormattingUtils {
  static async toUint8Array(hex: string): Promise<Uint8Array> {
    return Uint8Array.from(Buffer.from(hex.replace('0x', ''), 'hex'))
  }
}
