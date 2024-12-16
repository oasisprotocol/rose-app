import { FC, HTMLAttributes, useId, useLayoutEffect, useRef } from 'react'
import classes from './index.module.css'

interface Props {
  required?: boolean
  label?: string
  error?: string
  className?: string
  initialValue?: string
  pattern?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  onChange: (value?: string) => void
}

export const Input: FC<Props> = ({
  required,
  label,
  error,
  className,
  initialValue,
  pattern,
  inputMode,
  onChange,
}) => {
  const id = useId()
  const ref = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.value = initialValue ?? ''
    }
  }, [initialValue])

  return (
    <div className={className}>
      <div className={classes.input}>
        <label htmlFor={id}>{label}</label>
        <input
          onChange={({ target: { value } }) => {
            onChange?.(value)
          }}
          ref={ref}
          placeholder=" "
          id={id}
          required={required}
          autoComplete="off"
          translate="no"
          pattern={pattern}
          inputMode={inputMode}
        />
      </div>
      {error && <p className={`error ${classes.inputError}`}>{error}</p>}
    </div>
  )
}
