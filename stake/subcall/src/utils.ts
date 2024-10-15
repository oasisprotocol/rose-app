import { AbiCoder } from 'ethers'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { PARATIMES_CONFIG } from './config.ts'
import { ParaTimeChainId } from './types.ts'

const ABI_CODER = AbiCoder.defaultAbiCoder()

const toSecp256k1eth = async (hexAddress: string) => {
  return await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    oasis.misc.fromHex(hexAddress.replace('0x', ''))
  )
}

const getParaTimeConfig = (chainId: ParaTimeChainId) => {
  const _chainId = Number(chainId)

  if (!PARATIMES_CONFIG.has(_chainId)) {
    throw new Error(
      `Invalid [chainId], supported chain ids are: ${Array.from(PARATIMES_CONFIG.keys()).join(', ')}`
    )
  }

  return PARATIMES_CONFIG.get(_chainId)
}

export { ABI_CODER, toSecp256k1eth, getParaTimeConfig }
