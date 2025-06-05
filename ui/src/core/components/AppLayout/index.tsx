import { Layout } from '@oasisprotocol/ui-library/src/components/ui/layout'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Disc, Layers, Menu, Repeat, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { RainbowKitConnectButton } from '../RainbowKitConnectButton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@oasisprotocol/ui-library/src/components/ui/sheet'
import { useIsMobile } from '@oasisprotocol/ui-library/src/hooks/use-mobile'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'

import classes from './index.module.css'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@oasisprotocol/ui-library/src/components/ui/breadcrumb'
import { NavbarLink } from '../NavbarLink'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@oasisprotocol/ui-library/src/components/ui/sidebar'
import { AppLogo } from '../icons'

const locationListMap: Record<string, string[]> = {
  '/discover': ['Discover'],
  '/stake': ['Stake'],
  '/move': ['Move'],
  '/wrap': ['Wrap'],
  '/': ['Home'],
}

export const AppLayout = () => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const location = useLocation()

  const locationList = Object.entries(locationListMap).find(([path]) =>
    location.pathname.toLowerCase().startsWith(path)
  )?.[1]

  return (
    <Layout
      headerContent={
        <div className="w-full flex justify-between items-center">
          <NavLink to="/">
            <AppLogo />
          </NavLink>

          <div className="hidden md:flex">
            <RainbowKitConnectButton />
          </div>

          <div className="md:hidden">
            <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div>
                  <Button variant="ghost" size="icon" className="hover:cursor-pointer">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="top" className={cn('w-full', classes.navigationMenuContent)}>
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-start px-3 py-2.5">
                    <NavLink to="/" onClick={() => setIsOpen(false)}>
                      <AppLogo />
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

                  <div className="space-y-2.5">
                    <Separator className="bg-border" />
                  </div>

                  <div className="p-2">
                    <RainbowKitConnectButton onMobileClose={() => setIsOpen(false)} />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      }
      headerBreadcrumbsContent={
        !!locationList?.length && (
          <Breadcrumb className="flex px-2">
            <BreadcrumbList>
              {locationList.map((loc, i) => (
                <BreadcrumbItem key={loc + i}>
                  <BreadcrumbLink asChild>
                    <NavLink to={location.pathname} className="text-foreground text-sm font-normal">
                      {loc}
                    </NavLink>
                  </BreadcrumbLink>
                  {i + 1 < locationList.length && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )
      }
      footerContent={
        <div className="w-full flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Copyright @ OASIS {new Date().getFullYear()}</p>

          <div className="flex items-center gap-2.5">
            <p className="text-xs text-muted-foreground">
              <a
                href={`${GITHUB_REPOSITORY_URL}tree/${BUILD_COMMIT}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Version {APP_VERSION}
              </a>
            </p>
            <span className="text-xs text-muted-foreground">|</span>
            <a
              className="text-xs text-muted-foreground"
              href={PRIVACY_POLICY_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      }
      sidebar={
        <Sidebar collapsible="icon" className="border-r !static !h-full">
          <SidebarContent className="bg-sidebar-background">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate('/discover')}
                      variant="ghost"
                      className="w-full justify-start p-2 h-8 rounded-md cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-sidebar-foreground" />
                      Discover
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate('/move')}
                      variant="ghost"
                      className="w-full justify-start p-2 h-8 rounded-md cursor-pointer"
                    >
                      <Repeat className="h-4 w-4 text-sidebar-foreground" />
                      Move
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate('/stake')}
                      variant="ghost"
                      className="w-full justify-start p-2 h-8 rounded-md cursor-pointer"
                    >
                      <Layers className="h-4 w-4 text-sidebar-foreground" />
                      Stake
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate('/wrap')}
                      variant="ghost"
                      className="w-full justify-start p-2 h-8 rounded-md cursor-pointer"
                    >
                      <Disc className="h-4 w-4 text-sidebar-foreground" />
                      Wrap
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      }
    >
      <Outlet />
    </Layout>
  )
}
