import { FC, useEffect } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useWeb3 } from '../hooks/useWeb3'
import { useNavigate } from 'react-router-dom'

export const withDisconnectedWallet = (WrappedComponent: FC) => {
  const WithDisconnectedWallet = (props: JSX.IntrinsicAttributes) => {
    const navigate = useNavigate()
    const {
      state: { isConnected },
    } = useWeb3()

    useEffect(() => {
      if (!isConnected) {
        navigate('/')
      }
    }, [isConnected, navigate])

    return <WrappedComponent {...props} />
  }

  WithDisconnectedWallet.displayName = `WithDisconnectedWallet(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithDisconnectedWallet
}
