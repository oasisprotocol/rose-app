import { FC } from 'react'
import { StringUtils } from '../../utils/string.utils'
import { ArrowDownIcon } from '../icons/ArrowDownIcon'
import classes from './index.module.css'

interface Props {
  isExpanded?: boolean
  toggleRow: () => void
}

export const ToggleButton: FC<Props> = ({ isExpanded, toggleRow }) => {
  return (
    <button
      className={StringUtils.clsx(classes.toggleBtn, isExpanded ? 'open' : undefined)}
      onClick={toggleRow}
    >
      <ArrowDownIcon />
    </button>
  )
}
