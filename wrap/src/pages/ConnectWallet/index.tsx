import { FC } from 'react'
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from '@oasisprotocol/ui-library/src'
import { withConnectedWallet } from '../../hoc/withConnectedWallet'
import { ConnectWalletButton } from '@oasisprotocol/rose-app-ui'

const ConnectWalletCmp: FC = () => {
  return (
    <Card className={'w-[380px]'}>
      <CardHeader>
        <CardTitle>WRAP</CardTitle>

        <CardDescription>
          Quickly wrap your ROSE into wROSE and vice versa with the (un)wrap ROSE tool. Please connect your
          wallet to get started.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <ConnectWalletButton className={'w-full'} />
      </CardFooter>
    </Card>
  )
}

export const ConnectWallet = withConnectedWallet(ConnectWalletCmp)
