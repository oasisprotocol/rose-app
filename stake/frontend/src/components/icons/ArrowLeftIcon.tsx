/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import ArrowLeftSvg from '@material-design-icons/svg/filled/keyboard_arrow_left.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const ArrowLeftIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <ArrowLeftSvg />
  </Icon>
)
