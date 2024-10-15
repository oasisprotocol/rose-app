/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import ArrowDownSvg from '@material-design-icons/svg/filled/keyboard_arrow_down.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const ArrowDownIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <ArrowDownSvg />
  </Icon>
)
