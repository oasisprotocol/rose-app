import { LayoutBase } from '../LayoutBase'
import classes from './index.module.css'

export function Layout(props: { header: React.ReactNode; children: React.ReactNode }) {
  return (
    <LayoutBase header={<header className={classes.header}>{props.header}</header>}>
      <section className={classes.mainSection}>{props.children}</section>
    </LayoutBase>
  )
}
