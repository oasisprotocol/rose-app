export type Delegation = {
  to: string
  shares: bigint
}

export type Delegations = Delegation[]

export type Undelegation = {
  from: string
  shares: bigint
  epoch: bigint
}

export type Undelegations = Undelegation[]
