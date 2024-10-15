import { describe, beforeAll, test, expect } from 'vitest'
import { HDNodeWallet, JsonRpcProvider, parseEther, Wallet } from 'ethers'
import { consensusDelegate, consensusUndelegate, getDelegations, getUndelegations } from '../dist'

// XMLHttpRequest module not defined, due to Node.js environment
global.XMLHttpRequest = require('xhr2')

const TEST_PHRASE = 'test test test test test test test test test test test junk'
const STAKE_TO_ADDRESS = 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha'
const LOCALNET_URL = 'http://localhost:8545'

describe('Subcall', () => {
  let signer: HDNodeWallet
  let signerAddress: string

  beforeAll(async () => {
    const wallet = Wallet.fromPhrase(TEST_PHRASE)
    const provider = new JsonRpcProvider(LOCALNET_URL)
    signer = wallet.connect(provider)
    signerAddress = await signer.getAddress()
  })

  test('Should be able to stake', async () => {
    const preparedTx = consensusDelegate(STAKE_TO_ADDRESS, parseEther('100'))
    const tx = await signer.populateTransaction({ ...preparedTx, gasLimit: 200000 })
    const txResponse = await signer.sendTransaction(tx)

    const txReciept = await txResponse.wait(1)
    expect(txReciept.status).toEqual(1)
  })

  test('Should be able to unstake', async () => {
    // TODO: This is technically wrong, there is no delegation to undelegate, but tx should succeed anyway
    const preparedTx = consensusUndelegate(STAKE_TO_ADDRESS, parseEther('100'))
    const tx = await signer.populateTransaction({ ...preparedTx, gasLimit: 200000 })
    const txResponse = await signer.sendTransaction(tx)

    const txReciept = await txResponse.wait(1)
    expect(txReciept.status).toEqual(1)
  })

  test('Should return delegations', async () => {
    // TODO: This is technically wrong, it is pinging testnet
    const delegations = await getDelegations(signerAddress)

    expect(delegations).to.be.toBeDefined()
  })

  test('Should return undelegations', async () => {
    // TODO: This is technically wrong, it is pinging testnet
    const undelegations = await getUndelegations(signerAddress)

    expect(undelegations).to.be.toBeDefined()
  })
})
