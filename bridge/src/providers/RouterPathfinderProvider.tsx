import { FC, PropsWithChildren, useCallback, useState } from 'react'
import {
  RouterPathfinderContext,
  RouterPathfinderProviderContext,
  RouterPathfinderProviderState,
} from './RouterPathfinderContext'
import { useAccount, useSendTransaction } from 'wagmi'
import { Api, QuoteResponse, TransactionRequestBody } from '@oasisprotocol/router-pathfinder-api'
import { checkAndSetErc20Allowance } from '../contracts/erc-20'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { wagmiConfig } from '../../../home/src/constants/wagmi-config'
import { maxUint256 } from 'viem'

const pathfinderApi = new Api({
  baseUrl: 'https://api-beta.pathfinder.routerprotocol.com/api/v2',
})

const routerPathfinderProviderInitialState: RouterPathfinderProviderState = {}

export const RouterPathfinderContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useState<RouterPathfinderProviderState>({
    ...routerPathfinderProviderInitialState,
  })

  const { address: userAddress } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  const getQuote = useCallback(
    async (params: {
      fromTokenAddress: string
      toTokenAddress: string
      amount: string
      fromTokenChainId: string
      toTokenChainId: string
      slippageTolerance?: number
      destFuel?: number
      partnerId?: number
    }) => {
      const defaultParams = {
        slippageTolerance: 2,
        destFuel: 0,
        partnerId: 1,
      }

      const mergedParams = { ...defaultParams, ...params }

      try {
        const response = await pathfinderApi.quote.quote(mergedParams)
        return response.data
      } catch (error) {
        console.error('Error fetching quote:', error)
        throw error
      }
    },
    []
  )

  const getTransaction = useCallback(
    async (
      params: {
        senderAddress: string
        receiverAddress: string
        refundAddress?: string
      } & QuoteResponse
    ) => {
      try {
        const response = await pathfinderApi.transaction.transaction(params as TransactionRequestBody)
        return response.data
      } catch (error) {
        console.error('Error fetching transaction:', error)
        throw error
      }
    },
    []
  )

  const getStatus = useCallback(async (params: { srcTxHash: string }) => {
    try {
      const response = await pathfinderApi.status.status({ ...params })
      return response.data
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  }, [])

  const executeTransaction = async (quote: QuoteResponse) => {
    await checkAndSetErc20Allowance(
      quote.source!.asset.address as `0x${string}`,
      quote.allowanceTo! as `0x${string}`,
      maxUint256,
      userAddress as `0x${string}`
    )

    const tx = await getTransaction({
      ...quote,
      senderAddress: userAddress as string,
      receiverAddress: userAddress as string,
    })

    const hash = await sendTransactionAsync({
      ...tx.txn,
    })

    await waitForTransactionReceipt(wagmiConfig, {
      hash,
    })

    return hash
  }

  const providerState: RouterPathfinderProviderContext = {
    state,
    getQuote,
    getTransaction,
    getStatus,
    executeTransaction,
  }

  return <RouterPathfinderContext.Provider value={providerState}>{children}</RouterPathfinderContext.Provider>
}
