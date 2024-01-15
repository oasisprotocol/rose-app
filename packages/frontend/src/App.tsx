import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Chip,
} from "@material-tailwind/react";

import { ObjectEntries } from './utils.js';

/*
Making contexts:
 - https://thoughtbot.com/blog/type-safe-state-modeling-with-typescript-and-react-hooks

*/

import { useAccount, useBalance } from 'wagmi';
import { StakeButton } from './staking.js';


interface TabSpec<T> {
  title: string | JSX.Element;
  heading: JSX.Element;
  body: JSX.Element;
}

function TypedTabPanel<X extends Record<keyof X,TabSpec<keyof X>>> (value: keyof X, tabs: X) {
  const [activeTab, setActiveTab] = useState(value);
  return (
    <div>
      <div>
        {tabs[activeTab].heading}
      </div>
      <Tabs value={activeTab}>
        <TabsHeader>
          {ObjectEntries(tabs).map(([k,o]) => (
            <Tab
              key={String(k)}
              value={String(k)}
              onClick={() => setActiveTab(k)}
              className={k == activeTab ? 'active' : ''}>
                {o.title}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          <TabPanel key={String(activeTab)} value={String(activeTab)}>
            {tabs[activeTab].body}
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}

function AccountBalances () {
  const { address } = useAccount();
  //const roseBalance = useBalance({address})
  // TODO: get delegations
  //const wroseBalance = useBalance({address})

  //console.log(roseBalance.data?.formatted)

  // TODO: use accordian: https://www.material-tailwind.com/docs/react/accordion

  return (
    <div>
      Balances here {address}
    </div>
  );
}

function AccountActives () {
  return 'Active!';
}

function AccountDebonding () {
  return 'Debonding!';
}

function AccountScreen () {
  return (
    <div>
      <header className='flex items-center justify-between flex-wrap p-1'>
        <div className='flex items-center flex-no-shrink mr-6'>
          X Logo
        </div>
        <div className='flex items-center px-3 py-2'>
          <ConnectButton />
        </div>
      </header>
      <div className="max-w-sm">
        {TypedTabPanel('balances', {
          'balances': {
            title: 'Balances',
            heading:  <>
                        <Typography variant="h5">
                          Your Balances
                        </Typography>
                        <Typography variant='paragraph'>Below is an overview of your ROSE and wROSE balances</Typography>
                      </>,
            body: <AccountBalances />
          },
          'active': {
            title:  <div className="flex gap-2">
                      Active
                      <Chip value="2" size="sm" color='green' variant='ghost' />
                    </div>,
            heading:  <>
                        <Typography variant='h5'>Your active delegations</Typography>
                        <Typography variant='paragraph'>Below is an overview of your active delegations</Typography>
                      </>,
            body: <AccountActives />
          },
          'debonding': {
            title:  <div className="flex gap-2">
                      Debonding
                      <Chip value="5" size="sm" color='red' variant='ghost' />
                    </div>,
            heading:  <>
                        <Typography variant='h5'>Your debondings</Typography>
                        <Typography variant='paragraph'>Below is an overview of your current debondings in ROSE</Typography>
                      </>,
            body: <AccountDebonding/>
          },
        })}
      </div>
      <StakeButton />
    </div>
  );
};

function LoggedOutScreen () {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <h2>Staking on Sapphire</h2>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting
         industry. Lorem Ipsum has been the industry's standard dummy text ever
         since the 1500s, when an unknown printer took a galley of type and
         scrambled it to make a type specimen book.</p>

      <ConnectButton label='Connect Wallet' />
    </div>
  );
};

function App () {
  const { isConnected } = useAccount();
  if( isConnected ) {
    return (
      <AccountScreen />
    );
  }
  else {
    return (
      <LoggedOutScreen />
    );
  }
};

export default App;
