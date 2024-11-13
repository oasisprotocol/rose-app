import { FC, useEffect } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'

export const withDisconnectedWallet = (WrappedComponent: FC) => {
  const WithDisconnectedWallet = (props: JSX.IntrinsicAttributes) => {
    const navigate = useNavigate()
    const { isConnected } = useAccount()
    const {
      state: { isSupportedNetwork },
    } = useWeb3()

    useEffect(() => {
      if (!isSupportedNetwork || !isConnected) {
        navigate('/')
      }
    }, [isSupportedNetwork, isConnected, navigate])

    return <WrappedComponent {...props} />
  }

  WithDisconnectedWallet.displayName = `WithDisconnectedWallet(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithDisconnectedWallet
}
