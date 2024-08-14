/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { CloseIcon } from '../CloseIcon'
import classes from './index.module.css'

export const InactiveIcon: FC = () => (
  <CloseIcon className={classes.inactiveIcon} width={15} height={15} circleOutline />
)
