import '@nomicfoundation/hardhat-toolbox'
import '@typechain/hardhat'
import { HardhatUserConfig } from 'hardhat/config'

const TEST_HDWALLET = {
  mnemonic: 'test test test test test test test test test test test junk',
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: '',
}

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET

const config: HardhatUserConfig = {
  mocha: {
    timeout: 400000,
  },
  paths: {
    tests: './tests',
  },
  solidity: {
    version: '0.8.22',
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
    sapphire_local: {
      url: 'http://localhost:8545',
      accounts,
      chainId: 0x5afd,
    },
    // https://docs.oasis.io/dapp/sapphire/
    sapphire_mainnet: {
      url: 'https://sapphire.oasis.io/',
      accounts,
      chainId: 0x5afe,
    },
    sapphire_testnet: {
      url: 'https://testnet.sapphire.oasis.dev',
      accounts,
      chainId: 0x5aff,
    },
  },
  typechain: {
    target: 'ethers-v6',
    outDir: 'src',
  },
}

export default config
