import classes from './index.module.css'
export function Hint(props: { title: string; children: React.ReactNode }) {
  return (
    <div>
      {props.children}
      <div className={classes.hintWrapper}>
        <div className={classes.hint}>
          {props.title}
        </div>
      </div>
    </div>
  )
}
