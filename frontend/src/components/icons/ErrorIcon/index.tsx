/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import classes from './index.module.css'
import { IconProps } from '../../../types'
import { CloseIcon } from '../CloseIcon'
import { StringUtils } from '../../../utils/string.utils'

export const ErrorIcon: FC<Pick<IconProps, 'label' | 'className' | 'width' | 'height'>> = ({
  className,
  ...restProps
}) => (
  <CloseIcon
    className={StringUtils.clsx(classes.errorIcon, className)}
    width={24}
    height={24}
    circleOutline
    circleOutlineIconScale={0.65}
    {...restProps}
  />
)
