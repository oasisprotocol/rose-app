/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import ArrowDropDownSvg from '@material-design-icons/svg/outlined/arrow_drop_down.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const ArrowDropDownIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <ArrowDropDownSvg />
  </Icon>
)
