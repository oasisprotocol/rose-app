import { FC, PropsWithChildren, useState } from 'react'
import { ApiContext, ApiProviderContext, ApiProviderState } from './ApiContext'
import { getOasisNexusAPIV1 } from '@oasisprotocol/nexus-api'
import { AxiosRequestConfig } from 'axios'
import { VITE_NEXUS_BASE_URL } from '../constants/config'

const apiProviderInitialState: ApiProviderState = {}

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: VITE_NEXUS_BASE_URL,
}

export const ApiContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useState<ApiProviderState>({
    ...apiProviderInitialState,
  })

  const { getConsensusValidators } = getOasisNexusAPIV1()

  const getValidators = async () => {
    const { data } = await getConsensusValidators({ limit: 1000, offset: 0 }, axiosRequestConfig)
    return data
  }

  const providerState: ApiProviderContext = {
    state,
    getValidators,
  }

  return <ApiContext.Provider value={providerState}>{children}</ApiContext.Provider>
}
