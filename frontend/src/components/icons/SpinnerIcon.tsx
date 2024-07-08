import { FC } from 'react'
import LoopSvg from '@material-design-icons/svg/outlined/loop.svg'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const SpinnerIcon: FC<IconProps> = ({ size = 'large', ...restProps }) => (
  <Icon size={size} {...restProps}>
    <LoopSvg />
  </Icon>
)
