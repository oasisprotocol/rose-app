/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { SpinnerIcon } from '../SpinnerIcon'
import classes from './index.module.css'

export const LoadingIcon: FC = () => (
  <SpinnerIcon
    className={classes.loadingIcon}
    width={106}
    height={106}
    circleOutline
    circleOutlineIconScale={0.5}
  />
)
