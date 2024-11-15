import { useQuery } from '@tanstack/react-query'

import { getNodeInternal } from './client.ts'

export function useIsRpcResponding() {
  const data = useQuery({
    queryKey: ['beaconGetEpoch'],
    queryFn: async () => {
      const nic = getNodeInternal()
      return await nic.beaconGetEpoch(0)
    },
    retry: false,
    refetchInterval(query) {
      return query.state.error ? 30_000 : undefined
    },
  })
  return !data.isError
}
