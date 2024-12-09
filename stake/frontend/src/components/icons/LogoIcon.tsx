import { FC } from 'react'
import logo_rose_stake_svg from '/logo_rose_stake.svg?url'
import { useAppState } from '../../hooks/useAppState'

interface Props {
  className?: string
}

export const LogoIcon: FC<Props> = ({ className }) => {
  const {
    state: { isMobileScreen },
  } = useAppState()

  return <img className={className} height={isMobileScreen ? 36 : 67} src={logo_rose_stake_svg} />
}
