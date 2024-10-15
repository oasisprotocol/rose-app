/// <reference types="vite-plugin-svgr/client" />

import { FC } from 'react'
import classes from './index.module.css'
import { IconProps } from '../../../types'
import { CheckIcon } from '../CheckIcon'
import { StringUtils } from '../../../utils/string.utils'

export const SuccessIcon: FC<Pick<IconProps, 'label' | 'className' | 'width' | 'height'>> = ({
  className,
  ...restProps
}) => (
  <CheckIcon
    className={StringUtils.clsx(classes.successIcon, className)}
    width={24}
    height={24}
    circleOutline
    circleOutlineIconScale={0.65}
    {...restProps}
  />
)
