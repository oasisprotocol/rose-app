import { FC, useEffect } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { useNavigate } from 'react-router-dom'

export const DashboardPage: FC = () => {
  const navigate = useNavigate()
  const {
    state: { isConnected },
  } = useWeb3()

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

  return <h1>Dashboard page</h1>
}
