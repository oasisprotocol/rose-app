import { FC, PropsWithChildren, useEffect, useState } from 'react'
import {
  GAS_LIMIT_STAKE,
  GAS_LIMIT_UNSTAKE,
  SAPPHIRE_1RPC_CHAIN_CONFIG,
  SAPPHIRE_CHAIN_CONFIG,
  SAPPHIRE_TESTNET_CHAIN_CONFIG,
  SUPPORTED_CHAIN_IDS,
} from '../constants/config'
import { Web3Context, Web3ProviderContext, Web3ProviderState } from './Web3Context'
import { consensusDelegate, consensusUndelegate } from '@oasisprotocol/rose-app-subcall'
import { useAccount, usePublicClient } from 'wagmi'
import { TransactionRequestLegacy, createPublicClient, http, PublicClient } from 'viem'

const { PROD } = import.meta.env

/* eslint-disable indent */
const clients: PublicClient[] = PROD
  ? [
      createPublicClient({ chain: SAPPHIRE_1RPC_CHAIN_CONFIG, transport: http() }),
      createPublicClient({ chain: SAPPHIRE_CHAIN_CONFIG, transport: http() }),
    ]
  : [createPublicClient({ chain: SAPPHIRE_TESTNET_CHAIN_CONFIG, transport: http() })]
/* eslint-enable indent */

const web3ProviderInitialState: Web3ProviderState = {
  explorerBaseUrl: null,
  isInteractingWithChain: false,
  isSupportedNetwork: false,
}

export const Web3ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const publicClient = usePublicClient()
  const { address, chainId } = useAccount()

  const [state, setState] = useState<Web3ProviderState>({
    ...web3ProviderInitialState,
  })

  useEffect(() => {
    setState(prevState => ({ ...prevState, isInteractingWithChain: false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  useEffect(() => {
    if (!chainId) {
      setState(prevState => ({
        ...prevState,
        explorerBaseUrl: null,
      }))

      return
    }

    if (!Object.keys(SUPPORTED_CHAIN_IDS).includes(chainId.toString())) {
      setState(prevState => ({
        ...prevState,
        isSupportedNetwork: false,
      }))

      console.warn('Unknown network!')
      return
    }

    const { blockExplorers, nativeCurrency } = SUPPORTED_CHAIN_IDS[chainId]
    const explorerBaseUrl = blockExplorers!.default.url

    setState(prevState => ({
      ...prevState,
      explorerBaseUrl,
      nativeCurrency,
      isSupportedNetwork: true,
    }))
  }, [chainId])

  const getNonce = async () => {
    const nonces = await Promise.all(clients.map(c => c.getTransactionCount({ address: address! })))
    return Math.max(...nonces)
  }

  const populateDelegateTx = async (value: bigint, to: string, gasPrice: bigint) => {
    const preparedTx = consensusDelegate(chainId!, to, value)
    const nonce = await getNonce()
    return { ...preparedTx, gas: GAS_LIMIT_STAKE, gasPrice, nonce } as TransactionRequestLegacy
  }

  const populateUndelegateTx = async (shares: bigint, from: string, gasPrice: bigint) => {
    const preparedTx = consensusUndelegate(chainId!, from, shares)
    const nonce = await getNonce()
    return { ...preparedTx, gas: GAS_LIMIT_UNSTAKE, gasPrice, nonce } as TransactionRequestLegacy
  }

  const getTransactionReceipt = async (hash: `0x${string}`) => {
    const txReceipt = await publicClient!.waitForTransactionReceipt({ confirmations: 2, hash })

    if (txReceipt.status === 'reverted') throw new Error('Transaction failed')

    return txReceipt
  }

  const providerState: Web3ProviderContext = {
    state,
    populateDelegateTx,
    populateUndelegateTx,
    getTransactionReceipt,
  }

  return <Web3Context.Provider value={providerState}>{children}</Web3Context.Provider>
}
