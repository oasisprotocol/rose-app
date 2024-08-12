/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import HourGlassBottomSvg from '@material-design-icons/svg/filled/hourglass_bottom.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const HourGlassBottomIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <HourGlassBottomSvg />
  </Icon>
)
