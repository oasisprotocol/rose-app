/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import PriorityHighSvg from '@material-design-icons/svg/filled/priority_high.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const PriorityHighIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <PriorityHighSvg />
  </Icon>
)
