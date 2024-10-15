import launch_svg from '@material-design-icons/svg/filled/launch.svg'
import menu_svg from '@material-design-icons/svg/filled/menu.svg'
import classes from './index.module.css'

export function Sidebar(props: { children: React.ReactNode }) {
  return (
    <div className={classes.sidebarLayout}>
      <button title="Show sidebar" className={classes.sidebarToggle} type="button">
        <img src={menu_svg} alt="Show sidebar" width="24" style={{ filter: 'invert(1)' }} />
      </button>
      <nav className={classes.sidebar}>
        <a href="/" className={classes.logo}>
          <svg xmlns="http://www.w3.org/2000/svg" width="280" height="112" fill="none">
            <title>Oasis Rose Logo</title>
            <path
              d="M115.56 48.65a6.85 6.85 0 0 0-3.77-1.03 6.9 6.9 0 0 0-3.79 1.03 6.76 6.76 0 0 0-2.52 2.96c-.59 1.28-.89 2.8-.89 4.58 0 1.77.3 3.27.9 4.56A6.81 6.81 0 0 0 108 63.7a6.84 6.84 0 0 0 3.79 1.05 6.8 6.8 0 0 0 3.77-1.05 6.96 6.96 0 0 0 2.52-2.96c.6-1.29.9-2.8.9-4.56 0-1.76-.3-3.32-.9-4.6a6.85 6.85 0 0 0-2.52-2.94Zm-.63 10.63c-.3.85-.73 1.5-1.28 1.95a2.89 2.89 0 0 1-3.74 0 4.37 4.37 0 0 1-1.3-1.95 9.1 9.1 0 0 1-.46-3.1c0-1.2.16-2.22.47-3.08.3-.85.74-1.5 1.3-1.96a2.89 2.89 0 0 1 1.87-.67c.7 0 1.32.22 1.86.67.55.46.97 1.1 1.28 1.95.31.85.47 1.88.47 3.1a9.1 9.1 0 0 1-.47 3.09ZM131.56 56.01a6.8 6.8 0 0 0-1.74-.88 20.2 20.2 0 0 0-1.88-.54c-.64-.15-1.22-.31-1.75-.48a3.64 3.64 0 0 1-1.27-.65 1.33 1.33 0 0 1-.47-1.07c0-.62.23-1.09.7-1.42.46-.33 1.06-.5 1.77-.5.49 0 .94.1 1.36.3a2.7 2.7 0 0 1 1.14 1c.14.23.38.38.66.38h2.07c.53 0 .9-.53.71-1.02-.14-.37-.33-.7-.55-1.02a5.68 5.68 0 0 0-2.3-1.85 7.4 7.4 0 0 0-3.1-.64c-1.21 0-2.27.21-3.17.64a5.1 5.1 0 0 0-2.1 1.75c-.5.73-.75 1.56-.75 2.48 0 .92.16 1.62.47 2.2.32.57.74 1.04 1.27 1.38a7.9 7.9 0 0 0 1.75.86c.63.22 1.26.4 1.88.57.63.15 1.2.32 1.74.5.53.19.95.42 1.27.7.31.3.47.67.47 1.14a1.8 1.8 0 0 1-.72 1.52c-.49.37-1.13.55-1.94.55-1 0-1.76-.3-2.28-.88a2.79 2.79 0 0 1-.54-.94c-.1-.3-.4-.5-.71-.5h-1.94c-.5 0-.86.48-.72.97a5.34 5.34 0 0 0 2.75 3.44c.97.5 2.11.76 3.44.76 1.2 0 2.28-.21 3.22-.63a5.4 5.4 0 0 0 2.22-1.73c.54-.74.8-1.6.8-2.58a4.9 4.9 0 0 0-.48-2.34c-.33-.6-.75-1.1-1.28-1.47ZM139.89 60.83v-2.7c0-.44.35-.8.8-.8h4.15a.8.8 0 0 0 .8-.8v-1.25a.8.8 0 0 0-.8-.8h-4.16a.8.8 0 0 1-.8-.8v-2.13c0-.44.36-.8.8-.8h7.1a.8.8 0 0 0 .8-.8V48.7a.8.8 0 0 0-.8-.8h-10.56a.8.8 0 0 0-.8.8v14.98c0 .44.36.8.8.8h10.65a.8.8 0 0 0 .8-.8v-1.25a.8.8 0 0 0-.8-.8h-7.19a.8.8 0 0 1-.8-.8ZM99.85 58.26a.8.8 0 0 1 .24-1.08c.34-.22.62-.47.95-.76.57-.5 1-1.06 1.31-1.67a4.54 4.54 0 0 0-2.45-6.25 7.6 7.6 0 0 0-3.08-.6h-5.93a.8.8 0 0 0-.79.8v14.98c0 .44.35.8.8.8h1.85a.8.8 0 0 0 .8-.8v-4.85c0-.44.34-.79.78-.79h1.21a.8.8 0 0 1 .66.35c.74 1.12 2.84 4.56 3.54 5.7.14.24.4.38.67.38h1.89c.62 0 1-.68.67-1.2l-3.12-5Zm-3.03-7.5c.46 0 .87.08 1.23.26a1.95 1.95 0 0 1 1.19 1.85c0 .46-.12.86-.36 1.2a2.4 2.4 0 0 1-.97.83c-.41.2-.9.3-1.45.3h-2.13a.8.8 0 0 1-.79-.8v-2.85c0-.44.35-.8.8-.8h2.48ZM66.09 34.24c-.1-.06-.22-.1-.33-.16A23.73 23.73 0 0 0 56 32c-13.23 0-24 10.77-24 24a24.04 24.04 0 0 0 24 24 24.02 24.02 0 0 0 24-24 23.92 23.92 0 0 0-13.91-21.76ZM52.17 75.5c-4.96 0-9.7-2.43-13.01-6.66a21.38 21.38 0 0 1 6.68-31.6c.17-.1.35.14.2.28-.6.56-1.17 1.17-1.72 1.8a26 26 0 0 0-6.02 16.61c0 7.93 5.3 16.49 13.87 16.49 7.65 0 13.87-7.4 13.87-16.49 0-4.27-1.44-8.37-3.88-11.4a.14.14 0 0 1 .15-.23c4.13 1.22 7.22 5.98 7.22 11.63 0 5-1.82 9.98-4.98 13.65-3.27 3.82-7.67 5.92-12.38 5.92Zm-3.33-19.57c0-5.66 2.75-10.55 6.7-12.74.48-.27 1.09-.24 1.54.1l.84.6c3.45 2.53 5.6 7.14 5.6 12.05 0 5.66-2.75 10.54-6.69 12.74-.49.27-1.09.24-1.54-.1l-.85-.6c-3.45-2.53-5.6-7.15-5.6-12.05Zm28.7 0c0 8.03-4.45 15.04-11.01 18.69-.18.1-.35-.14-.2-.27.6-.57 1.17-1.17 1.72-1.81a26 26 0 0 0 6.02-16.61c0-7.93-5.3-16.48-13.87-16.48-7.65 0-13.87 7.39-13.87 16.48 0 4.27 1.43 8.37 3.88 11.41.08.11-.02.26-.15.22-4.13-1.22-7.22-5.97-7.22-11.63 0-5 1.81-9.97 4.97-13.64 3.28-3.82 7.68-5.92 12.39-5.92 4.96 0 9.7 2.43 13.02 6.67a21.1 21.1 0 0 1 4.32 12.89Z"
              fill="#70A7FF"
            />
          </svg>
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
    </div>
  )
}
