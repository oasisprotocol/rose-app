/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { WarningIcon } from '../WarningIcon'
import classes from './index.module.css'
import { IconProps } from '../../../types'

export const WarnIcon: FC<Pick<IconProps, 'label'>> = props => (
  <WarningIcon
    className={classes.warnIcon}
    width={24}
    height={24}
    circleOutline
    circleOutlineIconScale={0.65}
    {...props}
  />
)
