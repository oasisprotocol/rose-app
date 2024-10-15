import { FC, useEffect } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useWeb3 } from '../hooks/useWeb3'
import { useNavigate } from 'react-router-dom'

export const withConnectedWallet = (WrappedComponent: FC) => {
  const WithConnectedWallet = (props: JSX.IntrinsicAttributes) => {
    const navigate = useNavigate()
    const {
      state: { isConnected },
    } = useWeb3()

    useEffect(() => {
      if (isConnected) {
        navigate('/dashboard')
      }
    }, [isConnected, navigate])

    return <WrappedComponent {...props} />
  }

  WithConnectedWallet.displayName = `WithConnectedWallet(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithConnectedWallet
}
