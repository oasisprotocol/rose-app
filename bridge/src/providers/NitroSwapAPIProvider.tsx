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
        sortOrder: 'asc',
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
        isReserved?: boolean
        sortKey?: string
        sortOrder?: 'asc' | 'desc'
      } = {}
    ) => {
      const defaultParams = {
        sortKey: 'createdAt',
        sortOrder: 'asc',
      }

      const searchParams = new URLSearchParams()
      const mergedParams = { ...defaultParams, ...params }

      Object.entries(mergedParams).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })

      const response = await fetch(`${state.BASE_URL}/token?${searchParams}`)
      return await response.json()
    },
    [state.BASE_URL]
  )

  const getTokens = useCallback(
    async (
      params: {
        page?: number
        limit?: number
        sortKey?: string
        sortOrder?: 'asc' | 'desc'
        chainId?: string
      } = {}
    ) => {
      const defaultParams = {
        page: 0,
        limit: 1000,
        sortKey: 'createdAt',
        sortOrder: 'asc',
      }

      const mergedParams = { ...defaultParams, ...params }

      const response = await fetch(`${state.BASE_URL}/token/getPaginatedTokens`, {
        method: 'POST',
        body: JSON.stringify(mergedParams),
      })

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
    getTokens,
  }

  return <NitroSwapAPIContext.Provider value={providerState}>{children}</NitroSwapAPIContext.Provider>
}
