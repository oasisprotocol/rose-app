import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@oasisprotocol/ui-library/src/components/ui/breadcrumb'
import { FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const locationListMap: Record<string, string[]> = {
  '/': ['Home'],
  '/discover': ['Discover'],
  '/stake': ['Stake'],
  '/move': ['Move'],
  '/wrap': ['Wrap'],
}

export const HeaderBreadcrumb: FC = () => {
  const location = useLocation()

  const locationList = locationListMap[location.pathname.toLowerCase()]

  if (!locationList?.length) return null

  return (
    <div className="flex items-center h-12 px-3 border-b border-border">
      <Breadcrumb className="container mx-auto gap-2.5">
        <BreadcrumbList>
          <BreadcrumbItem>
            {locationList.map((loc, i) => (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <NavLink to={location.pathname} className="text-foreground text-sm font-normal">
                    {loc}
                  </NavLink>
                </BreadcrumbLink>
                {i + 1 < locationList.length && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
