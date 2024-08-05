/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import { CheckIcon } from '../CheckIcon'
import classes from './index.module.css'

export const ActiveIcon: FC = () => (
  <CheckIcon className={classes.activeIcon} width={15} height={15} circleOutline />
)
