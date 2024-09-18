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
  delegations: null,
  undelegations: null,
  validatorsList: null,
  stats: null,
}

export const AppStateContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { getValidators } = useApi()
  const {
    state: { account, chainId },
    getAccountBalance,
  } = useWeb3()
  const { fetchDelegations: grpcFetchDelegations, fetchUndelegations: grpcFetchUndelegations } = useGrpc()
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

  const fetchDelegations = async () => {
    const delegations = await grpcFetchDelegations()

    setState(prevState => ({
      ...prevState,
      delegations,
      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
          numOfStakes: delegations.length,
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
        },
      },
    }))

    return delegations
  }

  const fetchUndelegations = async () => {
    const undelegations = await grpcFetchUndelegations()

    setState(prevState => ({
      ...prevState,
      undelegations,
      stats: {
        numOfItems: {
          ...(prevState.stats?.numOfItems ?? {}),
          numOfDebondings: undelegations.length,
        },
        balances: {
          ...(prevState.stats?.balances ?? {}),
        },
      },
    }))

    return undelegations
  }

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
      try {
        await Promise.all([fetchAccountBalance(), fetchDelegations(), fetchUndelegations()])
      } catch (e) {
        setAppError(e as Error)
      }
    }

    if (account) {
      fetchAccountData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const fetchValidators = async () => {
    const validatorsList = await getValidators()

    setState(prevState => ({ ...prevState, validatorsList }))
  }

  useEffect(() => {
    if (chainId) {
      fetchValidators()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

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

  useEffect(() => {
    if (!state.delegations || !state.validatorsList) return

    const calcDelegationsTotalStaked = async (delegations: Delegations) => {
      const validators = await Promise.all(
        delegations.map(({ to }) => getValidatorByAddress({ address: to }))
      )

      const totalStaked = validators
        .reduce((acc, validator, i) => {
          const { shares } = delegations[i]

          return acc.plus(NumberUtils.getAmountFromShares(shares.toString(), validator!, 'staking') ?? 0)
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

    const calcDelegationsTotalStaked = async (undelegations: Undelegations) => {
      const validators = await Promise.all(
        undelegations.map(({ from }) => getValidatorByAddress({ address: from }))
      )

      const totalDebonding = validators
        .reduce((acc, validator, i) => {
          const { shares } = undelegations[i]

          return acc.plus(NumberUtils.getAmountFromShares(shares.toString(), validator!, 'unstaking') ?? 0)
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
            totalDebonding: BigInt(totalDebonding),
          },
        },
      }))
    }

    calcDelegationsTotalStaked(state.undelegations)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.undelegations, state.validatorsList])

  const providerState: AppStateProviderContext = {
    state,
    setAppError,
    clearAppError,
    getValidatorByAddress,
    fetchDelegations,
    fetchUndelegations,
    fetchValidators,
  }

  return <AppStateContext.Provider value={providerState}>{children}</AppStateContext.Provider>
}
