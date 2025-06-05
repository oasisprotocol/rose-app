import { FC, useState } from 'react'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@oasisprotocol/ui-library/src/components/ui/sheet'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Wallet, Menu } from 'lucide-react'
import { NavbarLink } from '../NavbarLink'
import classes from './index.module.css'
import { Logo } from '../icons'
import { NavLink } from 'react-router-dom'
import { useIsMobile } from '@oasisprotocol/ui-library/src/hooks/use-mobile'

export const UIHeader: FC = () => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="mt-12 md:mt-0 sticky md:static z-50 top-0">
      <nav className="md:h-16 px-3 md:px-6 py-2.5 bg-background border-b border-border shadow-sm flex items-center">
        <div className="container mx-auto flex justify-between items-center">
          <NavLink to="/">
            <Logo />
          </NavLink>

          <div className="hidden md:flex">
            <Button className="h-10 px-4 py-2 gap-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Connect Wallet</span>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:cursor-pointer">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className={cn('w-full', classes.navigationMenuContent)}>
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-start px-3 py-2.5">
                    <NavLink to="/" onClick={() => setIsOpen(false)}>
                      <Logo />
                    </NavLink>
                  </div>
                </SheetHeader>
                <nav className="flex flex-col">
                  <div className="p-2">
                    <NavbarLink to="/discover" onClick={() => setIsOpen(false)}>
                      Discover
                    </NavbarLink>
                    <NavbarLink to="/move" onClick={() => setIsOpen(false)}>
                      Move
                    </NavbarLink>
                    <NavbarLink to="/stake" onClick={() => setIsOpen(false)}>
                      Stake
                    </NavbarLink>
                    <NavbarLink to="/wrap" onClick={() => setIsOpen(false)}>
                      Wrap
                    </NavbarLink>
                  </div>

                  <Button onClick={() => setIsOpen(false)}>Connect Wallet</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
