import { FC, PropsWithChildren, useState } from 'react'
import { ApiContext, ApiProviderContext, ApiProviderState } from './ApiContext'
import { getOasisNexusAPIV1 } from '@oasisprotocol/nexus-api'
import { AxiosRequestConfig } from 'axios'
import { useWeb3 } from '../hooks/useWeb3'
import { NEXUS_BASE_URL_CONFIG } from '../constants/config'

const apiProviderInitialState: ApiProviderState = {}

export const ApiContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    state: { chainId },
  } = useWeb3()
  const [state] = useState<ApiProviderState>({
    ...apiProviderInitialState,
  })

  const getAxiosRequestConfig = () => {
    if (!NEXUS_BASE_URL_CONFIG.has(chainId!)) {
      throw new Error('Invalid [chainId]')
    }

    return {
      baseURL: NEXUS_BASE_URL_CONFIG.get(chainId!),
    } satisfies AxiosRequestConfig
  }

  const { getConsensusValidators } = getOasisNexusAPIV1()

  const getValidators = async (axiosRequestConfig = getAxiosRequestConfig()) => {
    const { data } = await getConsensusValidators({ limit: 1000, offset: 0 }, axiosRequestConfig)
    return data
  }

  const providerState: ApiProviderContext = {
    state,
    getValidators,
  }

  return <ApiContext.Provider value={providerState}>{children}</ApiContext.Provider>
}
