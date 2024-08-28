/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import TokenSvg from '@material-design-icons/svg/outlined/blur_circular.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const TokenIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <TokenSvg />
  </Icon>
)
