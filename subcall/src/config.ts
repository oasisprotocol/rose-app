import { ParatimeConfig } from './types.ts'

export const PARATIMES_CONFIG: Map<number, ParatimeConfig> = new Map([
  [
    23294,
    {
      subcallAddress: '0x0100000000000000000000000000000000000103',
      paratimeRuntimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
      grpcUrl: 'https://grpc.oasis.io',
    },
  ],
  [
    23295,
    {
      subcallAddress: '0x0100000000000000000000000000000000000103',
      paratimeRuntimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
      grpcUrl: 'https://testnet.grpc.oasis.io',
    },
  ],
])
