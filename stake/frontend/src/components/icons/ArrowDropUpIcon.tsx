/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import ArrowDropUpSvg from '@material-design-icons/svg/outlined/arrow_drop_up.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const ArrowDropUpIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <ArrowDropUpSvg />
  </Icon>
)
