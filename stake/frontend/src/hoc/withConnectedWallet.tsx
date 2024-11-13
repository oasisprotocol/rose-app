import { FC, useEffect } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'

export const withConnectedWallet = (WrappedComponent: FC) => {
  const WithConnectedWallet = (props: JSX.IntrinsicAttributes) => {
    const navigate = useNavigate()
    const { isConnected } = useAccount()
    const {
      state: { isSupportedNetwork },
    } = useWeb3()

    useEffect(() => {
      if (isSupportedNetwork && isConnected) {
        navigate('/dashboard')
      }
    }, [isSupportedNetwork, isConnected, navigate])

    return <WrappedComponent {...props} />
  }

  WithConnectedWallet.displayName = `WithConnectedWallet(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithConnectedWallet
}
