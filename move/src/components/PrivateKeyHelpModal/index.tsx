import { FC } from 'react'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'

export const PrivateKeyHelpModal: FC<ModalProps> = (modalOpts) => {
  return (
    <Modal {...modalOpts}>
      <div className={classes.privateKeyHelpModal}>
        <h1>Lost your private key?</h1>
        <p className="body">
          Please take immediate action if you suspect that the private key of the created Consensus address has been
          lost or compromised.
          <br />
          <br />
          To protect your assets, stop using the compromised account right away. Create a new wallet in MetaMask, which
          will generate a new Consensus address and private key, avoiding the risk for the assets to be stolen.
        </p>
      </div>
    </Modal>
  )
}
