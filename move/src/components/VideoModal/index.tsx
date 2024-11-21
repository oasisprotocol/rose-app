import { FC, ReactNode } from 'react'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'

export interface Props extends ModalProps {
  src: string
  header: string
  body: ReactNode
}

export const VideoModal: FC<Props> = ({ src, header, body, ...modalOpts }) => {
  return (
    <Modal {...modalOpts}>
      <div className={classes.videoModal}>
        <h1>{header}</h1>
        <p className="body">{body}</p>

        <div className={classes.videoContainer}>
          <iframe
            className={classes.video}
            src={`${src}?autoplay=1&mute=1`}
            title={header}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Modal>
  )
}
