import close_svg from '@material-design-icons/svg/filled/close.svg'
import { ReactNode, useEffect } from 'react'
import { Logo } from '../icons/Logo'
import classes from './index.module.css'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AppStateContextProvider } from '../../providers/SidebarStateProvider'
import { useSidebarState } from '../../hooks/useSidebarState'

interface Props {
  navItem?: ReactNode
}

export function SidebarCmp({ navItem }: Props) {
  const location = useLocation()
  const {
    state: { isOpen },
    setIsOpen,
  } = useSidebarState()

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <div className={classes.sidebarLayout}>
      <input
        type="checkbox"
        id="sidebarCheckbox"
        className={classes.sidebarCheckbox}
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
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
            <NavLink to="/discover" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
              Discover
            </NavLink>
            <NavLink to="/stake" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
              Stake
            </NavLink>
            <NavLink to="/move" className={({ isActive }) => (isActive ? classes.activeLink : '')}>
              Move
            </NavLink>
          </div>
        </div>

        {navItem}
      </nav>
      <div className={classes.main}>
        <Outlet />
      </div>
      <label className={classes.backdrop} htmlFor="sidebarCheckbox"></label>
    </div>
  )
}

export function Sidebar(props: Props) {
  return (
    <AppStateContextProvider>
      <SidebarCmp {...props} />{' '}
    </AppStateContextProvider>
  )
}
