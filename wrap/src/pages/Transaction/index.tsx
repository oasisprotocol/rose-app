import { FC, useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { OpenInNewIcon } from '../../components/icons/OpenInNewIcon'
import classes from './index.module.css'
import { Spinner } from '../../components/Spinner'
import { StringUtils } from '../../utils/string.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { WrapFormType } from '../../utils/types'
import { withConnectedWallet } from '../../hoc/withConnectedWallet'
import { TransactionBase } from 'viem'

enum TransactionStatus {
  Loading,
  Success,
  Fail,
}

enum TransactionType {
  Rose,
  WRose,
}

const TransactionCmp: FC = () => {
  const navigate = useNavigate()
  const { txHash } = useParams()
  const [searchParams] = useSearchParams()
  const amount = searchParams.get('amount') ?? null
  const action: WrapFormType = (searchParams.get('action') as WrapFormType) ?? WrapFormType.WRAP
  const {
    state: { explorerBaseUrl },
    getTransaction,
  } = useWeb3()
  const [status, setStatus] = useState(TransactionStatus.Loading)
  const [type, setType] = useState<TransactionType | null>(null)

  useEffect(() => {
    const init = async () => {
      if (!txHash) {
        navigate('/')
      }

      try {
        const tx = (await getTransaction(txHash! as `0x${string}`)) as TransactionBase

        if (tx.value > 0) {
          setType(TransactionType.WRose)
        } else {
          setType(TransactionType.Rose)
        }

        setStatus(TransactionStatus.Success)
      } catch (ex) {
        setStatus(TransactionStatus.Fail)
      }
    }

    init()
  }, [getTransaction, navigate, txHash])

  const txUrl = explorerBaseUrl && txHash ? StringUtils.getTransactionUrl(explorerBaseUrl, txHash) : undefined

  const handleNavigateBack = () => {
    navigate('/wrapper')
  }

  return (
    <>
      {status === TransactionStatus.Loading && (
        <div>
          <div className={classes.spinnerContainer}>
            <Spinner />
          </div>
          <h3 className={classes.subHeader}>
            {action === WrapFormType.WRAP && <>Wrapping</>}
            {action === WrapFormType.UNWRAP && <>Unwrapping</>}
            &nbsp;your tokens
          </h3>
        </div>
      )}
      {status === TransactionStatus.Success && (
        <div>
          <p className={classes.h100}>&#x1F389;</p>
          <h3 className={classes.subHeader}>
            Congrats!
            <br />
            You received
            {type === TransactionType.WRose && <b>&nbsp;{amount} WROSE</b>}
            {type === TransactionType.Rose && <b>&nbsp;{amount} ROSE</b>}
          </h3>

          {txUrl && (
            <a className={classes.noUnderlineLink} href={txUrl} target="_blank" rel="noopener noreferrer">
              <Button className={classes.openInExplorerBtn} fullWidth>
                View on explorer
                <OpenInNewIcon />
              </Button>
            </a>
          )}
          <Button variant="secondary" onClick={handleNavigateBack} fullWidth>
            Close
          </Button>
        </div>
      )}
      {status === TransactionStatus.Fail && (
        <div>
          <p className={classes.h100}>&#x2755;</p>
          <h3 className={classes.subHeader}>
            There was an unexpected error.
            <br />
            Please try again.
          </h3>

          <Button onClick={handleNavigateBack} fullWidth>
            Retry
          </Button>
        </div>
      )}
    </>
  )
}

export const Transaction = withConnectedWallet(TransactionCmp)
