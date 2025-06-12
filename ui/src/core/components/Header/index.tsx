import { ReactNode, FC, PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import classes from './index.module.css'

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
  return (
    <header className={classes.header}>
      {navLink ?? logo ?? (
        <NavLink className={classes.headerLink} to="/">
          {logo}
        </NavLink>
      )}
      {children}
    </header>
  )
}
