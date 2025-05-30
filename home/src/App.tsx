import east_svg from '@material-design-icons/svg/filled/east.svg'
import { NavLink } from 'react-router-dom'
import classes from './App.module.css'
import { Header, Logo } from '@oasisprotocol/rose-app-ui/core'
import { useMediaQuery } from 'react-responsive'

export function App() {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1023px)' })

  return (
    <>
      <Header logo={isMobileScreen && <Logo />} />
      <main className={classes.main}>
        <div className={classes.row}>
          <NavLink to="/discover" className={classes.discover}>
            <h2>Discover</h2>
            <p>Discover the future of Web3 & AI on Oasis.</p>
            <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
          </NavLink>
          <NavLink to="/stake" className={classes.stake}>
            <h2>Stake</h2>
            <p>Stake your ROSE directly from Sapphire using an EVM compatible wallet.</p>
            <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
          </NavLink>
          <NavLink to="/move" className={classes.move}>
            <h2>Move</h2>
            <p>Move your ROSE between any crypto exchange or consensus account and Sapphire.</p>
            <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
          </NavLink>
        </div>
        <div className={classes.row}>
          <NavLink to="/wrap" className={classes.wrap}>
            <h2>Wrap</h2>
            <p>Wrap or unwrap ROSE.</p>
            <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
          </NavLink>
        </div>
      </main>
    </>
  )
}
