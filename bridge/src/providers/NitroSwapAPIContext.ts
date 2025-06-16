import { createContext } from 'react'
import { Chain, ChainsResponse } from '../types/chains'
import { Token, TokenResponse } from '../types/tokens'

export interface NitroSwapAPIProviderState {
  BASE_URL: string
  chains: Chain[] | null
  nativeTokens: Token[] | null
}

export interface NitroSwapAPIProviderContext {
  readonly state: NitroSwapAPIProviderState
  getChains: (params?: {
    page?: number
    limit?: number
    sortKey?: string
    sortOrder?: 'asc' | 'desc'
    isEnabledForMainnet?: boolean
    chainId?: string
  }) => Promise<ChainsResponse>
  getToken: (params?: { address?: string; chainId?: string; isNative?: boolean }) => Promise<TokenResponse>
}

export const NitroSwapAPIContext = createContext<NitroSwapAPIProviderContext>(
  {} as NitroSwapAPIProviderContext
)
