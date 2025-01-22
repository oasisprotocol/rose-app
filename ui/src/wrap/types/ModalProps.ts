import { MouseEvent } from 'react'

export interface ModalProps {
  isOpen: boolean
  disableBackdropClick?: boolean
  closeModal: (event?: MouseEvent<HTMLElement>) => void
}
