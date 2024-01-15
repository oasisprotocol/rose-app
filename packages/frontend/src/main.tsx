import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

import { chains, wagmiConfig } from './wagmistate.js';
import App from './App.js';

import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { ThemeProvider } from "@material-tailwind/react";

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ThemeProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  </StrictMode>
);
