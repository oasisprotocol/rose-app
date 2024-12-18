/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { PriorityHighIcon } from '../PriorityHighIcon'
import classes from './index.module.css'

export const InfoIcon: FC = () => (
  <PriorityHighIcon
    className={classes.infoIcon}
    width={15}
    height={15}
    circleOutline
    circleOutlineIconScale={0.75}
  />
)
