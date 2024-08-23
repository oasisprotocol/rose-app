import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { AppStateContext, AppStateProviderContext, AppStateProviderState } from './AppStateContext'
import { useMediaQuery } from 'react-responsive'
import { toErrorString } from '../utils/errors'
import { usePrevious } from '../hooks/usePrevious'
import { useWeb3 } from '../hooks/useWeb3'
import { useApi } from '../hooks/useApi'
import { FormattingUtils } from '../utils/formatting.utils'
import { useGrpc } from '../hooks/useGrpc'
import { Delegations, Undelegations } from '../types'
import { NumberUtils } from '../utils/number.utils'
import BigNumber from 'bignumber.js'

const appStateProviderInitialState: AppStateProviderState = {
  appError: '',
  isMobileScreen: false,
  isDesktopScreen: false,
  pendingDelegations: null,
  delegations: null,
  undelegations: null,
  validatorsList: null,
  stats: null,
}

export const AppStateContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { getValidators } = useApi()
  const {
    state: { account, stakingWithoutSigner },
    getAccountBalance,
    getPendingDelegations,
    getDelegations,
    getUndelegations,
  } = useWeb3()
  const { fetchConsensusStatus } = useGrpc()
  const isDesktopScreen = useMediaQuery({ query: '(min-width: 1000px)' })

  const [state, setState] = useState<AppStateProviderState>({
    ...appStateProviderInitialState,
  })
  const previousAccount = usePrevious(account)

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      isDesktopScreen,
      isMobileScreen: !isDesktopScreen,
    }))
  }, [isDesktopScreen])

  const fetchAccountBalance = async () => {
    const accountBalance = await getAccountBalance()
    setState(prevState => ({
      ...prevState,

      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
          accountBalance,
        },
      },
    }))
  }

  const fetchPendingDelegations = async () => {
    const pendingDelegations = await getPendingDelegations()
    const totalPendingStake = pendingDelegations.pendings.reduce((acc, { amount }) => acc + amount, 0n)

    setState(prevState => ({
      ...prevState,
      pendingDelegations,
      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
          numOfPendingStakes: pendingDelegations.pendings.length ?? 0,
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
          totalPendingStake,
        },
      },
    }))
  }

  useEffect(() => {
    if (!stakingWithoutSigner || !account) {
      console.warn(`Skipping pending delegations event listener initialization!`)
      return
    }

    const onDelegateStartFilter = stakingWithoutSigner.filters.OnDelegateStart(account)

    let initialized = false
    const initializePendingDelegationsListener = async () => {
      await stakingWithoutSigner.on(onDelegateStartFilter, fetchPendingDelegations).catch(console.error)
      initialized = true
    }

    initializePendingDelegationsListener()

    return () => {
      if (initialized) {
        stakingWithoutSigner.off(onDelegateStartFilter).catch(console.error)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const fetchDelegations = async () => {
    const delegations = await getDelegations()

    setState(prevState => ({
      ...prevState,
      delegations,
      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
          numOfStakes: delegations.out_delegations.length ?? 0,
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
        },
      },
    }))
  }

  useEffect(() => {
    if (!state.pendingDelegations?.length) return

    if (!stakingWithoutSigner || !account) {
      console.warn(`Skipping delegations event listener initialization!`)
      return
    }

    const onDelegateStartFilter = stakingWithoutSigner.filters.OnDelegateDone(
      // Not sure what TS is complaining about - as array means OR
      state.pendingDelegations.receiptIds as unknown as bigint
    )

    let initialized = false
    const initializeDelegationsListener = async () => {
      await stakingWithoutSigner
        .on(onDelegateStartFilter, () => {
          fetchPendingDelegations()
          fetchDelegations()
        })
        .catch(console.error)
      initialized = true
    }

    initializeDelegationsListener()

    return () => {
      if (initialized) {
        stakingWithoutSigner.off(onDelegateStartFilter).catch(console.error)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pendingDelegations])

  const fetchUndelegations = async () => {
    const undelegations = await getUndelegations()
    const consensusStatus = await fetchConsensusStatus()

    const [numOfPendingDebondings, numOfDebondings, numOfAvailableToClaimDebondings] =
      undelegations.undelegations.reduce(
        (
          [accNumOfPendingDebondings, numOfDebondings, accNumOfAvailableToClaimDebondings],
          { endReceiptId, epoch }
        ) => {
          return [
            endReceiptId === 0n ? accNumOfPendingDebondings + 1 : accNumOfPendingDebondings,
            endReceiptId === 0n ? numOfDebondings : numOfDebondings + 1,
            epoch !== 0n && epoch <= consensusStatus.latest_epoch
              ? accNumOfAvailableToClaimDebondings + 1
              : accNumOfAvailableToClaimDebondings,
          ]
        },
        [0, 0, 0]
      )

    setState(prevState => ({
      ...prevState,
      undelegations,
      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
          numOfPendingDebondings,
          numOfDebondings,
          numOfAvailableToClaimDebondings,
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
        },
      },
    }))
  }

  useEffect(() => {
    if (!state.undelegations?.length) return

    if (!stakingWithoutSigner || !account) {
      console.warn(`Skipping undelegations event listener initialization!`)
      return
    }

    const receiptIds = state.undelegations.undelegations.reduce((acc, { endReceiptId }, i) => {
      const receiptId = state.undelegations!.receiptIds[i]
      if (endReceiptId === 0n) {
        return [...acc, receiptId]
      }
      return acc
    }, [] as bigint[])

    const onUndelegateStartFilter = stakingWithoutSigner.filters.OnUndelegateStart(
      // Not sure what TS is complaining about - as array means OR
      receiptIds as unknown as bigint
    )

    let initialized = false
    const initializeUndelegationsListener = async () => {
      stakingWithoutSigner
        .on(onUndelegateStartFilter, () => {
          fetchUndelegations()
        })
        .catch(console.error)
      initialized = true
    }

    initializeUndelegationsListener()

    return () => {
      if (initialized) {
        stakingWithoutSigner.off(onUndelegateStartFilter).catch(console.error)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.undelegations])

  useEffect(() => {
    if (previousAccount !== null && previousAccount !== account) {
      setState(prevState => ({
        ...prevState,
        accountBalance: null,
        totalStaked: null,
        totalDebonding: null,
        pendingDelegations: null,
        delegations: null,
        undelegations: null,
      }))

      if (stakingWithoutSigner) {
        stakingWithoutSigner.removeAllListeners()
        return
      }
    }

    const fetchAccountData = async () => {
      try {
        await Promise.all([
          fetchAccountBalance(),
          fetchPendingDelegations(),
          fetchDelegations(),
          getUndelegations(),
          fetchUndelegations(),
        ])
      } catch (e) {
        setAppError(e as Error)
      }
    }

    if (account) {
      fetchAccountData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    const fetchValidators = async () => {
      const validatorsList = await getValidators()

      setState(prevState => ({ ...prevState, validatorsList }))
    }

    fetchValidators()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!state.delegations || !state.validatorsList) return

    const calcDelegationsTotalStaked = async (delegations: Delegations) => {
      const validators = await Promise.all(
        delegations.out_delegates.map(to => getValidatorByAddress({ hexAddress: to }))
      )

      const totalStaked = validators
        .reduce((acc, validator, i) => {
          const { shares } = delegations.out_delegations[i]

          return acc.plus(NumberUtils.getAmountFromShares(shares.toString(), validator!))
        }, BigNumber(0))
        .toString(10)

      setState(prevState => ({
        ...prevState,
        stats: {
          numOfItems: {
            ...(prevState.stats?.numOfItems ?? {}),
          },
          balances: {
            ...(prevState.stats?.balances ?? {}),
            totalStaked: BigInt(totalStaked),
          },
        },
      }))
    }

    calcDelegationsTotalStaked(state.delegations)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.delegations, state.validatorsList])

  useEffect(() => {
    if (!state.undelegations || !state.validatorsList) return

    const calcUndelegationsStats = async (undelegations: Undelegations) => {
      const validators = await Promise.all(
        undelegations.undelegations.map(({ from }) => getValidatorByAddress({ hexAddress: from }))
      )

      const [totalPendingDebondings, totalDebonding] = validators.reduce(
        ([accPendingDebond, accDebonding], validator, i) => {
          const { shares, endReceiptId } = undelegations.undelegations[i]

          const amount = NumberUtils.getAmountFromShares(shares.toString(), validator!)
          return [
            endReceiptId === 0n ? accPendingDebond.plus(amount) : accPendingDebond,
            endReceiptId === 0n ? accDebonding : accDebonding.plus(amount),
          ]
        },
        [BigNumber(0), BigNumber(0)]
      )

      setState(prevState => ({
        ...prevState,
        stats: {
          numOfItems: {
            ...(prevState.stats?.numOfItems ?? {}),
          },
          balances: {
            ...(prevState.stats?.balances ?? {}),
            totalPendingDebondings: BigInt(totalPendingDebondings.toString(10)),
            totalDebonding: BigInt(totalDebonding.toString(10)),
          },
        },
      }))
    }

    calcUndelegationsStats(state.undelegations)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.undelegations, state.validatorsList])

  const setAppError = (error: Error | object | string) => {
    if (error === undefined || error === null) return

    setState(prevState => ({
      ...prevState,
      appError: toErrorString(error as Error),
    }))
  }

  const clearAppError = () => {
    setState(prevState => ({
      ...prevState,
      appError: '',
    }))
  }

  const getValidatorByAddress = useCallback(
    async ({ hexAddress, address }: { hexAddress?: string; address?: string }) => {
      if (!hexAddress && !address) {
        return null
      }

      const bech32Address = hexAddress ? await FormattingUtils.toBech32(hexAddress) : address

      if (!state.validatorsList) {
        return null
      }

      const validator = state.validatorsList.validators.find(
        ({ entity_address }) => entity_address === bech32Address
      )
      if (!validator) {
        return null
      }
      return validator
    },
    [state.validatorsList]
  )

  const providerState: AppStateProviderContext = {
    state,
    setAppError,
    clearAppError,
    getValidatorByAddress,
    fetchDelegations,
    fetchUndelegations,
  }

  return <AppStateContext.Provider value={providerState}>{children}</AppStateContext.Provider>
}
