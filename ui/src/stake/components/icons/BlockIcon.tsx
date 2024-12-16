/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import BlockSvg from '@material-design-icons/svg/filled/block.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const BlockIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <BlockSvg />
  </Icon>
)
