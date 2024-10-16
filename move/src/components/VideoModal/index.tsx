import { FC, ReactNode } from 'react'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'

export interface Props extends ModalProps {
  src: string
  header: ReactNode
  body: ReactNode
}

export const VideoModal: FC<Props> = ({ src, header, body, ...modalOpts }) => {
  return (
    <Modal {...modalOpts}>
      <div className={classes.videoModal}>
        <h1>{header}</h1>
        <p className="body">{body}</p>

        {/*biome-ignore lint/a11y/useMediaCaption: Provide captions*/}
        <video autoPlay className={classes.video} controls src={src}></video>
      </div>
    </Modal>
  )
}
