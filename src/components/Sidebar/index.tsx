import launch_svg from '@material-design-icons/svg/filled/launch.svg'
import menu_svg from '@material-design-icons/svg/filled/menu.svg'
import { Logo } from '../icons/Logo.tsx'
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
            <hr />
            <a target="_blank" rel="noopener noreferrer" href="https://wrose.oasis.io/">
              Wrap
              <img src={launch_svg} alt="Open in new tab" width="16" style={{ filter: 'invert(1)' }} />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://wallet.oasis.io/">
              Wallet
              <img src={launch_svg} alt="Open in new tab" width="16" style={{ filter: 'invert(1)' }} />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://global.transak.com/?apiKey=4b66a274-d663-42a8-a495-e1f0e88ce023&productsAvailed=BUY&cryptoCurrencyCode=ROSE&disableWalletAddressForm=false&isFeeCalculationHidden=false&exchangeScreenTitle=Purchase+ROSE+to+your+wallet&themeColor=%2318213c&defaultFiatAmount=100"
            >
              Buy on Transak
              <img src={launch_svg} alt="Open in new tab" width="16" style={{ filter: 'invert(1)' }} />
            </a>
          </div>
        </div>
      </nav>
      <div className={classes.main}>{props.children}</div>
      <label className={classes.backdrop} htmlFor="sidebarCheckbox"></label>
    </div>
  )
}
