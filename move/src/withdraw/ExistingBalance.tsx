import { FC, useEffect, useState } from 'react'
import loader_blocks_svg from '/move/loader_blocks.svg?url'
import { getBalances } from '../utils/getBalances.ts'
import { withdrawEstimatedFee } from '../utils/oasisConfig.ts'
import classes from './ExistingBalance.module.css'

interface Props {
  consensusAddress: `oasis1${string}`
  sapphireAddress: `0x${string}`
  children: (hasPreviousBalance: boolean, amount: bigint) => React.ReactNode
}

export const ExistingBalance: FC<Props> = ({ consensusAddress, sapphireAddress, children }) => {
  const [balances, setBalances] = useState<Awaited<ReturnType<typeof getBalances>>>()

  useEffect(() => {
    const init = async () => {
      setBalances(await getBalances({ consensusAddress, sapphireAddress }))
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!balances) {
    return (
      <img
        className={classes.existingBalanceLoader}
        src={loader_blocks_svg}
        alt="Please wait..."
        width={106}
      />
    )
  }

  const { consensus, sapphire } = balances
  const amount = consensus.raw * 10n ** 9n + sapphire.raw
  const hasPreviousBalance = amount > withdrawEstimatedFee

  return children(hasPreviousBalance, amount)
}
