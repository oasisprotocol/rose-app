import { AbiCoder } from 'ethers'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'

const ABI_CODER = AbiCoder.defaultAbiCoder()

const toSecp256k1eth = async (hexAddress: string) => {
  return await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    oasis.misc.fromHex(hexAddress.replace('0x', ''))
  )
}

export { ABI_CODER, toSecp256k1eth }
