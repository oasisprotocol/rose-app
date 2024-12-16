import { FC } from 'react'
import logo_rose_stake_svg from '/stake/logo_rose_stake.svg?url'

interface Props {
  isMobileScreen?: boolean
  className?: string
}

export const LogoIcon: FC<Props> = ({ className, isMobileScreen }) => {
  return <img className={className} height={isMobileScreen ? 36 : 67} src={logo_rose_stake_svg} />
}
