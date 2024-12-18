import { MouseEvent, FC, PropsWithChildren } from 'react'
import { CancelIcon } from '../icons/CancelIcon'
import classes from './index.module.css'

export interface ModalProps {
  isOpen: boolean
  disableBackdropClick?: boolean
  closeModal: (event?: MouseEvent<HTMLElement>) => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  isOpen,
  disableBackdropClick,
  closeModal,
}) => {
  if (!isOpen) {
    return null
  }

  const handleOverlayClick = () => {
    if (!disableBackdropClick) {
      closeModal()
    }
  }

  return (
    <div className={classes.modalOverlay} onClick={handleOverlayClick}>
      <div className={classes.modal}>
        <button className={classes.modalCloseButton} onClick={closeModal}>
          <CancelIcon />
        </button>
        <div className={classes.modalContent}>{children}</div>
      </div>
    </div>
  )
}
