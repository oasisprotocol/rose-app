/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { HourGlassBottomIcon } from '../HourGlassBottomIcon'
import classes from './index.module.css'

export const HourglassIcon: FC = () => (
  <HourGlassBottomIcon
    className={classes.hourglassIcon}
    width={24}
    height={24}
    circleOutline
    circleOutlineIconScale={0.5}
  />
)
