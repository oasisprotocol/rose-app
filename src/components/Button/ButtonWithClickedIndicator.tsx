import { ButtonHTMLAttributes, useState } from 'react'
import { Button } from '.'

export function ButtonWithClickedIndicator(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { clickedIndicator: React.ReactNode },
) {
  const [wasClicked, setWasClicked] = useState(false)
  return (
    <Button
      {...props}
      onClick={async (e) => {
        const result: unknown | Promise<unknown> = props.onClick?.(e)
        await result
        setWasClicked(true)
        setTimeout(() => setWasClicked(false), 500)
      }}
    >
      {wasClicked ? props.clickedIndicator : props.children}
    </Button>
  )
}
