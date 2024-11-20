import menu_svg from '@material-design-icons/svg/filled/menu.svg'
import { Logo } from '../icons/Logo'
import classes from './index.module.css'

export function Sidebar(props: { children: React.ReactNode }) {
  return (
    <div className={classes.sidebarLayout}>
      <input type="checkbox" id="sidebarCheckbox" className={classes.sidebarCheckbox} />
      <label title="Show sidebar" className={classes.sidebarToggle} htmlFor="sidebarCheckbox">
        <img src={menu_svg} alt="Show sidebar" width="24" style={{ filter: 'invert(1)' }} />
      </label>
      <nav className={classes.sidebar}>
        <a href="/" className={classes.logo}>
          <Logo />
        </a>

        <div className={classes.linksWrapper}>
          <div className={classes.links}>
            <a href="/stake/" className={window.location.pathname.startsWith('/stake/') ? classes.activeLink : ''}>
              Stake
            </a>
            <a href="/move/" className={window.location.pathname.startsWith('/move/') ? classes.activeLink : ''}>
              Move
            </a>
          </div>
        </div>
      </nav>
      <div className={classes.main}>{props.children}</div>
      {/*biome-ignore lint/a11y/noLabelWithoutControl: for input[type="checkbox"]*/}
      <label className={classes.backdrop} htmlFor="sidebarCheckbox"></label>
    </div>
  )
}
