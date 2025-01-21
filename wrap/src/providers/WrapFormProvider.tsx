import { FC, PropsWithChildren, useState } from 'react'
import { useWeb3 } from '../hooks/useWeb3'
import { WrapFormType } from '../utils/types'
import { MAX_GAS_LIMIT } from '../constants/config'
import { WrapFormProviderContext, WrapFormProviderState, WrapFormContext } from './WrapFormContext'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'

const wrapFormProviderInitialState: WrapFormProviderState = {
  isLoading: false,
  amount: null,
  formType: WrapFormType.UNWRAP,
  balance: BigNumber(0),
  wRoseBalance: BigNumber(0),
  estimatedFee: BigNumber(0),
  estimatedGasPrice: BigNumber(0),
}

export const WrapFormContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected } = useAccount()
  const { getBalance, getBalanceOfWROSE, wrap, unwrap, getGasPrice } = useWeb3()
  const [state, setState] = useState<WrapFormProviderState>({
    ...wrapFormProviderInitialState,
  })

  const _setIsLoading = (isLoading: boolean) => {
    setState(prevState => ({
      ...prevState,
      isLoading,
    }))
  }

  const init = async () => {
    if (!isConnected) {
      return
    }

    _setIsLoading(true)

    const [balance, wRoseBalance] = await Promise.all([getBalance(), getBalanceOfWROSE()])

    setState(prevState => ({
      ...prevState,
      balance: BigNumber(balance.toString()),
      wRoseBalance: BigNumber(wRoseBalance.toString()),
      isLoading: false,
    }))
  }

  const setAmount = async (amount: BigNumber) => {
    try {
      if (amount.isNaN()) {
        throw new Error('Invalid number')
      }

      const positiveAmountBN = amount.lte(0) ? BigNumber(0) : amount

      setState(prevState => ({
        ...prevState,
        amount: positiveAmountBN,
      }))
    } catch (ex) {
      // Ignore if invalid number
      console.error(ex)
    }
  }

  const setFeeAmount = async () => {
    const estimatedGasPrice = BigNumber((await getGasPrice()).toString())
    const estimatedFee = estimatedGasPrice.multipliedBy(BigNumber(MAX_GAS_LIMIT.toString()))

    setState(prevState => ({
      ...prevState,
      estimatedGasPrice,
      estimatedFee,
    }))
  }

  /**
   * Prevent spamming of fee estimation calculations
   * @param fn
   * @param timeout
   */
  const debounceLeadingSetFeeAmount = (fn = setFeeAmount, timeout = 8000) => {
    let id: ReturnType<typeof setTimeout> | null = null
    return () => {
      if (!id) {
        fn()
      }

      if (id) {
        clearTimeout(id)
      }
      id = setTimeout(() => {
        id = null
      }, timeout)
    }
  }

  const toggleFormType = (amount: BigNumber | null): void => {
    const { balance, wRoseBalance, formType, estimatedFee } = state

    const toggledFormType = formType === WrapFormType.WRAP ? WrapFormType.UNWRAP : WrapFormType.WRAP

    let maxAmount = amount

    if (toggledFormType === WrapFormType.WRAP && amount?.gt(balance)) {
      maxAmount = balance.minus(estimatedFee)
    } else if (toggledFormType === WrapFormType.UNWRAP && amount?.gt(wRoseBalance)) {
      maxAmount = wRoseBalance
    }

    setState(({ ...prevState }) => ({
      ...prevState,
      formType: toggledFormType,
      amount: maxAmount,
    }))
  }

  const submit = async (amount: BigNumber) => {
    if (!amount || amount.lte(0)) {
      return Promise.reject(new Error('Amount is required'))
    }

    _setIsLoading(true)

    const { formType, balance, wRoseBalance, estimatedFee, estimatedGasPrice } = state

    let receipt: unknown | null = null

    if (formType === WrapFormType.WRAP) {
      if (amount.gt(balance.minus(estimatedFee))) {
        _setIsLoading(false)
        return Promise.reject(new Error('Insufficient balance'))
      }

      try {
        receipt = await wrap(amount.toString(), estimatedGasPrice)
      } catch (ex) {
        _setIsLoading(false)
        throw ex
      }
    } else if (formType === WrapFormType.UNWRAP) {
      if (amount.gt(wRoseBalance)) {
        _setIsLoading(false)
        return Promise.reject(new Error('Insufficient balance'))
      }

      try {
        receipt = await unwrap(amount.toString(), estimatedGasPrice)
      } catch (ex) {
        _setIsLoading(false)
        throw ex
      }
    } else {
      _setIsLoading(false)
      return Promise.reject(new Error('[formType] Invalid form type'))
    }

    _setIsLoading(false)
    return receipt
  }

  const providerState: WrapFormProviderContext = {
    state,
    init,
    setFeeAmount,
    debounceLeadingSetFeeAmount,
    setAmount,
    toggleFormType,
    submit,
  }

  return <WrapFormContext.Provider value={providerState}>{children}</WrapFormContext.Provider>
}
