import { FC, useEffect } from 'react'
import classes from './index.module.css'
import { WrapButton } from '@oasisprotocol/rose-app-ui/wrap'
import { NumberUtils } from '../../utils/number.utils'
import { WrapForm } from '../../components/WrapForm'
import { useWeb3 } from '../../hooks/useWeb3'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WrapFormType } from '../../utils/types'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'

interface PercentageEntry {
  value: BigNumber
  label: string
}

const percentageList: PercentageEntry[] = [
  {
    label: '10%',
    value: BigNumber(10),
  },
  {
    label: '25%',
    value: BigNumber(25),
  },
  {
    label: '50%',
    value: BigNumber(50),
  },
  {
    label: 'Max',
    value: BigNumber(100),
  },
]

const WrapperCmp: FC = () => {
  const { address } = useAccount()
  const { addTokenToWallet } = useWeb3()
  const {
    state: { isLoading, balance, wRoseBalance, formType, estimatedFee },
    init,
    setAmount,
  } = useWrapForm()

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const handlePercentageCalc = (percentage: BigNumber) => {
    if (formType === WrapFormType.WRAP) {
      if (percentage.eq(100)) {
        /* In case of 100% WRAP, deduct gas fee */
        const percAmount = NumberUtils.getPercentageAmount(balance, percentage)
        setAmount(percAmount.minus(estimatedFee))
      } else {
        setAmount(NumberUtils.getPercentageAmount(balance, percentage))
      }
    } else if (formType === WrapFormType.UNWRAP) {
      setAmount(NumberUtils.getPercentageAmount(wRoseBalance, percentage))
    } else {
      throw new Error('[formType] Invalid form type')
    }
  }

  return (
    <div>
      <div className={classes.subHeader}>
        <p>Quickly wrap your ROSE into wROSE and vice versa with the (un)wrap ROSE tool.</p>

        <WrapButton className={classes.importWRoseBtn} onClick={addTokenToWallet}>
          Import WROSE to Wallet
        </WrapButton>
      </div>

      <div className={classes.amountPercList}>
        {percentageList.map(({ label, value }) => (
          <WrapButton
            disabled={isLoading}
            onClick={() => handlePercentageCalc(value)}
            key={label}
            variant="tertiary"
          >
            {label}
          </WrapButton>
        ))}
      </div>

      <WrapForm />
    </div>
  )
}

export const Wrapper = withDisconnectedWallet(WrapperCmp)
