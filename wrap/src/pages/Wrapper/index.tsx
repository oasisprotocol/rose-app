import { FC, useEffect } from 'react'
import { WrapForm } from '../../components/WrapForm'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WrapFormType } from '../../utils/types'
import { useAccount } from 'wagmi'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { Card, CardHeader, CardDescription, CardTitle } from '@oasisprotocol/ui-library/src/components/card'

const WrapperCmp: FC = () => {
  const { address } = useAccount()
  const {
    state: { formType },
    init,
  } = useWrapForm()

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  return (
    <Card className="w-full max-w-[450px]">
      <CardHeader className="text-xl">
        <CardTitle>
          {formType === WrapFormType.WRAP && 'Wrap'}
          {formType === WrapFormType.UNWRAP && 'Unwrap'}
        </CardTitle>
        <CardDescription>
          Quickly wrap your ROSE into wROSE and vice versa with the (un)wrap ROSE tool.
        </CardDescription>
        <WrapForm />
      </CardHeader>
    </Card>
  )
}

export const Wrapper = withDisconnectedWallet(WrapperCmp)
