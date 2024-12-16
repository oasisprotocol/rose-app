import { FC, memo, ReactNode, useEffect, useState } from 'react'
import { Validator as APIValidator } from '@oasisprotocol/nexus-api'
import { useAppState } from '../../hooks/useAppState'
import { RequireAtLeastOne } from '@oasisprotocol/rose-app-ui/stake'

type Props = RequireAtLeastOne<
  {
    hexAddress?: string
    address?: string
    children: (validator: APIValidator) => ReactNode
    fallback?: ReactNode
  },
  'hexAddress' | 'address'
>

const ValidatorCmp: FC<Props> = ({ hexAddress, address, children, fallback = <span>...</span> }) => {
  const { getValidatorByAddress } = useAppState()
  const [validator, setValidator] = useState<APIValidator | null>()

  useEffect(() => {
    const getValidator = async () => {
      const _validator = await getValidatorByAddress({ hexAddress, address })
      setValidator(_validator)
    }

    getValidator()
  }, [address, hexAddress, getValidatorByAddress, setValidator])

  if (!validator) return fallback

  return children(validator)
}

export const Validator = memo(ValidatorCmp)
