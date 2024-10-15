/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import BlockchainLoadingSvg from './blockchainLoadingIcon.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const BlockchainLoadingIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <BlockchainLoadingSvg />
  </Icon>
)
