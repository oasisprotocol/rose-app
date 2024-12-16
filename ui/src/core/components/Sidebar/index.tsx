import close_svg from '@material-design-icons/svg/filled/close.svg'
import menu_svg from '@material-design-icons/svg/filled/menu.svg'
import { PropsWithChildren, ReactNode } from 'react'
import { Logo } from '../icons/Logo'
import classes from './index.module.css'
import { NavLink, Outlet } from 'react-router-dom'

interface Props {
  navItem?: ReactNode
}

export function Sidebar({ navItem }: Props) {
  return (
    <div className={classes.sidebarLayout}>
      <input type="checkbox" id="sidebarCheckbox" className={classes.sidebarCheckbox} />
      <label title="Show sidebar" className={classes.sidebarToggle} htmlFor="sidebarCheckbox">
        <img src={menu_svg} alt="Show sidebar" width="20" style={{ filter: 'invert(1)' }} />
      </label>
      <nav className={classes.sidebar}>
        <div className={classes.sidebarHeader}>
          <NavLink to="/" className={classes.logo}>
            <Logo />
          </NavLink>
          <label title="Hide sidebar" className={classes.mobileSidebarClose} htmlFor="sidebarCheckbox">
            <img src={close_svg} alt="Hide sidebar" width="20" />
          </label>
        </div>
        <hr />

        <div className={classes.linksWrapper}>
          <div className={classes.links}>
            <NavLink to="/stake" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
              Stake
            </NavLink>
            <NavLink
              to="/move"
              className={window.location.pathname.startsWith('/#/move/') ? classes.activeLink : ''}
            >
              Move
            </NavLink>
          </div>
        </div>

        {navItem}
      </nav>
      <div className={classes.main}>
        <Outlet />
      </div>
      {/*biome-ignore lint/a11y/noLabelWithoutControl: for input[type="checkbox"]*/}
      <label className={classes.backdrop} htmlFor="sidebarCheckbox"></label>
    </div>
  )
}
