import { createContext } from 'react'
import { QuoteResponse, StatusResponse, TransactionResponseBody } from '@oasisprotocol/router-pathfinder-api'

export interface RouterPathfinderProviderState {}

export interface RouterPathfinderProviderContext {
  readonly state: RouterPathfinderProviderState
  getQuote: (params: {
    fromTokenAddress: string
    toTokenAddress: string
    amount: string
    fromTokenChainId: string
    toTokenChainId: string
    slippageTolerance?: number
    destFuel?: number
    partnerId?: number
  }) => Promise<QuoteResponse>
  getTransaction: (
    params: {
      senderAddress: string
      receiverAddress: string
      refundAddress?: string
    } & QuoteResponse
  ) => Promise<TransactionResponseBody>
  executeTransaction: (quote: QuoteResponse) => Promise<string>
  getStatus: (params: { srcTxHash: string }) => Promise<StatusResponse>
}

export const RouterPathfinderContext = createContext<RouterPathfinderProviderContext>(
  {} as RouterPathfinderProviderContext
)
