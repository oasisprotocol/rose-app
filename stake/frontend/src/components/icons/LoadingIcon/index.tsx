/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { SpinnerIcon } from '../SpinnerIcon'
import classes from './index.module.css'
import { IconProps } from '../../../types'

export const LoadingIcon: FC<Pick<IconProps, 'width' | 'height'>> = ({ width = 106, height = 106 }) => (
  <SpinnerIcon
    className={classes.loadingIcon}
    width={width}
    height={height}
    circleOutline
    circleOutlineIconScale={0.5}
  />
)
