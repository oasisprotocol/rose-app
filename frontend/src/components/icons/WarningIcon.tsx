import { FC } from 'react'
import WarningSvg from '@material-design-icons/svg/filled/warning.svg'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const WarningIcon: FC<IconProps> = ({ width = 124, height = 124, size }) => (
  <Icon width={width} height={height} size={size}>
    <WarningSvg />
  </Icon>
)
