import { FC, MouseEventHandler } from 'react'
import { ArrowDownUp } from 'lucide-react'

interface Props {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const ToggleButton: FC<Props> = ({ disabled, onClick }) => (
  <button
    className="w-[40px] h-[40px] rounded-md flex items-center justify-center select-none bg-[var(--secondary)] "
    onClick={onClick}
    disabled={disabled}
  >
    <ArrowDownUp size={'16'} strokeWidth={2.5} />
  </button>
)
