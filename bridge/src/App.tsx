import { FC, useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Input } from '@oasisprotocol/ui-library/src/components/ui/input'
import { Card } from '@oasisprotocol/ui-library/src/components/ui/card'
import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@oasisprotocol/ui-library/src/components/ui/dropdown-menu'
import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { useRouterPathfinder } from './hooks/useRouterPathfinder'
import { useNitroSwapAPI } from './hooks/useNitroSwapAPI'
import { Chain } from './types/chains'
import { Token } from './types/tokens'
import { TokenLogo } from './components/TokenLogo'
import { DESTINATION_CHAIN_ID } from './constants/config'
import { QuoteResponse } from '@oasisprotocol/router-pathfinder-api'
import { getErc20Balance } from './contracts/erc-20'
import { GetBalanceReturnType } from 'wagmi/actions'
import { useAccount, useGasPrice } from 'wagmi'
import { FormatUtils } from './utils/format.utils'
import { NumberUtils } from './utils/number.utils'

const bridgeFormSchema = z.object({
  sourceChain: z
    .object({
      chainId: z.string(),
      name: z.string(),
    })
    .refine(val => val.chainId !== '', { message: 'Source chain is required' }),
  sourceToken: z
    .object({
      symbol: z.string(),
      chainId: z.string(),
    })
    .refine(val => val.symbol !== '', { message: 'Source token is required' }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(val => NumberUtils.isValidAmount(val), {
      message: 'Amount must be a valid positive number',
    }),
  destinationChain: z
    .object({
      chainId: z.string(),
      name: z.string(),
    })
    .refine(val => val.chainId !== '', { message: 'Destination chain is required' }),
  destinationToken: z
    .object({
      symbol: z.string(),
      chainId: z.string(),
    })
    .refine(val => val.symbol !== '', { message: 'Destination token is required' }),
})

type BridgeFormData = z.infer<typeof bridgeFormSchema>

interface TokenWithBalance extends Token {
  balance: GetBalanceReturnType | null
  isLoadingBalance?: boolean
}

interface TransactionSummaryProps {
  quote: QuoteResponse | null
  selectedChain?: Chain
  selectedChainNativeToken?: Token
  isLoading?: boolean
}

const TransactionSummary: FC<TransactionSummaryProps> = ({
  quote,
  isLoading,
  selectedChain,
  selectedChainNativeToken,
}) => {
  const { data: gasPrice, isLoading: isLoadingGasPrice } = useGasPrice({
    chainId: Number(selectedChain?.chainId),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">You receive</span>
        <span className="text-xs font-semibold text-card-foreground">
          {FormatUtils.formatLoadingState(isLoading, FormatUtils.formatOutputAmount(quote))}
        </span>
      </div>
      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Bridge Fee</span>
        <span className="text-xs text-card-foreground">
          {FormatUtils.formatLoadingState(isLoading, FormatUtils.formatTokenAmount(quote?.bridgeFee || null))}
        </span>
      </div>
      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Gas Fee</span>
        <span className="text-xs text-card-foreground">
          {FormatUtils.formatLoadingState(
            isLoading || isLoadingGasPrice,
            FormatUtils.formatGasFee(quote, selectedChain || null, selectedChainNativeToken || null, gasPrice)
          )}
        </span>
      </div>
      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Est. Time</span>
        <span className="text-xs text-card-foreground">
          {FormatUtils.formatLoadingState(
            isLoading,
            quote?.estimatedTime ? FormatUtils.formatTime(quote.estimatedTime) : '-/-'
          )}
        </span>
      </div>
    </div>
  )
}

export const App: FC = () => {
  const { address } = useAccount()
  const {
    state: { chains, nativeTokens },
    getToken,
  } = useNitroSwapAPI()
  const { getQuote, executeTransaction } = useRouterPathfinder()

  const [selectedChainTokens, setSelectedChainTokens] = useState<TokenWithBalance[] | null>(null)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)

  const destinationChain = chains?.find(chain => chain.chainId === DESTINATION_CHAIN_ID)
  const destinationToken = nativeTokens?.find(token => token.chainId === DESTINATION_CHAIN_ID)

  const form = useForm<BridgeFormData>({
    resolver: zodResolver(bridgeFormSchema),
    defaultValues: {
      sourceChain: { chainId: '', name: '' },
      sourceToken: { symbol: '', chainId: '' },
      amount: '',
      destinationChain: destinationChain
        ? { chainId: destinationChain.chainId, name: destinationChain.name }
        : { chainId: '', name: '' },
      destinationToken: destinationToken
        ? { symbol: destinationToken.symbol, chainId: destinationToken.chainId }
        : { symbol: '', chainId: '' },
    },
  })

  const {
    watch,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = form

  const watchedValues = watch()

  const currentMaxAmount = useMemo(() => {
    return selectedChainTokens?.find(
      (token): token is TokenWithBalance => token.symbol === watchedValues.sourceToken?.symbol
    )?.balance
  }, [selectedChainTokens, watchedValues.sourceToken?.symbol])

  // Custom validation for amount based on balance using safe BigNumber comparison
  useEffect(() => {
    const amount = watchedValues.amount
    if (amount && currentMaxAmount) {
      if (NumberUtils.isGreaterThan(amount, currentMaxAmount.value.toString())) {
        setError('amount', {
          type: 'manual',
          message: `Amount cannot exceed balance (${currentMaxAmount.formatted})`,
        })
      } else {
        clearErrors('amount')
      }
    } else {
      clearErrors('amount')
    }
  }, [watchedValues.amount, currentMaxAmount, setError, clearErrors])

  useEffect(() => {
    if (destinationChain && destinationToken) {
      setValue('destinationChain', { chainId: destinationChain.chainId, name: destinationChain.name })
      setValue('destinationToken', { symbol: destinationToken.symbol, chainId: destinationToken.chainId })
    }
  }, [destinationChain, destinationToken, setValue])

  useEffect(() => {
    const sourceChain = watchedValues.sourceChain
    if (!sourceChain?.chainId) {
      setSelectedChainTokens(null)
      setValue('sourceToken', { symbol: '', chainId: '' })
      return
    }

    const getTokensByChainId = async () => {
      try {
        const { data } = await getToken({
          chainId: sourceChain.chainId,
          isReserved: true,
        })

        const tokensWithBalance: TokenWithBalance[] = data.map(token => ({
          ...token,
          balance: null,
          isLoadingBalance: true,
        }))

        setSelectedChainTokens(tokensWithBalance)

        for (let i = 0; i < tokensWithBalance.length; i++) {
          const token = tokensWithBalance[i]
          try {
            const balance = await getErc20Balance(token.address as `0x${string}`, address!)

            setSelectedChainTokens(
              prev =>
                prev?.map(t =>
                  t.address === token.address ? { ...t, balance, isLoadingBalance: false } : t
                ) || null
            )
          } catch (error) {
            console.error(`Error fetching balance for ${token.symbol}:`, error)
          }
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
        setSelectedChainTokens(null)
      }
    }

    getTokensByChainId()
  }, [watchedValues.sourceChain.chainId, getToken, setValue, watchedValues.sourceChain, address])

  useEffect(() => {
    const { sourceChain, sourceToken, amount, destinationChain, destinationToken } = watchedValues

    setQuote(null)

    if (
      !sourceChain?.chainId ||
      !sourceToken?.symbol ||
      !amount ||
      !destinationChain?.chainId ||
      !destinationToken?.symbol
    ) {
      return
    }

    if (!NumberUtils.isValidAmount(amount)) {
      return
    }

    const fetchQuote = async () => {
      setIsLoadingQuote(true)
      try {
        const selectedSourceToken = selectedChainTokens?.find(token => token.symbol === sourceToken.symbol)

        if (!selectedSourceToken) {
          console.error('Source token not found')
          return
        }

        const selectedDestinationToken = destinationToken
          ? nativeTokens?.find(
              token => token.symbol === destinationToken.symbol && token.chainId === destinationChain.chainId
            )
          : null

        if (!selectedDestinationToken) {
          console.error('Destination token not found')
          return
        }

        const expandedAmount = NumberUtils.expandAmount(amount, selectedSourceToken.decimals)

        const quoteResponse = await getQuote({
          fromTokenChainId: sourceChain.chainId,
          fromTokenAddress: selectedSourceToken.address,
          toTokenChainId: destinationChain.chainId,
          toTokenAddress: selectedDestinationToken.address,
          amount: expandedAmount,
          slippageTolerance: 2,
          destFuel: 0,
        })

        console.log('quote', quoteResponse)
        setQuote(quoteResponse)
      } catch (error) {
        console.error('Error fetching quote:', error)
        setQuote(null)
      } finally {
        setIsLoadingQuote(false)
      }
    }

    const timeoutId = setTimeout(fetchQuote, 500)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchedValues.sourceChain.chainId,
    watchedValues.sourceToken.symbol,
    watchedValues.amount,
    watchedValues.destinationChain.chainId,
    watchedValues.destinationToken.symbol,
    selectedChainTokens,
    nativeTokens,
    getQuote,
  ])

  const onSubmit = () => {
    if (!quote) return

    executeTransaction(quote)
  }

  const handleChainSelect = (chain: Chain) => {
    setValue('sourceChain', { chainId: chain.chainId, name: chain.name })
  }

  const handleTokenSelect = (token: TokenWithBalance) => {
    setValue('sourceToken', { symbol: token.symbol, chainId: token.chainId })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = FormatUtils.formatNumberInput(e.target.value)
    setValue('amount', formatted)
  }

  const handleMaxClick = () => {
    const selectedToken = selectedChainTokens?.find(
      token => token.symbol === watchedValues.sourceToken?.symbol
    )
    if (selectedToken?.balance) {
      setValue('amount', selectedToken.balance.formatted)
    }
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex mx-auto">
        <Card className="w-[400px] p-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-6">
                <div className="space-y-2 rounded">
                  <div className="space-y-2">
                    <div className="space-y-3">
                      <p className="block text-sm font-medium text-foreground">From</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-10">
                          <div className="flex items-center gap-2">
                            <TokenLogo chainId={watchedValues.sourceChain?.chainId}></TokenLogo>
                            <span className="text-sm font-medium">
                              {watchedValues.sourceChain?.name || 'Select Chain'}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[350px]">
                        {chains
                          ?.filter(chain => chain.chainId !== DESTINATION_CHAIN_ID)
                          .map(chain => (
                            <DropdownMenuItem
                              key={chain.chainId}
                              onClick={() => handleChainSelect(chain)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <TokenLogo chainId={chain?.chainId}></TokenLogo>
                              <span className="text-sm font-medium">{chain.name}</span>
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {errors.sourceChain && (
                      <p className="text-xs text-red-500">{errors.sourceChain.message}</p>
                    )}

                    <div className="flex">
                      <div className="w-[225px] relative">
                        <Input
                          placeholder="0"
                          className="rounded-r-none h-10 pr-12"
                          value={watchedValues.amount}
                          onChange={handleAmountChange}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2 text-xs"
                          onClick={handleMaxClick}
                          disabled={!currentMaxAmount}
                        >
                          MAX
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex justify-between items-center h-10 px-4 py-2 rounded-r-md rounded-l-none border-l-0 w-[128px]"
                          >
                            <div className="flex items-center gap-2">
                              <TokenLogo
                                token={selectedChainTokens?.find(
                                  t => t.symbol === watchedValues.sourceToken?.symbol
                                )}
                              ></TokenLogo>
                              <span className="text-foreground text-sm font-medium uppercase">
                                {watchedValues.sourceToken?.symbol || 'Token'}
                              </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[350px]">
                          {selectedChainTokens?.map(token => (
                            <DropdownMenuItem
                              key={token.symbol}
                              onClick={() => handleTokenSelect(token)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <TokenLogo token={token}></TokenLogo>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium uppercase">{token.symbol}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Balance:{' '}
                                    {FormatUtils.formatBalance(token.balance, token.isLoadingBalance)}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                    {errors.sourceToken && (
                      <p className="text-xs text-red-500">{errors.sourceToken.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Separator className="flex-1" />
                  <Button variant="secondary" size="icon" className="h-10 w-10">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Separator className="flex-1" />
                </div>
              </div>

              <div className="space-y-2 rounded">
                <div className="space-y-2">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">To</p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-10 px-4 py-2 flex items-center justify-start w-full pointer-events-none"
                  >
                    <div className="flex items-center gap-2">
                      <TokenLogo chainId={destinationChain?.chainId}></TokenLogo>
                      <span className="text-foreground text-sm font-medium">{destinationChain?.name}</span>
                    </div>
                  </Button>
                </div>
                <div className="flex">
                  <div className="w-[225px]">
                    <Input
                      className="rounded-r-none h-10 pointer-events-none"
                      placeholder="0"
                      value={FormatUtils.formatDestinationAmount(quote)}
                      readOnly
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="flex justify-start rounded-l-none h-10 w-[128px] px-3 cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <TokenLogo token={destinationToken ?? undefined}></TokenLogo>
                      <span className="text-foreground text-sm font-medium uppercase">
                        {destinationToken?.symbol}
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <TransactionSummary
              quote={quote}
              isLoading={isLoadingQuote}
              selectedChain={chains?.find(chain => chain.chainId === watchedValues.sourceChain?.chainId)}
              selectedChainNativeToken={nativeTokens?.find(token => token.chainId)}
            />

            <Button type="submit" className="w-full">
              Bridge
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
