import { Button } from '@oasisprotocol/ui-library'
import { Card, CardHeader, CardFooter } from '@oasisprotocol/ui-library'
import { Wallet, PanelLeft, Video, KeyRound } from 'lucide-react'

export function App() {
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
              <div className="h-15 w-8 flex items-center md:flex hidden">
                <div className="h-15 border-r border-border"></div>
              </div>
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
                    <p className="text-xs text-muted-foreground">What to do if you lost your private key.</p>
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
          <span>Version 2.0</span>
          <span>|</span>
          <span>Privacy Policy</span>
        </div>
      </footer>
    </div>
  )
}
