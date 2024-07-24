import { FC, useEffect, useState } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { formatEther, parseEther } from 'ethers'
import { useApi } from '../../hooks/useApi'
import { Validator } from '@oasisprotocol/nexus-api'
import { Staking } from '@oasisprotocol/dapp-staker-backend'
import { EpochTimeEstimate } from '../../components/EpochTimeEstimate'

export const TestPage: FC = () => {
  const {
    state: { account, isConnected },
    getBalance,
    delegate,
    delegateDone,
    getPendingDelegations,
    getDelegations,
    undelegate,
    getUndelegations,
    undelegateStart,
    undelegateDone,
  } = useWeb3()
  const { getValidators } = useApi()

  const [accountBalance, setAccountBalance] = useState(0n)
  const [validators, setValidators] = useState<Validator[] | null>(null)
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)
  const [pendingDelegations, setPendingDelegations] = useState<
    [bigint, Staking.PendingDelegationStructOutput][] | null
  >(null)
  const [delegations, setDelegations] = useState<[string, Staking.DelegationStructOutput][] | null>(null)
  const [undelegations, setUndelegations] = useState<
    [bigint, Staking.PendingUndelegationStructOutput][] | null
  >(null)

  useEffect(() => {
    const init = async () => {
      const balance = await getBalance()
      setAccountBalance(balance)

      const validatorList = await getValidators()

      const _validators = validatorList.validators.filter(({ active }) => !!active)
      setValidators(_validators)

      const _pendingDelegations = await getPendingDelegations()
      const _pendingDelegationsArray = _pendingDelegations.receiptIds.map((receiptId, i) => [
        receiptId,
        _pendingDelegations.pendings[i],
      ]) as [bigint, Staking.PendingDelegationStructOutput][]
      setPendingDelegations(_pendingDelegationsArray)

      const _delegations = await getDelegations()
      const _delegationsArray = _delegations.out_delegates.map((outDelegate, i) => [
        outDelegate,
        _delegations.out_delegations[i],
      ]) as [string, Staking.DelegationStructOutput][]
      setDelegations(_delegationsArray)

      const undelegations = await getUndelegations()
      const _undelegationsArray = undelegations.receiptIds.map((receiptId, i) => [
        receiptId,
        undelegations.undelegations[i],
      ]) as [bigint, Staking.PendingUndelegationStructOutput][]
      setUndelegations(_undelegationsArray)
    }

    if (isConnected) {
      init()
    }
  }, [isConnected, getBalance, getDelegations, getPendingDelegations, getUndelegations, getValidators])

  if (!isConnected) {
    return <>Connect your wallet first</>
  }

  return (
    <div>
      <h1>Test page</h1>

      <div>
        Your account: {account}
        &nbsp;
        {accountBalance >= 0n && <>with balance {formatEther(accountBalance)}</>}
      </div>

      {!!validators?.length && (
        <div>
          {validators.map(validator => (
            <div key={validator.entity_address} onClick={() => setSelectedValidator(validator)}>
              <span
                style={validator.entity_address === selectedValidator?.entity_address ? { color: 'red' } : {}}
              >
                {validator.media?.name}&nbsp;({validator.entity_address})
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        disabled={!selectedValidator}
        onClick={() => {
          if (!selectedValidator) {
            return
          }

          const { entity_address } = selectedValidator
          delegate(parseEther('100'), entity_address)
        }}
      >
        Delegate 100 TEST
      </button>

      {!!pendingDelegations?.length && (
        <>
          <h6>Staked</h6>

          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDelegations?.map(([receiptId, { to, amount }]) => (
                <tr key={receiptId}>
                  <td>{to}</td>
                  <td>{formatEther(amount)}</td>
                  <td>
                    <button
                      onClick={async () => {
                        const transactionResponse = await delegateDone(receiptId)
                        console.log('transactionResponse', transactionResponse)
                      }}
                    >
                      Finish delegation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!!delegations?.length && (
        <>
          <h6>Staking done</h6>

          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {delegations?.map(([to, { amount, shares }]) => (
                <tr key={to + amount.toString()}>
                  <td>{to}</td>
                  <td>{formatEther(amount)}</td>
                  <td>
                    <button
                      onClick={async () => {
                        const transactionResponse = await undelegate(shares, to)
                        console.log('transactionResponse', transactionResponse)
                      }}
                    >
                      Undelegate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!!undelegations?.length && (
        <>
          <h6>Debonding</h6>

          <table>
            <thead>
              <tr>
                <th>To</th>
                <th>Epoch</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {undelegations?.map(([receiptId, { to, costBasis, endReceiptId, epoch }]) => (
                <tr key={receiptId}>
                  <td>{to}</td>
                  <td>
                    {epoch.toString()}
                    <br />
                    <EpochTimeEstimate epoch={epoch} />
                  </td>
                  <td>{formatEther(costBasis)}</td>
                  <td>
                    {endReceiptId === 0n && (
                      <button
                        onClick={async () => {
                          const transactionResponse = await undelegateStart(receiptId)
                          console.log('transactionResponse', transactionResponse)
                        }}
                      >
                        Undelegate start
                      </button>
                    )}
                    {endReceiptId !== 0n && (
                      <button
                        onClick={async () => {
                          const transactionResponse = await undelegateDone(receiptId)
                          console.log('transactionResponse', transactionResponse)
                        }}
                      >
                        Undelegate done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
