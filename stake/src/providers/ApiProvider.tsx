import { FC, PropsWithChildren, useState } from 'react'
import { ApiContext, ApiProviderContext, ApiProviderState } from './ApiContext'
import { Api, HttpClient } from '@oasisprotocol/nexus-api'
import { AxiosRequestConfig } from 'axios'
import { NEXUS_BASE_URL_CONFIG } from '../constants/config'
import { useAccount } from 'wagmi'

const apiProviderInitialState: ApiProviderState = {}

export const ApiContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chainId } = useAccount()
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

  const getValidators = async (axiosRequestConfig = getAxiosRequestConfig()) => {
    const nexusApi = new Api(new HttpClient(axiosRequestConfig))
    const { data } = await nexusApi.consensus.validatorsList({ limit: 1000, offset: 0 })
    return data
  }

  const providerState: ApiProviderContext = {
    state,
    getValidators,
  }

  return <ApiContext.Provider value={providerState}>{children}</ApiContext.Provider>
}
