import { FC } from 'react'
import { UIHeader } from '../Header'
import { UIFooter } from '../Footer'
import { Outlet } from 'react-router-dom'
import { HeaderBreadcrumb } from '../HeaderBreadcrumb'

export const UILayout: FC = () => {
  return (
    <div className="flex flex-col">
      <UIHeader />
      <HeaderBreadcrumb />
      <main>
        <Outlet />
      </main>
      <UIFooter />
    </div>
  )
}
