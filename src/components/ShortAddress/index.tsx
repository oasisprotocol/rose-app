import classes from './index.module.css'

export function ShortAddress({ address }: { address: string }) {
  return (
    <span className={classes.middleEllipsis}>
      <span>{address.slice(0, -8)}</span>
      <span>{address.slice(-8)}</span>
    </span>
  )
}
