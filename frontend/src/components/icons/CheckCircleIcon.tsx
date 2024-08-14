/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import CheckCircleSvg from '@material-design-icons/svg/filled/check_circle.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const CheckCircleIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <CheckCircleSvg />
  </Icon>
)
