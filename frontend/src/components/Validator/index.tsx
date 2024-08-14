import { FC, memo, ReactNode, useEffect, useState } from 'react'
import { Validator as APIValidator } from '@oasisprotocol/nexus-api'
import { useAppState } from '../../hooks/useAppState'

interface Props {
  address: string
  children: (validator: APIValidator) => ReactNode
  fallback?: ReactNode
}

const ValidatorCmp: FC<Props> = ({ address, children, fallback = <span>...</span> }) => {
  const { getValidatorByAddress } = useAppState()
  const [validator, setValidator] = useState<APIValidator | null>()

  useEffect(() => {
    const getValidator = async () => {
      const _validator = await getValidatorByAddress(address)
      setValidator(_validator)
    }

    getValidator()
  }, [address, getValidatorByAddress, setValidator])

  if (!validator) return fallback

  return children(validator)
}

export const Validator = memo(ValidatorCmp)
