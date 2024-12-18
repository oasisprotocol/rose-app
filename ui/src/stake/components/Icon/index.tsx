import { cloneElement, FC, ReactElement, SVGProps } from 'react'
import { IconSize, IconProps } from '../../types'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'

interface Props extends IconProps {
  children: ReactElement
}

const sizeMap: Record<IconSize, Partial<SVGProps<SVGSVGElement>>> = {
  small: {
    width: 14,
    height: 14,
  },
  medium: {
    width: 30,
    height: 30,
  },
  large: {
    width: 64,
    height: 64,
  },
  xlarge: {
    width: 100,
    height: 100,
  },
}

export const Icon: FC<Props> = ({
  children,
  size = 'medium',
  width,
  height,
  circleOutline,
  className,
  circleOutlineIconScale = 0.75,
  label,
}) => {
  const svg = cloneElement(children, {
    ...(sizeMap[size] ? sizeMap[size] : {}),
    ...(width
      ? { width: circleOutline ? parseFloat(width.toString()) * circleOutlineIconScale : width }
      : {}),
    ...(height
      ? { height: circleOutline ? parseFloat(height.toString()) * circleOutlineIconScale : height }
      : {}),
  })

  if (!circleOutline) {
    return svg
  }

  return (
    <span
      style={{ width, height }}
      className={StringUtils.clsx(className, classes.icon, !label ? classes.hideAfter : undefined)}
      data-label={label}
    >
      {svg}
    </span>
  )
}
