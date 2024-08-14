/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import CloseSvg from '@material-design-icons/svg/filled/close.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const CloseIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <CloseSvg />
  </Icon>
)
