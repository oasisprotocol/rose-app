import { Address } from 'viem'
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
  getBalance,
  GetBalanceReturnType,
} from 'wagmi/actions'
import { wagmiConfig } from '../../../home/src/constants/wagmi-config'

const erc20_abi = [
  {
    name: 'approve',
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    name: 'allowance',
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const getErc20Balance = async (
  tokenAddress: Address,
  userAddress: Address
): Promise<GetBalanceReturnType> => {
  try {
    // Native token balance
    if (tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      return await getBalance(wagmiConfig, {
        address: userAddress,
      })
    }

    return await getBalance(wagmiConfig, {
      address: userAddress,
      token: tokenAddress,
    })
  } catch (error) {
    console.error(`Failed to get balance for token ${tokenAddress}:`, error)
    throw error
  }
}

// Fetch the current allowance and update if needed
export const checkAndSetErc20Allowance = async (
  tokenAddress: Address,
  approvalAddress: Address,
  amount: bigint,
  userAddress: Address
): Promise<void> => {
  // Transactions with the native token don't need approval
  if (tokenAddress.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    return
  }

  const allowance = (await readContract(wagmiConfig, {
    address: tokenAddress,
    abi: erc20_abi,
    functionName: 'allowance',
    args: [userAddress, approvalAddress],
  })) as bigint

  if (allowance < amount) {
    try {
      const hash = await writeContract(wagmiConfig, {
        address: tokenAddress,
        abi: erc20_abi,
        functionName: 'approve',
        args: [approvalAddress, amount],
      })

      await waitForTransactionReceipt(wagmiConfig, {
        hash,
      })

      console.log(`Transaction mined successfully: ${hash}`)
    } catch (error) {
      console.log(`Transaction failed with error: ${error}`)
      throw error
    }
  }
}
