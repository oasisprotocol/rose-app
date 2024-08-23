import { FC, PropsWithChildren, useCallback, useState } from 'react'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import {
  CHAINS,
  MAX_GAS_LIMIT,
  VITE_NETWORK,
  VITE_STAKING_CONTRACT_ADDRESS,
  VITE_WEB3_GATEWAY,
} from '../constants/config'
import { UnknownNetworkError } from '../utils/errors'
import { Web3Context, Web3ProviderContext, Web3ProviderState } from './Web3Context'
import { useEIP1193 } from '../hooks/useEIP1193'
import { BrowserProvider, EventLog, JsonRpcProvider } from 'ethers'
import { Staking, Staking__factory } from '@oasisprotocol/dapp-staker-backend'
import * as oasis from '@oasisprotocol/client'
import { FormattingUtils } from '../utils/formatting.utils'

let EVENT_LISTENERS_INITIALIZED = false

const web3ProviderInitialState: Web3ProviderState = {
  isConnected: false,
  ethProvider: null,
  sapphireEthProvider: null,
  account: null,
  explorerBaseUrl: null,
  chainName: null,
  stakingWithoutSigner: null,
  nativeCurrency: null,
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

  const _setNetworkSpecificVars = (
    chainId: bigint,
    sapphireEthProvider = state.sapphireEthProvider!
  ): void => {
    if (!sapphireEthProvider) {
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
      const ethProvider = new BrowserProvider(provider!)
      const sapphireEthProvider = sapphire.wrap(ethProvider) as BrowserProvider & sapphire.SapphireAnnex

      const network = await sapphireEthProvider.getNetwork()
      _setNetworkSpecificVars(network.chainId, sapphireEthProvider)

      const stakingWithoutSigner = Staking__factory.connect(
        VITE_STAKING_CONTRACT_ADDRESS,
        new JsonRpcProvider(VITE_WEB3_GATEWAY, undefined, {
          staticNetwork: true,
        })
      )

      setState(prevState => ({
        ...prevState,
        isConnected: true,
        ethProvider,
        sapphireEthProvider,
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

    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const txReceipt = await sapphireEthProvider.waitForTransaction(txHash)
    if (txReceipt?.status === 0) throw new Error('Transaction failed')

    return await sapphireEthProvider.getTransaction(txHash)
  }

  const getGasPrice = async () => {
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      return 0n
    }

    return (await sapphireEthProvider.getFeeData()).gasPrice ?? 0n
  }

  const getAccountBalance = async () => {
    const { account, sapphireEthProvider } = state

    if (!account || !sapphireEthProvider) {
      throw new Error('[Web3Context] Unable to fetch balance!')
    }

    return await sapphireEthProvider.getBalance(account)
  }

  const delegate = async (value: bigint, to: string, txSubmittedCb?: () => void) => {
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const signer = sapphire.wrapEthersSigner(await sapphireEthProvider.getSigner())
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    const toBech32 = oasis.staking.addressFromBech32(to)
    const txResponse = await staking.Delegate(toBech32, { value, gasLimit: MAX_GAS_LIMIT })
    txSubmittedCb?.()

    const txReciept = await txResponse.wait()

    const log = txReciept!.logs.find(log => {
      const {
        fragment: { name },
      } = log as EventLog

      return name === staking.filters.OnDelegateStart.name
    })! as EventLog

    const [, , , receiptId] = log.args

    return receiptId satisfies bigint
  }

  const getPendingDelegations = async () => {
    const { stakingWithoutSigner, account } = state

    if (!stakingWithoutSigner) {
      throw new Error('[stakingWithoutSigner] not initialized!')
    }

    if (!account) {
      throw new Error('[account] not connected!')
    }

    return await stakingWithoutSigner.GetPendingDelegations(account)
  }

  const delegateDone = async (receiptId: bigint) => {
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const signer = sapphire.wrapEthersSigner(await sapphireEthProvider.getSigner())
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    return await staking.DelegateDone(receiptId, { gasLimit: MAX_GAS_LIMIT })
  }

  const getDelegations = async () => {
    const { stakingWithoutSigner, account } = state

    if (!stakingWithoutSigner) {
      throw new Error('[stakingWithoutSigner] not initialized!')
    }

    if (!account) {
      throw new Error('[account] not connected!')
    }

    const delegationsCount = await stakingWithoutSigner.GetDelegationsCount(account)
    return await stakingWithoutSigner.GetDelegations(account, 0n, delegationsCount)
  }

  const undelegate = async (shares: bigint, from: string) => {
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const signer = sapphire.wrapEthersSigner(await sapphireEthProvider.getSigner())
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    const fromBech32 = await FormattingUtils.toUint8Array(from)
    return await staking.Undelegate(fromBech32, shares, {
      gasLimit: MAX_GAS_LIMIT + MAX_GAS_LIMIT,
    })
  }

  const getUndelegations = async () => {
    const { stakingWithoutSigner, account } = state

    if (!stakingWithoutSigner) {
      throw new Error('[stakingWithoutSigner] not initialized!')
    }

    if (!account) {
      throw new Error('[account] not connected!')
    }

    return await stakingWithoutSigner.GetUndelegations(account)
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
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const signer = sapphire.wrapEthersSigner(await sapphireEthProvider.getSigner())
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
    const { sapphireEthProvider } = state

    if (!sapphireEthProvider) {
      throw new Error('[sapphireEthProvider] not initialized!')
    }

    const signer = sapphire.wrapEthersSigner(await sapphireEthProvider.getSigner())
    const staking = Staking__factory.connect(VITE_STAKING_CONTRACT_ADDRESS, signer)

    return await staking.UndelegateDone(receiptId, { gasLimit: MAX_GAS_LIMIT + MAX_GAS_LIMIT })
  }

  const providerState: Web3ProviderContext = {
    state,
    isProviderAvailable,
    connectWallet,
    switchNetwork,
    getTransaction,
    getGasPrice,
    getAccountBalance,
    delegate,
    getPendingDelegations,
    delegateDone,
    getDelegations,
    undelegate,
    getUndelegations,
    getUndelegationReceiptId,
    undelegateStart,
    undelegateDone,
  }

  return <Web3Context.Provider value={providerState}>{children}</Web3Context.Provider>
}
