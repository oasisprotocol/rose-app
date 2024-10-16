import { FC, useEffect, useState } from 'react'
import { Button } from '../Button'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'

interface Props extends ModalProps {
  privateKey: string
}

export const CopyPrivateKeyModal: FC<Props> = ({ privateKey, ...modalOpts }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey)
    setIsCopied(true)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset state on isOpen
  useEffect(() => {
    setIsCopied(false)
  }, [modalOpts.isOpen])

  return (
    <Modal {...modalOpts}>
      <div className={classes.copyPrivateKeyModal}>
        <h1>Your private key</h1>
        <p className="body">
          Below the private key of your Consensus address is shown. Copy the private key and paste it into web wallet
          and gain full control. To keep full access to your wallet we highly recommend you store the full private key,
          in the right order, in a secure location.
        </p>
        <textarea rows={2} value={privateKey} disabled></textarea>
        <Button onClick={copyPrivateKey}>Copy private key</Button>
        {isCopied && <p className={classes.successfullyCopied}>Copied successfully</p>}
      </div>
    </Modal>
  )
}
