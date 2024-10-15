/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import MenuBookSvg from '@material-design-icons/svg/outlined/menu_book.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const MenuBookIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <MenuBookSvg />
  </Icon>
)
