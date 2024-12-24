import { FC } from 'react'
import logo_rose_stake_svg from '/stake/logo_rose_stake.svg?url'

interface Props {
  className?: string
}

export const LogoIcon: FC<Props> = ({ className }) => {
  return <img className={className} height={67} src={logo_rose_stake_svg} />
}
