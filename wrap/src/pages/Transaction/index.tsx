import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { StringUtils } from '../../utils/string.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { WrapFormType } from '../../utils/types'
import { TransactionBase } from 'viem'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { ExternalLink } from 'lucide-react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

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
    navigate('/wrap/wrapper')
  }

  return (
    <div className="w-full px-8 py-12 flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        {/* mitigate webm black background */}
        <video className="mix-blend-lighten" width="310" height="310" autoPlay muted loop playsInline>
          <source src="https://assets.oasis.io/webm/Oasis-Loader-310x310.webm" type="video/webm" />
        </video>
      </div>
      {status === TransactionStatus.Loading && (
        <Typography variant="h2">
          {action === WrapFormType.WRAP && <>Wrapping</>}
          {action === WrapFormType.UNWRAP && <>Unwrapping</>}
          &nbsp;your tokens
        </Typography>
      )}
      {status === TransactionStatus.Success && (
        <div className="flex flex-col gap-4 text-center">
          <div>
            <Typography variant="h2">Token Wrap Successful</Typography>
            <Typography className="text-muted-foreground text-center">
              You have received {type === TransactionType.WRose && <b>{amount} WROSE</b>}
              {type === TransactionType.Rose && <b>{amount} ROSE</b>}
            </Typography>
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className={cn('text-primary dark:bg-[#021617]', !txUrl && 'w-full')}
              onClick={handleNavigateBack}
            >
              Back to Wrap
            </Button>
            {txUrl && (
              <Button asChild variant="outline" className="text-primary dark:bg-background">
                <a href={txUrl} target="_blank" rel="noopener noreferrer">
                  View on explorer
                  <ExternalLink />
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
      {status === TransactionStatus.Fail && (
        <div className="flex flex-col gap-4 text-center">
          <div>
            <Typography variant="h2">Token Wrap Failed</Typography>
            <Typography className="text-destructive">
              There was an unexpected error. Please try again.
            </Typography>
          </div>
          <Button className="w-full text-primary dark:bg-[#021617]" onClick={handleNavigateBack}>
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}

export const Transaction = withDisconnectedWallet(TransactionCmp)
