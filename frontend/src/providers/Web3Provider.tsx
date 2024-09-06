import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import {
  CHAINS,
  MAX_GAS_LIMIT,
  VITE_NETWORK,
  VITE_STAKING_CONTRACT_ADDRESS,
  VITE_WEB3_GATEWAY,
} from '../constants/config'
import { handleKnownErrors, handleKnownEthersErrors, UnknownNetworkError } from '../utils/errors'
import { Web3Context, Web3ProviderContext, Web3ProviderState } from './Web3Context'
import { useEIP1193 } from '../hooks/useEIP1193'
import { BrowserProvider, EthersError, EventLog, JsonRpcProvider } from 'ethers'
import { Staking, Staking__factory } from '@oasisprotocol/dapp-staker-backend'
import { DefaultReturnType, PendingDelegations, Undelegations } from '../types'
import { consensusDelegate, consensusUndelegate } from '@oasisprotocol/dapp-staker-subcall'

let EVENT_LISTENERS_INITIALIZED = false

const web3ProviderInitialState: Web3ProviderState = {
  isConnected: false,
  browserProvider: null,
  account: null,
  explorerBaseUrl: null,
  chainName: null,
  stakingWithoutSigner: null,
  nativeCurrency: null,
  isInteractingWithChain: false,
}

