import { Staking, Staking__factory } from '../src'
import { expect } from 'chai'
import hre from 'hardhat'
import * as oasis from '@oasisprotocol/client'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { DockerUtils } from './docker.utils'

const CONTRACT_ADDRESS = process.env.HARDHAT_CONTRACT_ADDRESS
const TESTNET_VALIDATOR_CONSENSUS_ADDRESS = 'oasis1qrrggkf3jxa3mqjj0uzfpn8wg5hpsn5hdvusqspc'
const TESTNET_VALIDATOR_EVM_ADDRESS = '0x00c684593191bb1d82527f0490ccee452e184e976b'
const LAST_RECEIPT_ID = 4294967296n
let IS_SAPPHIRE = false
let IS_LOCAL = false

let staking: Staking
let signer: HardhatEthersSigner
let signerAddress: string

describe('Staking', () => {
  before(async () => {
    ;[signer] = await hre.ethers.getSigners()
    signerAddress = await signer.getAddress()

    const network = await signer.provider.getNetwork()
    if ([23293n, 23294n, 23295n].includes(network.chainId)) {
      IS_SAPPHIRE = true
    }
    if ([1337n, 23293n, 42260n].includes(network.chainId)) {
      IS_LOCAL = true
    }

    if (CONTRACT_ADDRESS) {
      if (IS_SAPPHIRE) {
        staking = Staking__factory.connect(CONTRACT_ADDRESS!, sapphire.wrapEthersSigner(signer))
      } else {
        staking = Staking__factory.connect(CONTRACT_ADDRESS!, signer)
      }

      console.log(`Using existing contract @ ${CONTRACT_ADDRESS}`)
    } else {
      const stakingContractFactory = await hre.ethers.getContractFactory('Staking')
      const _staking = await stakingContractFactory.deploy()
      await _staking.waitForDeployment()

      staking = _staking as unknown as Staking

      console.log(`The contract has been deployed @ ${await _staking.getAddress()}`)
    }
  })

  it('Should be able to delegate to a validator', async () => {
    const amount = hre.ethers.parseEther('100')

    const toBech32 = oasis.staking.addressFromBech32(TESTNET_VALIDATOR_CONSENSUS_ADDRESS)
    const txReceipt = await staking.connect(signer).Delegate(toBech32, { value: amount })
    await txReceipt.wait()

    const onDelegateStartFilter = staking.filters.OnDelegateStart(signerAddress)
    const events = await staking.queryFilter(onDelegateStartFilter, txReceipt.blockNumber!)
    const [{ args }] = events

    expect(args).to.deep.equal([
      signerAddress,
      TESTNET_VALIDATOR_EVM_ADDRESS,
      hre.ethers.parseEther('100'),
      LAST_RECEIPT_ID,
    ])

    const pendingDelegationCount = await staking.GetPendingDelegationCount(signerAddress)
    expect(pendingDelegationCount).to.be.at.least(1)
  })

  it('Should be able to query pending delegation and call delegation done', async () => {
    const { receiptIds, pendings } = await staking.GetPendingDelegations(signerAddress)

    expect(receiptIds.length).to.be.equals(1)
    expect(pendings.length).to.be.equals(1)

    const receiptId = receiptIds[receiptIds.length - 1]
    const txReceipt = await staking.connect(signer).DelegateDone(receiptId)
    await txReceipt.wait()

    const onDelegateDoneFilter = staking.filters.OnDelegateDone(LAST_RECEIPT_ID!)
    const events = await staking.queryFilter(onDelegateDoneFilter, txReceipt.blockNumber!)
    const [{ args }] = events

    expect(args).to.deep.equal([LAST_RECEIPT_ID, signerAddress, hre.ethers.parseUnits('100', 'gwei')])

    const delegationCount = await staking.GetDelegationsCount(signerAddress)
    expect(delegationCount).to.be.at.least(1)
  })

  it('Should be able to undelegate from validator', async () => {
    const delegationCount = await staking.GetDelegationsCount(signerAddress)
    const { out_delegates, out_delegations } = await staking.GetDelegations(
      signerAddress,
      0n,
      delegationCount
    )

    expect(out_delegates.length).to.be.at.least(1)
    expect(out_delegations.length).to.be.at.least(1)

    const outDelegate = out_delegates[out_delegates.length - 1]
    const outDelegation = out_delegations[out_delegations.length - 1]

    const fromBech32 = Uint8Array.from(Buffer.from(outDelegate.replace('0x', ''), 'hex'))
    const txReceipt = await staking.connect(signer).Undelegate(fromBech32, outDelegation.shares)
    await txReceipt.wait()

    const { receiptIds, undelegations } = await staking.GetUndelegations(signerAddress)
    expect(receiptIds.length).to.be.at.least(1)
    expect(undelegations.length).to.be.at.least(1)
  })

  it('Should be able to start undelegation', async () => {
    const { receiptIds, undelegations } = await staking.GetUndelegations(signerAddress)
    expect(receiptIds.length).to.be.at.least(1)
    expect(undelegations.length).to.be.at.least(1)

    const receiptId = receiptIds[receiptIds.length - 1]

    const txReceipt = await staking.connect(signer).UndelegateStart(receiptId, { gasLimit: 1000000n })
    await txReceipt.wait()

    const onUndelegateStartFilter = staking.filters.OnUndelegateStart(receiptId)
    const events = await staking.queryFilter(onUndelegateStartFilter, txReceipt.blockNumber!)
    const [{ args }] = events

    expect(args.receiptId).to.be.equal(receiptId)
    expect(args.who).to.be.equal(signerAddress)
    expect(args.shares).to.be.equal(hre.ethers.parseUnits('100', 'gwei'))
    expect(args.epoch).to.be.at.least(1n)
  })

  it('Should be able to reclaim undelegated ROSE', async () => {
    const { receiptIds, undelegations } = await staking.GetUndelegations(signerAddress)
    expect(receiptIds.length).to.be.at.least(1)
    expect(undelegations.length).to.be.at.least(1)

    const receiptId = receiptIds[receiptIds.length - 1]
    const undelegation = undelegations[undelegations.length - 1]

    expect(undelegation.epoch).to.not.be.undefined
    expect(undelegation.endReceiptId).to.not.be.undefined

    const beforeBalance = await hre.ethers.provider.getBalance(signerAddress)

    try {
      if (IS_LOCAL) {
        // Defaults to debonding interval number of epochs to skip
        DockerUtils.oasisContainerSkipEpochs({ targetEpoch: Number(undelegation.epoch) })
        expect(DockerUtils.getOasisContainerEpoch()).to.be.at.least(undelegation.epoch)
      }

      const txReceipt = await staking.connect(signer).UndelegateDone(receiptId)
      await txReceipt.wait()
    } catch (error) {
      console.error(error)
      expect(error).to.be.undefined
    }

    const undelegationsAfterReclaiming = await staking.GetUndelegations(signerAddress)
    expect(undelegationsAfterReclaiming.receiptIds.length).to.be.equals(receiptIds.length - 1)
    expect(undelegationsAfterReclaiming.undelegations.length).to.be.equals(undelegations.length - 1)

    const afterBalance = await hre.ethers.provider.getBalance(signerAddress)
    expect(afterBalance).to.be.at.least(hre.ethers.parseEther('1') + beforeBalance)
  })
})
