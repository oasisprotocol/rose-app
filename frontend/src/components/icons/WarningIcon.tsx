/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import WarningSvg from '@material-design-icons/svg/filled/warning.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const WarningIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <WarningSvg />
  </Icon>
)
