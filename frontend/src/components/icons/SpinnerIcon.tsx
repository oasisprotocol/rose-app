/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import LoopSvg from '@material-design-icons/svg/outlined/loop.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const SpinnerIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <LoopSvg />
  </Icon>
)
