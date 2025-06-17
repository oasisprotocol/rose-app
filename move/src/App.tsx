/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar,
  AvatarImage,
  Button,
  Separator,
  Card,
  CardHeader,
  CardFooter,
} from '@oasisprotocol/ui-library'
import { Wallet, PanelLeft, Video, KeyRound, ReceiptText, ArrowUpDown } from 'lucide-react'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useAccount } from 'wagmi'
import { Deposit } from './deposit/Deposit'
import { useReloadIfAccountSwitched } from './utils/useReloadIfAccountSwitched'
import { Withdraw } from './withdraw/Withdraw'
import { useGenerateConsensusAccount } from './deposit/useGenerateConsensusAccount'
import { useGenerateSapphireAccount } from './withdraw/useGenerateSapphireAccount'

import AvatarConsensus from './components/AvatarConsensus.png'
import AvatarSapphire from './components/AvatarSapphire.png'

export function App() {
  useReloadIfAccountSwitched()
  const sapphireAddress = useAccount().address
  const deposit = useGenerateConsensusAccount()
  const withdraw = useGenerateSapphireAccount()

  // TODO: Layout component for rpc warning
  if (!sapphireAddress) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex flex-1">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center h-16 px-3 md:px-6 border-b">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 md:flex hidden">
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <nav className="text-foreground">
                  <span>Move</span>
                </nav>
              </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 flex items-center justify-center p-3 md:p-0">
              <div className="w-full max-w-[560px] space-y-6">
                {/* Connect Wallet Card */}
                <Card className="border rounded-lg">
                  <CardHeader className="space-y-1.5">
                    <h2 className="text-xl font-semibold text-card-foreground">Move tokens</h2>
                    <p className="text-sm text-muted-foreground">
                      Easily move your ROSE from a crypto exchange or consensus account to Sapphire. Start by
                      connecting your wallet.
                    </p>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </CardFooter>
                  <CardFooter>
                    <ConnectButton />
                  </CardFooter>
                </Card>

                {/* Help Sections */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-1 pr-4 border rounded">
                    <div className="w-14 h-14 bg-accent rounded-sm flex items-center justify-center">
                      <Video className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-foreground">Learn how to use Move</h3>
                      <p className="text-xs text-muted-foreground">Watch this walkthrough to get started.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-1 pr-4 border rounded">
                    <div className="w-14 h-14 bg-accent rounded-sm flex items-center justify-center">
                      <KeyRound className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-foreground">Lost your private key?</h3>
                      <p className="text-xs text-muted-foreground">
                        What to do if you lost your private key.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="h-10 border-t px-6 py-3 flex justify-between items-center text-xs text-muted-foreground">
          <div>Copyright @ OASIS 2025</div>
          <div className="flex items-center gap-2.5">
            <span>Version {APP_VERSION}</span>
            <span>|</span>
            <span>Privacy Policy</span>
          </div>
        </footer>
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumb */}
          <div className="flex items-center h-16 px-3 md:px-6 border-b">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7 md:flex hidden">
                <PanelLeft className="h-4 w-4" />
              </Button>
              <nav className="text-foreground">
                <span>Move</span>
              </nav>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 flex items-center justify-center p-3 md:p-0">
            <Card className="p-6 rounded-default border shadow-sm">
              <div className="flex justify-between items-center gap-6">
                <h2 className="text-xl font-semibold text-card-foreground leading-none -tracking-[0.4px]">
                  Move your $ROSE
                </h2>
                <div className="flex items-center">
                  <Button variant="secondary" size="sm" className="hidden md:flex gap-2">
                    <ReceiptText className="w-4 h-4" />
                    <span>Transactions</span>
                  </Button>
                  <Button variant="secondary" size="icon" className="w-10 h-10 md:hidden">
                    <ReceiptText className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">From</label>
                    <div className="flex items-center gap-2 p-3 border rounded-md">
                      <Avatar className="w-10 h-10 rounded-full bg-background">
                        <AvatarImage src={AvatarConsensus} alt="Avatar" />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-base font-medium text-foreground leading-6">
                          Consensus / Exchange
                        </span>
                        <span className="text-xs text-muted-foreground leading-4">oasis1...</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <Button variant="secondary" size="icon" className="w-10 h-10">
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                    <Separator className="flex-1" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">To</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Avatar className="w-10 h-10 rounded-full bg-background">
                      <AvatarImage src={AvatarSapphire} alt="Avatar" />
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-foreground leading-6">Sapphire</span>
                      <span className="text-xs text-muted-foreground leading-4">0x...</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">Sign In and Move</Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-10 border-t px-6 py-3 flex justify-between items-center text-xs text-muted-foreground">
        <div>Copyright @ OASIS 2025</div>
        <div className="flex items-center gap-2.5">
          <span>Version {APP_VERSION}</span>
          <span>|</span>
          <span>Privacy Policy</span>
        </div>
      </footer>
    </div>
  )
}
