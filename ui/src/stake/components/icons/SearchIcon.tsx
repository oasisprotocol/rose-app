/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import SearchSvg from '@material-design-icons/svg/outlined/search.svg?react'
import { Icon } from '../Icon'
import { IconProps } from '../../types'

export const SearchIcon: FC<IconProps> = props => (
  <Icon {...props}>
    <SearchSvg />
  </Icon>
)
