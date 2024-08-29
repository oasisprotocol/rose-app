import { ButtonHTMLAttributes } from 'react'
import classes from './index.module.css'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={props.type ?? 'button'} className={`${classes.button} ${props.className}`}>
      {props.children}
    </button>
  )
}
