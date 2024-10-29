import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export function useReloadIfAccountSwitched() {
  const sapphireAccount = useAccount()
  const [initialSapphireAddress, setInitialSapphireAddress] = useState<`0x${string}`>()

  useEffect(() => {
    if (sapphireAccount.address && !initialSapphireAddress) {
      // Only save first connected sapphire account
      setInitialSapphireAddress(sapphireAccount.address)
    }
  }, [initialSapphireAddress, sapphireAccount.address])

  useEffect(() => {
    if (initialSapphireAddress && initialSapphireAddress !== sapphireAccount.address) {
      // Correctly supporting switching accounts would require rewriting depositing logic into
      // redux-saga to make it cancelable at any step. Cancel by reloading instead.
      window.location.reload()
    }
  }, [initialSapphireAddress, sapphireAccount.address])
}
