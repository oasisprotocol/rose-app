/// <reference types="vite-plugin-svgr/client" />

import CancelSvg from '@material-design-icons/svg/filled/cancel.svg?react'
import { FC, MouseEvent, PropsWithChildren, useEffect, useRef } from 'react'
import classes from './index.module.css'

export interface ModalProps {
  isOpen: boolean
  disableBackdropClick?: boolean
  closeModal: (event?: MouseEvent<HTMLElement>) => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({ children, isOpen, disableBackdropClick, closeModal }) => {
  const modalOverlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [isOpen, closeModal])

  if (!isOpen) {
    return null
  }

  const handleOverlayClick = () => {
    if (!disableBackdropClick) {
      closeModal()
    }
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Global listener provided
    <div ref={modalOverlayRef} className={classes.modalOverlay} onClick={handleOverlayClick}>
      {/*biome-ignore lint/a11y/useKeyWithClickEvents: Prevent backdrop propagation*/}
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={classes.modalCloseButton} onClick={closeModal}>
          <CancelSvg />
        </button>
        <div className={classes.modalContent}>{children}</div>
      </div>
    </div>
  )
}
