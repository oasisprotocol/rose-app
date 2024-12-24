import { ReactNode, FC, PropsWithChildren } from 'react'
import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'
import menu_svg from '@material-design-icons/svg/filled/menu.svg'
import classes from './index.module.css'
import { useSidebarState } from '../../hooks/useSidebarState'

type Props =
  | {
      navLink?: undefined
      logo: ReactNode
    }
  | {
      navLink: ReactNode
      logo?: undefined
    }

export const Header: FC<PropsWithChildren<Props>> = ({ navLink, logo, children }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1023px)' })
  const { setIsOpen } = useSidebarState()

  return (
    <header className={classes.header}>
      {navLink ?? logo ?? (
        <NavLink className={classes.headerLink} to="/">
          {logo}
        </NavLink>
      )}
      {isMobileScreen && (
        <label title="Show sidebar" className={classes.sidebarToggle} onClick={() => setIsOpen(true)}>
          <img src={menu_svg} alt="Show sidebar" width="20" style={{ filter: 'invert(1)' }} />
        </label>
      )}
      {children}
    </header>
  )
}
