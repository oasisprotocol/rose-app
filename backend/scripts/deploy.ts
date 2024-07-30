import { ethers } from 'hardhat'

async function main() {
  const factory = await ethers.getContractFactory('Staking')
  const contract = await factory.deploy()

  await contract.waitForDeployment()

  const contractAddress = await contract.getAddress()

  console.log(
    '\x1b[32m',
    `
.env:
VITE_STAKING_CONTRACT_ADDRESS=${contractAddress}
  `
  )
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
