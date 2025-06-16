import { FC, useEffect, useState } from 'react'
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
import { useRouterTransferSDK } from './hooks/useRouterTransferSDK'
import { useNitroSwapAPI } from './hooks/useNitroSwapAPI'
import { Chain } from './types/chains'
import { Token } from './types/tokens'
import { TokenLogo } from './ components/TokenLogo'
import { DESTINATION_CHAIN_ID } from './constants/config'

const TransactionSummary: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">You recieve</span>
        <span className="text-xs font-semibold text-card-foreground">0 $</span>
      </div>

      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Bridge Fee</span>
        <span className="text-xs text-card-foreground">0 $</span>
      </div>

      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Gas Fee</span>
        <span className="text-xs text-card-foreground">0 $</span>
      </div>

      <div className="flex justify-between items-start w-full">
        <span className="text-xs text-muted-foreground">Est. Time</span>
        <span className="text-xs text-card-foreground">1 min</span>
      </div>
    </div>
  )
}

export const App: FC = () => {
  const {
    state: { chains, nativeTokens },
  } = useNitroSwapAPI()
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)

  const destinationChain = chains?.find(chain => chain.chainId === DESTINATION_CHAIN_ID)
  const destinationToken = nativeTokens?.find(token => token.chainId === DESTINATION_CHAIN_ID)

  const { getQuote } = useRouterTransferSDK()

  useEffect(() => {
    const init = async () => {
      const quote = await getQuote({
        sourceChainId: '23294',
        sourceTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        destinationChainId: '1',
        destinationTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        expandedInputAmount: '10000000000000000000000',
        slippageTolerance: 1,
      })

      console.log('quote', quote)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <div className="flex mx-auto">
        <Card className="w-[400px] p-6 space-y-4">
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
                          <TokenLogo chainId={selectedChain?.chainId}></TokenLogo>
                          <span className="text-sm font-medium">{selectedChain?.name}</span>
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
                            onClick={() => setSelectedChain(chain)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <TokenLogo chainId={chain?.chainId}></TokenLogo>
                            <span className="text-sm font-medium">{chain.name}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex">
                    <div className="w-[225px]">
                      <Input placeholder="0" className="rounded-r-none h-10" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex justify-between items-center h-10 px-4 py-2 rounded-r-md rounded-l-none border-l-0 w-[128px]"
                        >
                          <div className="flex items-center gap-2">
                            <TokenLogo token={selectedToken ?? undefined}></TokenLogo>
                            <span className="text-foreground text-sm font-medium uppercase">
                              {selectedToken?.symbol}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[350px]">
                        {nativeTokens?.map(token => (
                          <DropdownMenuItem
                            key={token.symbol}
                            onClick={() => setSelectedToken(token)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <TokenLogo token={token}></TokenLogo>
                            <span className="text-sm font-medium uppercase">{token.symbol}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                  <Input className="rounded-r-none h-10" placeholder="0" />
                </div>
                <Button variant="outline" className="flex justify-start rounded-l-none h-10 w-[128px] px-3">
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

          <TransactionSummary />

          <Button className="w-full">Bridge</Button>
        </Card>
      </div>
    </div>
  )
}
