import { FC, PropsWithChildren } from 'react'
import classes from './index.module.css'
import { TimesIcon } from '../icons/TimesIcon'
import { WrapModalProps } from '../../types'

export const Modal: FC<PropsWithChildren<WrapModalProps>> = ({
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
          <TimesIcon />
        </button>
        <div className={classes.modalContent}>{children}</div>
      </div>
    </div>
  )
}
