import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import {
  NitroSwapAPIContext,
  NitroSwapAPIProviderContext,
  NitroSwapAPIProviderState,
} from './NitroSwapAPIContext'
import { ENABLED_CHAINS_IDS } from '../constants/config'

const nitroSwapAPIProviderInitialState: NitroSwapAPIProviderState = {
  BASE_URL: 'https://api.nitroswap.routernitro.com',
  chains: null,
  nativeTokens: null,
}

export const NitroSwapAPIContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<NitroSwapAPIProviderState>({
    ...nitroSwapAPIProviderInitialState,
  })

  const getChains: NitroSwapAPIProviderContext['getChains'] = useCallback(
    async (
      params: {
        page?: number
        limit?: number
        sortKey?: string
        sortOrder?: 'asc' | 'desc'
        isEnabledForMainnet?: boolean
        chainId?: string
      } = {}
    ) => {
      const defaultParams = {
        page: 0,
        limit: 100,
        sortKey: 'createdAt',
        sortOrder: 'asc' as const,
        isEnabledForMainnet: true,
      }

      const searchParams = new URLSearchParams()
      const mergedParams = { ...defaultParams, ...params }

      Object.entries(mergedParams).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })

      const response = await fetch(`${state.BASE_URL}/chain?${searchParams}`)
      return await response.json()
    },
    [state.BASE_URL]
  )

  const getToken: NitroSwapAPIProviderContext['getToken'] = useCallback(
    async (
      params: {
        address?: string
        chainId?: string
        isNative?: boolean
      } = {}
    ) => {
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })

      const response = await fetch(`${state.BASE_URL}/token?${searchParams}`)
      return await response.json()
    },
    [state.BASE_URL]
  )

  useEffect(() => {
    const init = async () => {
      const enabledChainsPromises = ENABLED_CHAINS_IDS.map(async chainId => {
        const { data } = await getChains({ chainId })
        return data.filter(chain => chain.isLive)
      })

      const enabledChains = await Promise.all(enabledChainsPromises)

      setState(prevState => ({
        ...prevState,
        chains: enabledChains.flat(),
      }))
    }

    init()
  }, [getChains])

  useEffect(() => {
    if (!state.chains?.length) {
      return
    }

    const getTokens = async () => {
      // Load native tokens
      const tokensPromises = state.chains!.map(async chain => {
        const { data } = await getToken({ isNative: true, chainId: chain.chainId })
        return data
      })

      const tokens = await Promise.all(tokensPromises)

      setState(prevState => ({
        ...prevState,
        nativeTokens: tokens.flat(),
      }))
    }

    getTokens()
  }, [state.chains, getToken])

  const providerState: NitroSwapAPIProviderContext = {
    state,
    getChains,
    getToken,
  }

  return <NitroSwapAPIContext.Provider value={providerState}>{children}</NitroSwapAPIContext.Provider>
}
