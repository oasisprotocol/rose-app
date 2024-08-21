import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { AppStateContext, AppStateProviderContext, AppStateProviderState } from './AppStateContext'
import { useMediaQuery } from 'react-responsive'
import { toErrorString } from '../utils/errors'
import { usePrevious } from '../hooks/usePrevious'
import { useWeb3 } from '../hooks/useWeb3'
import { useApi } from '../hooks/useApi'
import { FormattingUtils } from '../utils/formatting.utils'

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
    state: { account },
    getBalance,
    getPendingDelegations,
    getDelegations,
    getUndelegations,
  } = useWeb3()
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
    }

    const fetchAccountData = async () => {
      const [accountBalance, pendingDelegations, delegations, undelegations] = await Promise.all([
        getBalance(),
        getPendingDelegations(),
        getDelegations(),
        getUndelegations(),
      ])

      const totalPendingStake = pendingDelegations.pendings.reduce((acc, { amount }) => acc + amount, 0n)
      const totalStaked = delegations.out_delegations.reduce((acc, { amount }) => acc + amount, 0n)

      const [totalPendingDebondings, totalDebonding, numOfPendingDebondings, numOfDebondings] =
        undelegations.undelegations.reduce(
          (
            [accPendingDebond, accDebonding, accNumOfPendingDebondings, numOfDebondings],
            { costBasis, endReceiptId }
          ) => {
            if (endReceiptId === 0n) {
              return [
                accPendingDebond + costBasis,
                accDebonding,
                accNumOfPendingDebondings + 1,
                numOfDebondings,
              ]
            } else {
              return [
                accPendingDebond,
                accDebonding + costBasis,
                accNumOfPendingDebondings,
                numOfDebondings + 1,
              ]
            }
          },
          [0n, 0n, 0, 0]
        )

      setState(prevState => ({
        ...prevState,
        pendingDelegations,
        delegations,
        undelegations,
        stats: {
          balances: {
            accountBalance,
            totalPendingStake,
            totalStaked,
            totalPendingDebondings,
            totalDebonding,
          },
          numOfItems: {
            numOfPendingStakes: pendingDelegations.pendings.length ?? 0,
            numOfStakes: delegations.out_delegations.length ?? 0,
            numOfPendingDebondings,
            numOfDebondings,
          },
        },
      }))
    }

    if (account) {
      fetchAccountData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    const fetchValidators = async () => {
      const validators = await getValidators()

      setState(prevState => ({ ...prevState, validatorsList: validators }))
    }

    fetchValidators()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }

  return <AppStateContext.Provider value={providerState}>{children}</AppStateContext.Provider>
}
