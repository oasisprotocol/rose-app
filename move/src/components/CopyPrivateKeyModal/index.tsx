import { FC } from 'react'
import symbol_check_circle_svg from '/symbol_check_circle.svg?url'
import { ButtonWithClickedIndicator } from '../Button/ButtonWithClickedIndicator'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'

interface Props extends ModalProps {
  privateKey: string
}

export const CopyPrivateKeyModal: FC<Props> = ({ privateKey, ...modalOpts }) => {
  return (
    <Modal {...modalOpts}>
      <div className={classes.copyPrivateKeyModal}>
        <h1>Your private key</h1>
        <p className="body">
          Below the private key of your Consensus address is shown. Copy the private key and paste it into web wallet
          and gain full control. To keep full access to your wallet we highly recommend you store the full private key,
          in the right order, in a secure location.
        </p>
        <textarea rows={2} value={privateKey} readOnly></textarea>
        <ButtonWithClickedIndicator
          onClick={() => window.navigator.clipboard.writeText(privateKey)}
          clickedIndicator={
            <>
              <img src={symbol_check_circle_svg} alt="Copied" width="24" />
              &nbsp; Copied
            </>
          }
        >
          Copy private key
        </ButtonWithClickedIndicator>
      </div>
    </Modal>
  )
}