export const Web3ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    isEIP1193ProviderAvailable,
    connectWallet: connectWalletEIP1193,
    switchNetwork: switchNetworkEIP1193,
  } = useEIP1193()

  const [state, setState] = useState<Web3ProviderState>({
    ...web3ProviderInitialState,
  })

  useEffect(() => {
    setState(prevState => ({ ...prevState, isInteractingWithChain: false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.account])

  const interactingWithChainWrapper = useCallback(
    <Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) =>
      async (...args: Args): Promise<R> => {
        setState(prevState => ({ ...prevState, isInteractingWithChain: true }))
        try {
          return await fn(...args)
        } catch (e) {
          handleKnownEthersErrors(e as EthersError)
          throw e
        } finally {
          setState(prevState => ({ ...prevState, isInteractingWithChain: false }))
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const _connectionChanged = (isConnected: boolean) => {
    setState(prevState => ({
      ...prevState,
      isConnected,
    }))
  }

  const _accountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length <= 0) {
      _connectionChanged(false)
      return
    }

    const [account] = accounts
    setState(prevState => ({
      ...prevState,
      account,
    }))
  }, [])

  const _setNetworkSpecificVars = (chainId: bigint, browserProvider = state.browserProvider!): void => {
    if (!browserProvider) {
      throw new Error('[Web3Context] Sapphire provider is required!')
    }

    if (!CHAINS.has(chainId) || VITE_NETWORK !== chainId) {
      throw new UnknownNetworkError('Unknown network!')
    }

    const { blockExplorerUrls, chainName, nativeCurrency } = CHAINS.get(chainId)!
    const [explorerBaseUrl] = blockExplorerUrls

    setState(prevState => ({
      ...prevState,
      explorerBaseUrl,
      chainName,
      nativeCurrency,
    }))
  }

  const _chainChanged = useCallback(() => {
    if (state.isConnected) {
      window.location.reload()
    }
  }, [state.isConnected])

  const _connect = useCallback(() => _connectionChanged(true), [])
  const _disconnect = useCallback(() => _connectionChanged(false), [])

  const _addEventListenersOnce = useCallback(
    (ethProvider: typeof window.ethereum) => {
      if (EVENT_LISTENERS_INITIALIZED) {
        return
      }

      ethProvider?.on?.('accountsChanged', _accountsChanged)
      ethProvider?.on?.('chainChanged', _chainChanged)
      ethProvider?.on?.('connect', _connect)
      ethProvider?.on?.('disconnect', _disconnect)

      EVENT_LISTENERS_INITIALIZED = true
    },
    [_accountsChanged, _chainChanged, _connect, _disconnect]
  )

  const _init = async (account: string, provider: typeof window.ethereum) => {
    try {
      const browserProvider = new BrowserProvider(provider!)

      const network = await browserProvider.getNetwork()
      _setNetworkSpecificVars(network.chainId, browserProvider)

      const stakingWithoutSigner = Staking__factory.connect(
        VITE_STAKING_CONTRACT_ADDRESS,
        new JsonRpcProvider(VITE_WEB3_GATEWAY, undefined, {
          staticNetwork: true,
        })
      )

      setState(prevState => ({
        ...prevState,
        isConnected: true,
        browserProvider,
        account,
        stakingWithoutSigner,
      }))
    } catch (ex) {
      setState(prevState => ({
        ...prevState,
        isConnected: false,
      }))

      if (ex instanceof UnknownNetworkError) {
        throw ex
      } else {
        throw new Error('[Web3Context] Unable to initialize providers!')
      }
    }
  }

  const isProviderAvailable = async () => {
    return isEIP1193ProviderAvailable()
  }

  const connectWallet = async () => {
    const account = await connectWalletEIP1193()

    if (!account) {
      throw new Error('[Web3Context] Request account failed!')
    }

    await _init(account, window.ethereum)
    _addEventListenersOnce(window.ethereum)
  }

  const switchNetwork = async (chainId = VITE_NETWORK) => {
    return switchNetworkEIP1193(chainId)
  }

  const getTransaction = async (txHash: string) => {
    if (!txHash) {
      throw new Error('[txHash] is required!')
    }

    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const txReceipt = await browserProvider.waitForTransaction(txHash)
    if (txReceipt?.status === 0) throw new Error('Transaction failed')

    return await browserProvider.getTransaction(txHash)
  }

  const getGasPrice = async () => {
    const { browserProvider } = state

    if (!browserProvider) {
      return 0n
    }

    return (await browserProvider.getFeeData()).gasPrice ?? 0n
  }

  const getAccountBalance = async () => {
    const { account, browserProvider } = state

    if (!account || !browserProvider) {
      throw new Error('[Web3Context] Unable to fetch balance!')
    }

    return await browserProvider.getBalance(account)
  }

  const delegate = async (value: bigint, to: string, txSubmittedCb?: () => void) => {
    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const signer = await browserProvider.getSigner()

    const preparedTx = consensusDelegate(to, value)
    const tx = await signer.populateTransaction(preparedTx)
    const txResponse = await signer.sendTransaction(tx)
    txSubmittedCb?.()
    return getTransaction(txResponse.hash)
  }

  const getPendingDelegations = async (): Promise<DefaultReturnType<[PendingDelegations]>> => {
    const { stakingWithoutSigner, account } = state

    if (!stakingWithoutSigner) {
      throw new Error('[stakingWithoutSigner] not initialized!')
    }

    if (!account) {
      throw new Error('[account] not connected!')
    }

    return await stakingWithoutSigner.GetPendingDelegations(account).catch(handleKnownErrors)
  }

  const delegateDone = async (receiptId: bigint) => {
    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const signer = await browserProvider.getSigner()
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    const txResponse = await staking.DelegateDone(receiptId, { gasLimit: MAX_GAS_LIMIT })

    return getTransaction(txResponse.hash)
  }

  const undelegate = async (shares: bigint, from: string, txSubmittedCb?: () => void) => {
    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const signer = await browserProvider.getSigner()

    const preparedTx = consensusUndelegate(from, shares)
    const tx = await signer.populateTransaction(preparedTx)
    const txResponse = await signer.sendTransaction(tx)
    txSubmittedCb?.()
    return getTransaction(txResponse.hash)
  }

  const getUndelegations = async (): Promise<DefaultReturnType<[Undelegations]>> => {
    const { stakingWithoutSigner, account } = state

    if (!stakingWithoutSigner) {
      throw new Error('[stakingWithoutSigner] not initialized!')
    }

    if (!account) {
      throw new Error('[account] not connected!')
    }

    return await stakingWithoutSigner.GetUndelegations(account).catch(handleKnownErrors)
  }

  const getUndelegationReceiptId = async (filterBy?: Partial<Staking.PendingUndelegationStruct>) => {
    const undelegations = await getUndelegations()

    if (!filterBy) return null

    const foundUndelegation = undelegations.undelegations
      .map(({ from, to, shares, costBasis, endReceiptId, epoch }, i) => {
        const receiptId = undelegations.receiptIds[i]
        return {
          from,
          to,
          shares,
          costBasis,
          endReceiptId,
          epoch,
          receiptId,
        }
      })
      .filter(({ endReceiptId }) => endReceiptId === 0n)
      .sort(({ receiptId: receiptIdA, receiptId: receiptIdB }) => {
        if (receiptIdA > receiptIdB) {
          return -1
        } else if (receiptIdA < receiptIdB) {
          return 1
        } else {
          return 0
        }
      })
      .find(undelegation =>
        Object.keys(filterBy).every(k => {
          const key = k as keyof Staking.PendingUndelegationStruct
          return filterBy[key]?.toString().toLowerCase() == undelegation[key].toString().toLowerCase()
        })
      )

    return foundUndelegation?.receiptId ?? null
  }

  const undelegateStart = async (receiptId: bigint, txSubmittedCb?: () => void) => {
    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const signer = await browserProvider.getSigner()
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    const txResponse = await staking.UndelegateStart(receiptId, { gasLimit: MAX_GAS_LIMIT + MAX_GAS_LIMIT })
    txSubmittedCb?.()

    const txReciept = await txResponse.wait()

    const log = txReciept!.logs.find(log => {
      const {
        fragment: { name },
      } = log as EventLog

      return name === staking.filters.OnUndelegateStart.name
    })! as EventLog

    const [, , epoch] = log.args

    return epoch satisfies bigint
  }

  const undelegateDone = async (receiptId: bigint) => {
    const { browserProvider } = state

    if (!browserProvider) {
      throw new Error('[browserProvider] not initialized!')
    }

    const signer = await browserProvider.getSigner()
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    const txResponse = await staking.UndelegateDone(receiptId, { gasLimit: MAX_GAS_LIMIT + MAX_GAS_LIMIT })

    return getTransaction(txResponse.hash)
  }

  const providerState: Web3ProviderContext = {
    state,
    isProviderAvailable,
    connectWallet,
    switchNetwork,
    getTransaction,
    getGasPrice,
    getAccountBalance,
    delegate: interactingWithChainWrapper(delegate),
    getPendingDelegations,
    delegateDone: interactingWithChainWrapper(delegateDone),
    undelegate: interactingWithChainWrapper(undelegate),
    getUndelegations,
    getUndelegationReceiptId,
    undelegateStart: interactingWithChainWrapper(undelegateStart),
    undelegateDone: interactingWithChainWrapper(undelegateDone),
  }

  return <Web3Context.Provider value={providerState}>{children}</Web3Context.Provider>
}
