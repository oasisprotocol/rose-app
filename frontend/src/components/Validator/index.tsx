import { FC, memo, ReactNode, useEffect, useState } from 'react'
import { Validator as APIValidator } from '@oasisprotocol/nexus-api'
import { useAppState } from '../../hooks/useAppState'

interface Props {
  hexAddress: string
  children: (validator: APIValidator) => ReactNode
  fallback?: ReactNode
}

const ValidatorCmp: FC<Props> = ({ hexAddress, children, fallback = <span>...</span> }) => {
  const { getValidatorByAddress } = useAppState()
  const [validator, setValidator] = useState<APIValidator | null>()

  useEffect(() => {
    const getValidator = async () => {
      const _validator = await getValidatorByAddress({ hexAddress })
      setValidator(_validator)
    }

    getValidator()
  }, [hexAddress, getValidatorByAddress, setValidator])

  if (!validator) return fallback

  return children(validator)
}

export const Validator = memo(ValidatorCmp)
