import * as oasis from '@oasisprotocol/client'
import { useQuery } from '@tanstack/react-query'
import { oasisConfig } from './oasisConfig'

export function useIsRpcResponding() {
  const data = useQuery({
    queryKey: ['beaconGetEpoch'],
    queryFn: async () => {
      const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
      return await nic.beaconGetEpoch(0)
    },
    retry: false,
    refetchInterval(query) {
      return query.state.error ? 30_000 : undefined
    },
  })
  return !data.isError
}
