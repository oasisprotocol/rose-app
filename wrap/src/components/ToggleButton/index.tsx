import classes from './index.module.css'
import { FC, MouseEventHandler } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const ToggleButton: FC<Props> = ({ className, disabled, onClick }) => (
  <button className={[className, classes.toggleButton].join(' ')} onClick={onClick} disabled={disabled}>
    <RefreshCw />
  </button>
)
