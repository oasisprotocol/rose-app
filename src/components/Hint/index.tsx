import classes from './index.module.css'
export function Hint(props: { title: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      {props.children}
      {props.title && (
        <div className={classes.hintWrapper}>
          <div className={classes.hint}>{props.title}</div>
        </div>
      )}
    </div>
  )
}
