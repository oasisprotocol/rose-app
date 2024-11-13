import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { CHAINS, GAS_LIMIT_STAKE, GAS_LIMIT_UNSTAKE } from '../constants/config'
import { Web3Context, Web3ProviderContext, Web3ProviderState } from './Web3Context'
import { consensusDelegate, consensusUndelegate } from '@oasisprotocol/dapp-staker-subcall'
import { useAccount, usePublicClient } from 'wagmi'
import { TransactionRequestLegacy } from 'viem'

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

    if (!CHAINS.has(chainId)) {
      setState(prevState => ({
        ...prevState,
        isSupportedNetwork: false,
      }))

      console.warn('Unknown network!')
      return
    }

    const { blockExplorerUrls, nativeCurrency } = CHAINS.get(chainId)!
    const [explorerBaseUrl] = blockExplorerUrls

    setState(prevState => ({
      ...prevState,
      explorerBaseUrl,
      nativeCurrency,
      isSupportedNetwork: true,
    }))
  }, [chainId])

  const populateDelegateTx = (value: bigint, to: string, gasPrice: bigint) => {
    const preparedTx = consensusDelegate(chainId!, to, value)
    return { ...preparedTx, gas: GAS_LIMIT_STAKE, gasPrice } as TransactionRequestLegacy
  }

  const populateUndelegateTx = (shares: bigint, from: string, gasPrice: bigint) => {
    const preparedTx = consensusUndelegate(chainId!, from, shares)
    return { ...preparedTx, gas: GAS_LIMIT_UNSTAKE, gasPrice } as TransactionRequestLegacy
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
