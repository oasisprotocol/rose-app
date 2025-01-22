import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { MAX_GAS_LIMIT, NETWORKS } from '../constants/config'
// https://repo.sourcify.dev/contracts/full_match/23295/0xB759a0fbc1dA517aF257D5Cf039aB4D86dFB3b94/
// https://repo.sourcify.dev/contracts/full_match/23294/0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3/
import WrappedRoseMetadata from '../contracts/WrappedROSE.json'
import { Web3Context, Web3ProviderContext, Web3ProviderState } from './Web3Context'
import { useAccount, usePublicClient, useWalletClient, useWatchAsset } from 'wagmi'
import { getContract } from 'viem'
import BigNumber from 'bignumber.js'

const web3ProviderInitialState: Web3ProviderState = {
  wRoseContractAddress: null,
  wRoseContract: null,
  explorerBaseUrl: null,
  isSupportedNetwork: false,
}

export const Web3ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const publicClient = usePublicClient()
  const { watchAsset } = useWatchAsset()
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient({
    account: address,
    chainId,
  })

  const [state, setState] = useState<Web3ProviderState>({
    ...web3ProviderInitialState,
  })

  useEffect(() => {
    if (!walletClient) {
      return
    }

    if (!chainId) {
      setState(prevState => ({
        ...prevState,
        explorerBaseUrl: null,
      }))

      return
    }

    if (!Object.keys(NETWORKS).includes(chainId.toString())) {
      setState(prevState => ({
        ...prevState,
        isSupportedNetwork: false,
        wRoseContract: null,
      }))

      console.warn('Unknown network!')
      return
    }

    const { explorerBaseUrl, wRoseContractAddress } = NETWORKS[chainId]

    const wRoseContract = getContract({
      address: wRoseContractAddress,
      abi: WrappedRoseMetadata.output.abi,
      client: {
        public: publicClient!,
        wallet: walletClient!,
      },
    })

    setState(prevState => ({
      ...prevState,
      explorerBaseUrl,
      isSupportedNetwork: true,
      wRoseContractAddress,
      wRoseContract,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, walletClient])

  const getBalance = async () => {
    if (!publicClient || !address) {
      throw new Error('[Web3Context] Unable to fetch balance!')
    }

    return await publicClient.getBalance({ address })
  }

  const getBalanceOfWROSE = async (): Promise<bigint> => {
    const { wRoseContractAddress } = state

    if (!publicClient) {
      throw new Error('[Web3Context] publicClient is not initialized!')
    }

    if (!address) {
      throw new Error('[Web3Context] Address is required to fetch WROSE balance!')
    }

    return (await publicClient!.readContract({
      address: wRoseContractAddress!,
      abi: WrappedRoseMetadata.output.abi,
      functionName: 'balanceOf',
      args: [address],
    })) as Promise<bigint>
  }

  const getGasPrice = async () => {
    if (!publicClient) {
      // Silently fail
      return 0n
    }

    return await publicClient.getGasPrice()
  }

  const wrap = async (amount: string, gasPrice: BigNumber) => {
    if (!amount) {
      throw new Error('[amount] is required!')
    }

    const { wRoseContract } = state

    if (!wRoseContract) {
      throw new Error('[wRoseContract] not initialized!')
    }

    return await wRoseContract.write.deposit([], {
      value: amount,
      gas: MAX_GAS_LIMIT,
      gasPrice,
      account: address,
    })
  }

  const unwrap = async (amount: string, gasPrice: BigNumber) => {
    if (!amount) {
      throw new Error('[amount] is required!')
    }

    const { wRoseContract } = state

    if (!wRoseContract) {
      throw new Error('[wRoseContract] not initialized!')
    }

    return await wRoseContract.write.withdraw([amount], {
      gasLimit: MAX_GAS_LIMIT,
      gasPrice,
      account: address,
    })
  }

  const getTransaction = async (hash: `0x${string}`) => {
    if (!hash) {
      throw new Error('[hash] is required!')
    }

    const txReceipt = await publicClient!.waitForTransactionReceipt({ confirmations: 2, hash })

    if (txReceipt.status === 'reverted') throw new Error('Transaction failed')

    return txReceipt
  }

  const addTokenToWallet = async () => {
    const { wRoseContractAddress } = state

    if (!wRoseContractAddress) {
      throw new Error('[wRoseContractAddress] is required!')
    }

    return await watchAsset({
      type: 'ERC20',
      options: {
        address: wRoseContractAddress,
        symbol: 'WROSE',
        decimals: 18,
      },
    })
  }

  const providerState: Web3ProviderContext = {
    state,
    wrap,
    unwrap,
    getBalance,
    getBalanceOfWROSE,
    getTransaction,
    addTokenToWallet,
    getGasPrice,
  }

  return <Web3Context.Provider value={providerState}>{children}</Web3Context.Provider>
}
