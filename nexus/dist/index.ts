/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum Layer {
  Emerald = 'emerald',
  Sapphire = 'sapphire',
  Pontusxtest = 'pontusxtest',
  Pontusxdev = 'pontusxdev',
  Cipher = 'cipher',
  Consensus = 'consensus',
}

export enum Runtime {
  Emerald = 'emerald',
  Sapphire = 'sapphire',
  Pontusxtest = 'pontusxtest',
  Pontusxdev = 'pontusxdev',
  Cipher = 'cipher',
}

/**
 * An Oasis-style (bech32) address.
 * @pattern ^oasis1[a-z0-9]{40}$
 * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
 */
export type StakingAddress = string

/**
 * @format bigint
 * @pattern ^-?[0-9]+$
 * @example "1234567890123456789012"
 */
export type TextBigInt = string

/**
 * An Oasis-style (bech32) address.
 * @pattern ^oasis1[a-z0-9]{40}$
 * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
 */
export type Address = string

/** @pattern ^oasis1[a-z0-9]{40}$|^(0x)?[0-9a-fA-F]{40}$ */
export type EthOrOasisAddress = string

/**
 * A base64-encoded ed25519 public key.
 * @format byte
 * @example "lbxs4hlud9XNloIOdhJPaCahd7HtiY8QATCgGnFfCM0="
 */
export type Ed25519PubKey = string

/** @example "encrypted/x25519-deoxysii" */
export type CallFormat = string

export interface List {
  /**
   * The total number of records that match the query, i.e. the number of records
   * the query would return with limit=infinity.
   * @format uint64
   * @example 412
   */
  total_count: number
  /**
   * Whether total_count is clipped for performance reasons.
   * @example true
   */
  is_total_count_clipped: boolean
}

export interface Status {
  /**
   * The height of the most recent indexed block. Compare with latest_node_block to measure
   * how far behind Nexus is from the chain.
   * @format int64
   * @example 8048956
   */
  latest_block: number
  /**
   * The height of the most recently produced block on-chain as seen by Nexus.
   * @format int64
   * @example 8049555
   */
  latest_node_block: number
  /**
   * The RFC 3339 formatted consensus time of when the most recently indexed block was produced.
   * @format date-time
   * @example "2019-04-01T00:00:00Z"
   */
  latest_block_time: string
  /**
   * The number of milliseconds since Nexus processed the latest block.
   * @format int64
   * @example 352
   */
  latest_update_age_ms: number
}

/** A list of consensus blocks. */
export type BlockList = List & {
  blocks: Block[]
}

/** A consensus block. */
export interface Block {
  /**
   * The block height.
   * @format int64
   * @example 8048956
   */
  height: number
  /**
   * The block header hash.
   * @example "0a29ac21fa69bb9e43e5cb25d10826ff3946f1ce977e82f99a2614206a50765c"
   */
  hash: string
  /**
   * The second-granular consensus time.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  timestamp: string
  /**
   * Number of transactions in the block.
   * @format int32
   * @example 17
   */
  num_transactions: number
  /**
   * The gas limit for the block. A gas limit 0 means that the max block gas was unlimited.
   * Blocks from Cobalt, Damask, and early Eden had no gas limit as their sizes were only
   * restricted by byte size until an upgrade during Eden introduced a gas limit.
   */
  gas_limit: TextBigInt
  /** The size limit for the block in bytes. */
  size_limit?: TextBigInt
  /**
   * The epoch number of the epoch in which the block was produced.
   * @format int64
   * @example 13402
   */
  epoch: number
  /**
   * The Merkle root of the state tree after applying the block.
   * @example "8e39bf193f8a954ab8f8d7cb6388c591fd0785ea060bbd8e3752e266b54499d3"
   */
  state_root: string
  /** The entity that proposed this block. */
  proposer?: EntityInfo
  /** A list of the entities that signed the block. */
  signers?: EntityInfo[]
}

/** Light-weight entity information, containing only its ID, address and registry metadata. */
export interface EntityInfo {
  /**
   * The ID of the entity owning the node; this corresponds to the entity's public key in base64.
   * @example "`TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=`"
   */
  entity_id?: string
  /**
   * Address of the entity owning the node, in Bech32 format (`oasis1...`).
   * @example "`oasis1qzzd6khm3acqskpxlk9vd5044cmmcce78y5l6000`"
   */
  entity_address?: string
  /**
   * Metadata about an entity, if available. See [the metadata registry](https://github.com/oasisprotocol/metadata-registry) for details.
   *
   * When available, it is an object with some subset of the following fields:
   *
   * - `v`: The version of the metadata structure (always present).
   * - `serial`: The serial number of the metadata statement (always present).
   * - `name`: The name of the entity.
   * - `url`: The URL associated with the entity.
   * - `email`: The email address associated with the entity.
   * - `keybase`: Tne entity's keybase.io handle.
   * - `twitter`: The twitter handle associated with the entity.
   * @example "An entity with all fields:
   *
   *     {
   *       "v": 1,
   *       "serial": 1,
   *       "name": "Entity display name",
   *       "url": "https://example.org/entity",
   *       "email": "entity@example.org",
   *       "keybase": "keybase_handle",
   *       "twitter": "twitter_handle"
   *     }
   * "
   */
  entity_metadata?: any
}

/** A delegation. */
export interface Delegation {
  /** The amount of tokens delegated in base units. */
  amount: TextBigInt
  /** The shares of tokens delegated. */
  shares: TextBigInt
  /**
   * The delegatee (validator) address.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  validator: string
  /**
   * The delegator address.
   * @example "oasis1qprtzrg97jk0wxnqkhxwyzy5qys47r7alvfl3fcg"
   */
  delegator: string
}

/** A list of delegations. */
export type DelegationList = List & {
  delegations: Delegation[]
}

/** A debonding delegation. */
export interface DebondingDelegation {
  /** The amount of tokens delegated in base units. */
  amount: TextBigInt
  /** The shares of tokens delegated. */
  shares: TextBigInt
  /**
   * The delegatee (validator) address.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  validator: string
  /**
   * The delegator address.
   * @example "oasis1qprtzrg97jk0wxnqkhxwyzy5qys47r7alvfl3fcg"
   */
  delegator: string
  /**
   * The epoch at which the debonding ends.
   * @format int64
   */
  debond_end: number
}

/** A list of debonding delegations. */
export type DebondingDelegationList = List & {
  debonding_delegations: DebondingDelegation[]
}

/** @example "staking.Transfer" */
export enum ConsensusTxMethod {
  BeaconPVSSCommit = 'beacon.PVSSCommit',
  BeaconPVSSReveal = 'beacon.PVSSReveal',
  BeaconVRFProve = 'beacon.VRFProve',
  ConsensusMeta = 'consensus.Meta',
  GovernanceCastVote = 'governance.CastVote',
  GovernanceSubmitProposal = 'governance.SubmitProposal',
  KeymanagerPublishEphemeralSecret = 'keymanager.PublishEphemeralSecret',
  KeymanagerPublishMasterSecret = 'keymanager.PublishMasterSecret',
  KeymanagerUpdatePolicy = 'keymanager.UpdatePolicy',
  RegistryDeregisterEntity = 'registry.DeregisterEntity',
  RegistryProveFreshness = 'registry.ProveFreshness',
  RegistryRegisterEntity = 'registry.RegisterEntity',
  RegistryRegisterNode = 'registry.RegisterNode',
  RegistryRegisterRuntime = 'registry.RegisterRuntime',
  RegistryUnfreezeNode = 'registry.UnfreezeNode',
  RoothashEvidence = 'roothash.Evidence',
  RoothashExecutorCommit = 'roothash.ExecutorCommit',
  RoothashExecutorProposerTimeout = 'roothash.ExecutorProposerTimeout',
  RoothashSubmitMsg = 'roothash.SubmitMsg',
  StakingAddEscrow = 'staking.AddEscrow',
  StakingAllow = 'staking.Allow',
  StakingAmendCommissionSchedule = 'staking.AmendCommissionSchedule',
  StakingBurn = 'staking.Burn',
  StakingReclaimEscrow = 'staking.ReclaimEscrow',
  StakingTransfer = 'staking.Transfer',
  StakingWithdraw = 'staking.Withdraw',
  KeymanagerChurpApply = 'keymanager/churp.Apply',
  KeymanagerChurpConfirm = 'keymanager/churp.Confirm',
  KeymanagerChurpCreate = 'keymanager/churp.Create',
  KeymanagerChurpUpdate = 'keymanager/churp.Update',
  VaultAuthorizeAction = 'vault.AuthorizeAction',
  VaultCancelAction = 'vault.CancelAction',
  VaultCreate = 'vault.Create',
}

/** A list of consensus transactions. */
export type TransactionList = List & {
  transactions: Transaction[]
}

/** A consensus transaction. */
export interface Transaction {
  /**
   * The block height at which this transaction was executed.
   * @format int64
   * @example 8048956
   */
  block: number
  /**
   * 0-based index of this transaction in its block
   * @format int32
   * @example 17
   */
  index: number
  /**
   * The second-granular consensus time of this tx's block, i.e. roughly when the
   * [block was proposed](https://github.com/tendermint/tendermint/blob/v0.34.x/spec/core/data_structures.md#header).
   * @format date-time
   * @example "2022-10-15T00:05:34Z"
   */
  timestamp: string
  /**
   * The cryptographic hash of this transaction's encoding.
   * @example "0d0531d6b8a468c07440182b1cdda517f5a076d69fb2199126a83082ecfc0f41"
   */
  hash: string
  /**
   * The address of who sent this transaction.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  sender: string
  /**
   * The nonce used with this transaction, to prevent replay.
   * @format int64
   * @example 0
   */
  nonce: number
  /**
   * The fee that this transaction's sender committed
   * to pay to execute it.
   * @example 1000
   */
  fee: TextBigInt
  /** The maximum gas that a transaction can use. */
  gas_limit: TextBigInt
  /** The method that was called. */
  method: ConsensusTxMethod
  /**
   * The method call body. This spec does not encode the many possible types; instead, see [the Go API](https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go) of oasis-core. This object will conform to one of the types passed to variable instantiations using `NewMethodName` two levels down the hierarchy, e.g. `MethodTransfer` from `oasis-core/go/staking/api` seen [here](https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go@v0.2300.10/staking/api#pkg-variables).
   * @example "{"amount":"1000000000","account":"oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"}"
   */
  body: object
  /** Whether this transaction successfully executed. */
  success: boolean
  /** Error details of a failed transaction. */
  error?: TxError
}

export interface TxError {
  /** The module of a failed transaction. */
  module?: string
  /**
   * The status code of a failed transaction.
   * @format uint32
   */
  code: number
  /**
   * The message of a failed transaction.
   * This field, like `code` and `module`, can represent an error that originated
   * anywhere in the paratime, i.e. either inside or outside a smart contract.
   *
   * A common special case worth calling out: When the paratime is
   * EVM-compatible (e.g. Emerald or Sapphire) and the error originates
   * inside a smart contract (using `revert` in solidity), the following
   * will be true:
   * - `module` will be "evm" and `code` will be 8; see [here](https://github.com/oasisprotocol/oasis-sdk/blob/runtime-sdk/v0.8.3/runtime-sdk/modules/evm/src/lib.rs#L128) for other possible errors in the `evm` module.
   * - `message` will contain the best-effort human-readable revert reason.
   */
  message?: string
  /**
   * The error parameters, as decoded using the contract abi. Present only when
   * - the error originated from within a smart contract (e.g. via `revert` in Solidity), and
   * - the contract is verified or the revert reason is a plain String.
   * If this field is present, `message` will include the name of the error, e.g. 'InsufficientBalance'.
   * Note that users should be cautious when evaluating error data since the
   * data origin is not tracked and error information can be faked.
   */
  revert_params?: EvmAbiParam[]
}

/** @example "staking.escrow.take" */
export enum ConsensusEventType {
  GovernanceProposalExecuted = 'governance.proposal_executed',
  GovernanceProposalFinalized = 'governance.proposal_finalized',
  GovernanceProposalSubmitted = 'governance.proposal_submitted',
  GovernanceVote = 'governance.vote',
  RegistryEntity = 'registry.entity',
  RegistryNodeUnfrozen = 'registry.node_unfrozen',
  RegistryNode = 'registry.node',
  RegistryRuntime = 'registry.runtime',
  RegistryRuntimeSuspended = 'registry.runtime_suspended',
  RoothashExecutionDiscrepancy = 'roothash.execution_discrepancy',
  RoothashExecutorCommitted = 'roothash.executor_committed',
  RoothashFinalized = 'roothash.finalized',
  RoothashMessage = 'roothash.message',
  RoothashInMsgProcessed = 'roothash.in_msg_processed',
  StakingAllowanceChange = 'staking.allowance_change',
  StakingBurn = 'staking.burn',
  StakingEscrowAdd = 'staking.escrow.add',
  StakingEscrowDebondingStart = 'staking.escrow.debonding_start',
  StakingEscrowReclaim = 'staking.escrow.reclaim',
  StakingEscrowTake = 'staking.escrow.take',
  StakingTransfer = 'staking.transfer',
}

/** A list of consensus events. */
export type ConsensusEventList = List & {
  events: ConsensusEvent[]
}

/** An event emitted by the consensus layer. */
export interface ConsensusEvent {
  /**
   * The block height at which this event was generated.
   * @format int64
   * @example 8048956
   */
  block: number
  /**
   * 0-based index of this event's originating transaction within its block.
   * Absent if the event did not originate from a transaction.
   * @format int32
   * @example 5
   */
  tx_index?: number
  /**
   * Hash of this event's originating transaction.
   * Absent if the event did not originate from a transaction.
   * @example "0d0531d6b8a468c07440182b1cdda517f5a076d69fb2199126a83082ecfc0f41"
   */
  tx_hash?: string
  /**
   * The ID of the runtime to which the event relates, encoded in hex.
   * Present only for events of type `roothash.*`.
   * @example "000000000000000000000000000000000000000000000000e2eaa99fc008f87f"
   */
  roothash_runtime_id?: string
  /**
   * The runtime to which the event relates.
   * Present only for events of type `roothash.*`.
   * @example "emerald"
   */
  roothash_runtime?: Runtime
  /**
   * When applicable, the round in the runtime to which this event
   * relates.
   * Present only for events of type `roothash.*` except for
   * `roothash.execution_discrepancy` before Eden.
   * @format int64
   */
  roothash_runtime_round?: number
  /** The type of the event. */
  type: ConsensusEventType
  /**
   * The event contents. This spec does not encode the many possible types;
   * instead, see [the Go API](https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go/consensus/api/transaction/results#Event) of oasis-core.
   * This object will conform to one of the `*Event` types two levels down
   * the hierarchy, e.g. `TransferEvent` from `Event > staking.Event > TransferEvent`
   */
  body: object
}

/** @example "staking.transfer" */
export enum RoothashMessageType {
  StakingTransfer = 'staking.transfer',
  StakingWithdraw = 'staking.withdraw',
  StakingAddEscrow = 'staking.add_escrow',
  StakingReclaimEscrow = 'staking.reclaim_escrow',
  RegistryUpdateRuntime = 'registry.update_runtime',
  GovernanceCastVote = 'governance.cast_vote',
  GovernanceSubmitProposal = 'governance.submit_proposal',
}

export type RoothashMessageList = List & {
  roothash_messages: RoothashMessage[]
}

export interface RoothashMessage {
  /**
   * The runtime that sent this message.
   * @example "sapphire"
   */
  runtime: string
  /**
   * The block round when the runtime sent this message.
   * @format int64
   * @example 1357490
   */
  round: number
  /**
   * The 0-based index of this message in the block.
   * @format int32
   * @example 0
   */
  index: number
  /**
   * The type of this message.
   * @example "staking.withdraw"
   */
  type?: RoothashMessageType
  /**
   * The "body" of a message is a structure within the
   * `github.com/oasisprotocol/oasis-core/go/roothash/api/message`
   * `Message` structure
   * (https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go/roothash/api/message#Message).
   * For example, if the type is `staking.withdraw`, the body is the Go
   * `Message` structure's `.Staking.Withdraw` field, which is a
   * `github.com/oasisprotocol/oasis-core/go/staking/api` `Withdraw`
   * structure
   * (https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go/staking/api#Withdraw),
   * with `from` and `amount` fields in JSON.
   * @example {"from":"oasis1qqzjq6lqjf8d07ehhvu5ytc47dck8w7a6qgn7efh","amount":"500000000"}
   */
  body?: object
  /**
   * If executing this message resulted in an error, this is the
   * error's module.
   * @example "staking"
   */
  error_module?: string
  /**
   * If executing this message resulted in an error, this is the
   * error's code.
   * @format int32
   * @example 3
   */
  error_code?: number
  /**
   * A result value that consensus provided after executing this
   * message. These aren't centrally registered anywhere, so look at
   * the consensus apps' `ExecuteMessage`
   * (https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go/consensus/cometbft/api#MessageSubscriber)
   * implementations to see what they return. For example, a
   * `staking.withdraw` type message gives a
   * `github.com/oasisprotocol/oasis-core/go/staking/api`
   * `WithdrawResult` structure as its result
   * (`https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go/staking/api#WithdrawResult`)
   * with `owner`, `beneficiary`, `allowance`, and `amount_change`
   * fields.
   * @example {"owner":"oasis1qqzjq6lqjf8d07ehhvu5ytc47dck8w7a6qgn7efh","beneficiary":"oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc","allowance":"97000000000","amount_change":"500000000"}
   */
  result?: any
}

/** A list of entities registered at the consensus layer. */
export type EntityList = List & {
  entities: Entity[]
}

/** An entity registered at the consensus layer. */
export interface Entity {
  /**
   * The public key identifying this entity.
   * @example "gb8SHLeDc69Elk7OTfqhtVgE2sqxrBCDQI84xKR+Bjg="
   */
  id: string
  /**
   * The staking address belonging to this entity; derived from the entity's public key.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  address: string
  /** The vector of nodes owned by this entity. */
  nodes: string[]
}

export interface ValidatorsResponse {
  validator_list: ValidatorList
  /** Summary statistics across all consensus validators. */
  stats: ValidatorAggStats
}

/**
 * A list of validators registered at the consensus layer, plus summary
 * statistics across all consensus validators.
 */
export type ValidatorList = List & {
  validators: Validator[]
  /** Summary statistics across all consensus validators. */
  stats: ValidatorAggStats
}

export interface ValidatorAggStats {
  /**
   * The total voting power across all validators.
   * @format int64
   */
  total_voting_power: number
  /**
   * The total number of delegators in the network.
   * @format uint64
   */
  total_delegators: number
  /** The total amount of token staked to validators. */
  total_staked_balance: TextBigInt
}

export interface ValidatorCommissionBound {
  /** @format uint64 */
  lower: number
  /** @format uint64 */
  upper: number
  /** @format uint64 */
  epoch_start: number
  /** @format uint64 */
  epoch_end: number
}

export interface ValidatorMedia {
  /** An URL associated with the entity. */
  url?: string
  /** An email address associated with the entity. */
  email?: string
  /** Twitter handle. */
  twitter?: string
  /** Keybase handle. */
  keybase?: string
  /**
   * The human-readable name of this entity.
   * @example "WhaleStake"
   */
  name?: string
  /** URL to a logo image for the entity. */
  logoUrl?: string
}

/** An validator registered at the consensus layer. */
export interface Validator {
  /**
   * The staking address identifying this validator.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  entity_address: string
  /**
   * The public key identifying this validator.
   * @example "gb8SHLeDc69Elk7OTfqhtVgE2sqxrBCDQI84xKR+Bjg="
   */
  entity_id: string
  /**
   * The public key identifying this validator's node.
   * @example "lbxs4hlud9XNloIOdhJPaCahd7HtiY8QATCgGnFfCM0="
   */
  node_id?: string
  /** The escrow account data for this validator. */
  escrow: Escrow
  /**
   * The voting power of this validator.
   * @format int64
   */
  voting_power: number
  /**
   * The cumulative voting power of this validator and all other validators ranked higher than itself.
   * @format int64
   */
  voting_power_cumulative?: number
  /** Whether the entity has a node that is registered for being a validator, node is up to date, and has successfully registered itself. It may or may not be part of validator set. */
  active: boolean
  /**
   * The second-granular consensus time.
   * @format date-time
   * @example "2022-10-15T00:05:34Z"
   */
  start_date: string
  /**
   * The rank of the validator, determined by voting power.
   * @format uint64
   */
  rank: number
  /** Whether the entity is part of the validator set (top <scheduler.params.max_validators> by stake among active entities). */
  in_validator_set: boolean
  /** @example "{"email":"validator@example.net","keybase":"validator_keybase","name":"Example Validator","twitter":"validator_twitter","url":"https://example.com","logoUrl": "https://example.com/logo.png"}" */
  media?: ValidatorMedia
  /**
   * Commission rate.
   * @format uint64
   */
  current_rate: number
  current_commission_bound: ValidatorCommissionBound
  /** An array containing details of the last 100 consensus blocks, indicating whether each block was signed by the validator. Only available when querying a single validator. */
  signed_blocks?: ValidatorSignedBlock[]
}

/** Information whether a block was signed by the validator. */
export interface ValidatorSignedBlock {
  /**
   * The block height.
   * @format int64
   * @example 8048956
   */
  height: number
  /** Whether the validator signed the block. */
  signed: boolean
}

export interface Escrow {
  /** The amount of tokens that are delegated to this validator account, and are NOT in the process of debonding. */
  active_balance?: TextBigInt
  /** The shares of tokens that are delegated to this validator account, and are NOT in the process of debonding. */
  active_shares?: TextBigInt
  /** The amount of tokens that are delegated to this validator account, but are also in the process of debonding (i.e. they will be unstaked within ~2 weeks). */
  debonding_balance?: TextBigInt
  /** The shares of tokens that are delegated to this validator account, but are also in the process of debonding (i.e. they will be unstaked within ~2 weeks). */
  debonding_shares?: TextBigInt
  /** The amount of token this validator has delegated to itself, and are NOT in the process of debonding. */
  self_delegation_balance?: TextBigInt
  /** The shares of tokens this validator has delegated to itself, and are NOT in the process of debonding. */
  self_delegation_shares?: TextBigInt
  /** The active_balance of this validator account 24 hours ago. */
  active_balance_24?: TextBigInt
  /**
   * The number of accounts that have delegated token to this account.
   * @format uint64
   */
  num_delegators?: number
}

/** Historical escrow balance data for a single address. */
export type ValidatorHistory = List & {
  /**
   * The staking address of the validator.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  address?: string
  history: ValidatorHistoryPoint[]
}

export interface ValidatorHistoryPoint {
  /**
   * The epoch number.
   * @format int64
   * @example 13402
   */
  epoch: number
  /**
   * The amount of tokens that were delegated to this validator account,
   * at the start of this epoch, and are NOT in the process of debonding.
   */
  active_balance?: TextBigInt
  /**
   * The shares of tokens that were delegated to this validator account,
   * at the start of this epoch, and are NOT in the process of debonding.
   */
  active_shares?: TextBigInt
  /**
   * The amount of tokens that were delegated to this validator account
   * at the start of this epoch, but are also in the process of debonding
   * (i.e. they will be unstaked within ~2 weeks).
   */
  debonding_balance?: TextBigInt
  /**
   * The shares of tokens that were delegated to this validator account
   * at the start of this epoch, but are also in the process of debonding
   * (i.e. they will be unstaked within ~2 weeks).
   */
  debonding_shares?: TextBigInt
  /**
   * The number of accounts that have delegated token to this account.
   * @format uint64
   */
  num_delegators?: number
}

/** A list of nodes registered at the consensus layer. */
export type NodeList = List & {
  entity_id: string
  nodes: Node[]
}

/** A node registered at the consensus layer. */
export interface Node {
  /**
   * The public key identifying this node.
   * @example "lbxs4hlud9XNloIOdhJPaCahd7HtiY8QATCgGnFfCM0="
   */
  id: string
  /**
   * The public key identifying the entity controlling this node.
   * @example "gb8SHLeDc69Elk7OTfqhtVgE2sqxrBCDQI84xKR+Bjg="
   */
  entity_id: string
  /**
   * The epoch in which this node's commitment expires.
   * @format int64
   */
  expiration: number
  /** The public key used for establishing TLS connections. */
  tls_pubkey: string
  /**
   * The public key that will be used for establishing TLS connections
   * upon rotation.
   */
  tls_next_pubkey: string
  /** The unique identifier of this node on the P2P transport. */
  p2p_pubkey: string
  /** The unique identifier of this node as a consensus member */
  consensus_pubkey: string
  /** A bitmask representing this node's roles. */
  roles: string
}

/** A list of consensus layer accounts. */
export type AccountList = List & {
  accounts: Account[]
}

export enum AddressDerivationContext {
  OasisCoreAddressStaking = 'oasis-core/address: staking',
  OasisRuntimeSdkAddressSecp256K1Eth = 'oasis-runtime-sdk/address: secp256k1eth',
  OasisRuntimeSdkAddressSr25519 = 'oasis-runtime-sdk/address: sr25519',
  OasisRuntimeSdkAddressMultisig = 'oasis-runtime-sdk/address: multisig',
  OasisRuntimeSdkAddressModule = 'oasis-runtime-sdk/address: module',
  OasisRuntimeSdkAddressRuntime = 'oasis-runtime-sdk/address: runtime',
}

/**
 * The data from which a consensus-style address (`oasis1...`)
 * was derived. Notably, for EVM runtimes like Sapphire,
 * this links the Oasis address and the Ethereum address.
 *
 * Oasis addresses are derived from a piece of data, such as an ed25519
 * public key or an Ethereum address. For example, [this](https://github.com/oasisprotocol/oasis-sdk/blob/b37e6da699df331f5a2ac62793f8be099c68469c/client-sdk/go/helpers/address.go#L90-L91)
 * is how an Ethereum is converted to an Oasis address. The type of underlying data usually also
 * determines how the signatures for this address are verified.
 *
 * Consensus supports only "staking addresses" (`context="oasis-core/address: staking"`
 * below; always ed25519-backed).
 * Runtimes support all types. This means that every consensus address is also
 * valid in every runtime. For example, in EVM runtimes, you can use staking
 * addresses, but only with Oasis tools (e.g. a wallet); EVM contracts such as
 * ERC20 tokens or tools such as Metamask cannot interact with staking addresses.
 */
export interface AddressPreimage {
  /**
   * The method by which the Oasis address was derived from `address_data`.
   * @example "oasis-runtime-sdk/address: secp256k1eth"
   */
  context: AddressDerivationContext
  /**
   * Version of the `context`.
   * @default 0
   */
  context_version?: number
  /**
   * The base64-encoded data from which the Oasis address was derived.
   * When `context = "oasis-runtime-sdk/address: secp256k1eth"`, this
   * is the Ethereum address (in base64, not hex!).
   * @format byte
   * @example "INLp2Ih3YIdcA+zFNhM+SIGyFgKsYYc9SKQeKRKe2uI="
   */
  address_data: string
}

/** Balance of an account for a specific runtime and oasis-sdk token (e.g. ROSE). */
export interface RuntimeSdkBalance {
  /** Number of tokens held, in base units. */
  balance: TextBigInt
  /**
   * The token ticker symbol. Unique across all oasis-sdk tokens in the same runtime.
   * @example "ROSE"
   */
  token_symbol: string
  /**
   * The number of decimals of precision for this token.
   * @example 18
   */
  token_decimals: number
}

/** Balance of an account for a specific runtime and EVM token. */
export interface RuntimeEvmBalance {
  /** Number of tokens held, in base units. */
  balance: TextBigInt
  /**
   * The Oasis address of this token's contract.
   * @example "oasis1qzk5pr2x8ah04lgjee3lv06fmyvqvz45egjv4ps0"
   */
  token_contract_addr: string
  /**
   * The EVM address of this token's contract.
   * @example "0xF8E3DE55D24D13607A12628E0A113B66BA578bDC"
   */
  token_contract_addr_eth: string
  /** The token ticker symbol. Not guaranteed to be unique across distinct EVM tokens. */
  token_symbol?: string
  /** The name of the token. Not guaranteed to be unique across distinct EVM tokens. */
  token_name?: string
  token_type: EvmTokenType
  /**
   * The number of decimals of precision for this token.
   * @example 18
   */
  token_decimals: number
}

/** A list of token holders for a specific (implied) runtime and token. */
export type TokenHolderList = List & {
  holders: BareTokenHolder[]
}

/** Balance of an account for a specific (implied) runtime and token. */
export interface BareTokenHolder {
  /**
   * The Oasis address of the account holder.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  holder_address: string
  /**
   * The Ethereum address of the same account holder, if meaningfully defined.
   * @example 1.2367698861069356e+48
   */
  eth_holder_address?: string
  /** Number of tokens held, in base units. */
  balance: TextBigInt
}

/** A consensus layer account. */
export interface Account {
  /**
   * The staking address for this account.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  address: string
  /**
   * The expected nonce for the next transaction (= last used nonce + 1)
   * @format int64
   * @example 0
   */
  nonce: number
  /** The available balance, in base units. */
  available: TextBigInt
  /** The active escrow balance, in base units. */
  escrow: TextBigInt
  /** The debonding escrow balance, in base units. */
  debonding: TextBigInt
  /**
   * The balance of this accounts' (outgoing) delegations, in base units.
   * @example 10000000000
   */
  delegations_balance: TextBigInt
  /**
   * The balance of this accounts' (outgoing) debonding delegations, in base units.
   * @example 10000000000
   */
  debonding_delegations_balance: TextBigInt
  /**
   * The second-granular consensus time of the block in which this account was first active.
   * Dates before Cobalt (2021-04-28) are approximate.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  first_activity?: string
  /**
   * The allowances made by this account.
   * This field is omitted when listing multiple accounts.
   */
  allowances: Allowance[]
  stats: AccountStats
}

export interface Allowance {
  /**
   * The allowed account.
   * @example "oasis1qprtzrg97jk0wxnqkhxwyzy5qys47r7alvfl3fcg"
   */
  address: string
  /**
   * The amount allowed for the allowed account.
   * This field is omitted when listing multiple accounts.
   */
  amount: TextBigInt
}

/** A list of consensus epochs. */
export type EpochList = List & {
  epochs: Epoch[]
}

/** A consensus epoch. */
export interface Epoch {
  /**
   * The epoch number.
   * @format int64
   * @example 13402
   */
  id: number
  /**
   * The (inclusive) height at which this epoch started.
   * @format uint64
   * @example 8048956
   */
  start_height: number
  /**
   * The (inclusive) height at which this epoch ended. Omitted if the epoch is still active.
   * @format uint64
   * @example 8049555
   */
  end_height?: number
}

/** A list of governance proposals. */
export type ProposalList = List & {
  proposals: Proposal[]
}

/** The target protocol versions for this upgrade proposal. */
export interface ProposalTarget {
  consensus_protocol?: string
  runtime_host_protocol?: string
  runtime_committee_protocol?: string
}

/**
 * The state of the proposal.
 * @example "active"
 */
export enum ProposalState {
  Active = 'active',
  Passed = 'passed',
  Failed = 'failed',
  Rejected = 'rejected',
}

/** A governance proposal. */
export interface Proposal {
  /**
   * The unique identifier of the proposal.
   * @format uint64
   * @example 1
   */
  id: number
  /**
   * The staking address of the proposal submitter.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  submitter: string
  state: ProposalState
  /** The deposit attached to this proposal. */
  deposit: TextBigInt
  /** The (optional) title of the proposal. */
  title?: string
  /** The (optional) description of the proposal. */
  description?: string
  /** The name of the upgrade handler. */
  handler?: string
  target?: ProposalTarget
  /**
   * The epoch at which the proposed upgrade will happen.
   * @format uint64
   * @example 13402
   */
  epoch?: number
  /**
   * The proposal to cancel, if this proposal proposes
   * cancelling an existing proposal.
   * @format int64
   */
  cancels?: number
  /**
   * The name of the module whose parameters are to be changed
   * by this 'parameters_change' proposal.
   */
  parameters_change_module?: string
  /**
   * The parameters change proposal body. This spec does not encode the many possible types; instead, see [the Go API](https://pkg.go.dev/github.com/oasisprotocol/oasis-core/go) of oasis-core. This object will conform to one of the `ConsensusParameterChanges` types, depending on the `parameters_change_module`.
   * @example "{"min_validators":null,"max_validators":"120","voting_power_distribution":null}"
   */
  parameters_change?: any
  /**
   * The epoch at which this proposal was created.
   * @format int64
   * @example 13402
   */
  created_at: number
  /**
   * The epoch at which voting for this proposal will close.
   * @format int64
   * @example 13403
   */
  closes_at: number
  /** The number of invalid votes for this proposal, after tallying. */
  invalid_votes: TextBigInt
}

/** A list of votes for a governance proposal. */
export type ProposalVotes = List & {
  /**
   * The unique identifier of the proposal.
   * @format uint64
   */
  proposal_id: number
  /** The list of votes for the proposal. */
  votes: ProposalVote[]
}

export interface ProposalVote {
  /**
   * The staking address casting this vote.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  address: string
  /**
   * The vote cast.
   * @example "yes"
   */
  vote: string
  /**
   * The block height at which this vote was recorded.
   * @format int64
   * @example 8048956
   */
  height?: number
  /**
   * The second-granular consensus time of the block in which this vote was cast.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  timestamp?: string
}

/** A list of consensus blocks. */
export type RuntimeBlockList = List & {
  blocks: RuntimeBlock[]
}

/** A ParaTime block. */
export interface RuntimeBlock {
  /**
   * The block round.
   * @format int64
   * @example 3283246
   */
  round: number
  /**
   * The block header hash.
   * @example "21c243cd34bedfc234f1b45615d10a868f0655f59578f063a7d2fc8c6e5b4009"
   */
  hash: string
  /**
   * The second-granular consensus time.
   * @format date-time
   * @example "2022-10-15T00:05:34Z"
   */
  timestamp: string
  /**
   * The number of transactions in the block.
   * @format int32
   * @example 1
   */
  num_transactions: number
  /**
   * The total byte size of all transactions in the block.
   * @format int32
   * @example 203
   */
  size: number
  /**
   * The total gas used by all transactions in the block.
   * @format int64
   * @example 118597
   */
  gas_used: number
}

/** A list of runtime events. */
export type RuntimeEventList = List & {
  events: RuntimeEvent[]
}

/** An event emitted by the runtime layer */
export interface RuntimeEvent {
  /**
   * The block height at which this event was generated.
   * @format int64
   * @example 3283246
   */
  round: number
  /**
   * 0-based index of this event's originating transaction within its block.
   * Absent if the event did not originate from a transaction.
   * @format int32
   */
  tx_index?: number
  /**
   * Hash of this event's originating transaction.
   * Absent if the event did not originate from a transaction.
   * @example "0d0531d6b8a468c07440182b1cdda517f5a076d69fb2199126a83082ecfc0f41"
   */
  tx_hash?: string
  /**
   * Ethereum transaction hash of this event's originating transaction.
   * Absent if the event did not originate from an EVM transaction.
   */
  eth_tx_hash?: string
  /**
   * The second-granular consensus time of this event's block.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  timestamp: string
  /** The type of the event. */
  type: RuntimeEventType
  /**
   * The decoded event contents, possibly augmented with additional address info.
   * This spec does not encode the many possible types; instead, see [the Go API](https://pkg.go.dev/github.com/oasisprotocol/oasis-sdk/client-sdk/go/modules).
   * This object will conform to one of the `*Event` types two levels down
   * the hierarchy (e.g. `MintEvent` from `accounts > Event > MintEvent`),
   * OR `evm > Event`. For object fields that specify an oasis-style address, Nexus
   * will add a field specifying the corresponding Ethereum address, if known. Currently,
   * the only such possible fields are `from_eth`, `to_eth`, and `owner_eth`.
   */
  body: object
  /**
   * If the event type is `evm.log`, this field describes the human-readable type of
   * evm event, e.g. `Transfer`.
   * Absent if the event type is not `evm.log`.
   * @example "Transfer"
   */
  evm_log_name?: string
  /**
   * The decoded `evm.log` event data.
   * Absent if the event type is not `evm.log`.
   */
  evm_log_params?: EvmAbiParam[]
  evm_token?: EvmEventToken
}

/** @example "consensus_accounts.deposit" */
export enum RuntimeEventType {
  AccountsTransfer = 'accounts.transfer',
  AccountsBurn = 'accounts.burn',
  AccountsMint = 'accounts.mint',
  ConsensusAccountsDeposit = 'consensus_accounts.deposit',
  ConsensusAccountsWithdraw = 'consensus_accounts.withdraw',
  ConsensusAccountsDelegate = 'consensus_accounts.delegate',
  ConsensusAccountsUndelegateStart = 'consensus_accounts.undelegate_start',
  ConsensusAccountsUndelegateDone = 'consensus_accounts.undelegate_done',
  CoreGasUsed = 'core.gas_used',
  EvmLog = 'evm.log',
}

/**
 * A decoded parameter of an event or error emitted from an EVM runtime.
 * Values of EVM type `int128`, `uint128`, `int256`, `uint256`, `fixed`, and `ufixed` are represented as strings.
 * Values of EVM type `address` and `address payable` are represented as lowercase hex strings with a "0x" prefix.
 * Values of EVM type `bytes` and `bytes<N>` are represented as base64 strings.
 * Values of other EVM types (integer types, strings, arrays, etc.) are represented as their JSON counterpart.
 */
export interface EvmAbiParam {
  /** The parameter name. */
  name: string
  /** The solidity type of the parameter. */
  evm_type: string
  /** The parameter value. */
  value: any
}

/** Details about the EVM token involved in the event, if any. */
export interface EvmEventToken {
  type?: EvmTokenType
  /**
   * Symbol of the token, as provided by token contract's `symbol()` method.
   * @example "USDT"
   */
  symbol?: string
  /**
   * The number of least significant digits in base units that should be displayed as
   * decimals when displaying tokens. `tokens = base_units / (10**decimals)`.
   * Affects display only. Often equals 18, to match ETH.
   * @example 18
   */
  decimals?: number
}

export interface RuntimeEvmContract {
  /**
   * The Oasis cryptographic hash of the transaction that created the smart contract.
   * Can be omitted for contracts that were created by another contract, as opposed
   * to a direct `Create` call.
   */
  creation_tx?: string
  /**
   * The Ethereum transaction hash of the transaction in `creation_tx`.
   * Encoded as a lowercase hex string.
   * @example "dc19a122e268128b5ee20366299fc7b5b199c8e3"
   */
  eth_creation_tx?: string
  /**
   * The creation bytecode of the smart contract. This includes the constructor logic
   * and the constructor parameters. When run, this code generates the runtime bytecode.
   * Can be omitted for contracts that were created by another contract, as opposed
   * to a direct `Create` call.
   * @format byte
   */
  creation_bytecode?: string
  /**
   * The runtime bytecode of the smart contract. This is the code stored on-chain that
   * describes a smart contract. Every contract has this info, but Nexus fetches
   * it separately, so the field may be missing for very fresh contracts (or if the fetching
   * process is stalled).
   * @format byte
   */
  runtime_bytecode?: string
  /**
   * The total amount of gas used to create or call this contract.
   * @format uint64
   * @example 153852
   */
  gas_used: number
  /**
   * Additional information obtained from contract verification. Only available for smart
   * contracts that have been verified successfully by Sourcify.
   */
  verification?: RuntimeEvmContractVerification
}

/**
 * The level of verification of a smart contract, as defined by Sourcify.
 * An absence of this field means that the contract has not been verified.
 * See also https://docs.sourcify.dev/docs/full-vs-partial-match/
 */
export enum VerificationLevel {
  Partial = 'partial',
  Full = 'full',
}

export interface RuntimeEvmContractVerification {
  verification_level?: VerificationLevel
  /**
   * The smart contract's [metadata.json](https://docs.soliditylang.org/en/latest/metadata.html) file in JSON format as defined by Solidity.
   * Includes the smart contract's [ABI](https://docs.soliditylang.org/en/develop/abi-spec.html).
   */
  compilation_metadata?: object
  /** Array of all contract source files, in JSON format as returned by [Sourcify](https://sourcify.dev/server/api-docs/#/Repository/get_files_any__chain___address_). */
  source_files?: object[]
}

/** A list of runtime transactions. */
export type RuntimeTransactionList = List & {
  transactions: RuntimeTransaction[]
}

/** A runtime transaction. */
export interface RuntimeTransaction {
  /**
   * The block round at which this transaction was executed.
   * @format int64
   * @example 3379702
   */
  round: number
  /**
   * The 0-based index of this transaction in the block.
   * @format int64
   * @example 0
   */
  index: number
  /**
   * The second-granular consensus time when this tx's block was proposed.
   * @format date-time
   * @example "2022-10-15T00:05:34Z"
   */
  timestamp: string
  /**
   * The Oasis cryptographic hash of this transaction's encoding.
   * @example "8394f682150e5f62b02f197d16b4769d032cb1c1b7a6dcf853ba1b12626e080b"
   */
  hash: string
  /**
   * The Ethereum cryptographic hash of this transaction's encoding.
   * Absent for non-Ethereum-format transactions.
   * @example "9e6a5837c6366d4a7e477c71ffe32d40915cdef7ef209792259e5ee70caf2705"
   */
  eth_hash?: string
  /**
   * The Oasis address of this transaction's 0th signer.
   * Unlike Ethereum, Oasis natively supports multiple-signature transactions.
   * However, the great majority of transactions only have a single signer in practice.
   * Retrieving the other signers is currently not supported by this API.
   * @example "oasis1qz670t637yyxshnlxhjj5074wgwl94d0x5x69zqd"
   */
  sender_0: Address
  /**
   * The Ethereum address of this transaction's 0th signer.
   * @example 1.2367698861069356e+48
   */
  sender_0_eth?: string
  /**
   * The nonce used with this transaction's 0th signer, to prevent replay.
   * @format uint64
   * @example 114194
   */
  nonce_0: number
  /**
   * The fee that this transaction's sender committed to pay to execute
   * it (total ParaTime base units, as a string).
   * @example "3000000000000000"
   */
  fee: string
  /** The denomination of the fee. */
  fee_symbol: string
  /** The module of the fee proxy. */
  fee_proxy_module?: string
  /**
   * the base64-encoded id of the fee proxy.
   * @format byte
   */
  fee_proxy_id?: string
  /**
   * The maximum gas that this transaction's sender committed to use to
   * execute it.
   * @format uint64
   * @example 30000
   */
  gas_limit: number
  /**
   * The total gas used by the transaction.
   * @format uint64
   */
  gas_used: number
  /**
   * The fee that was charged for the transaction execution (total, native denomination,
   * ParaTime base units, as a string).
   * For EVM transactions this is calculated as `gas_price * gas_used`, where `gas_price = fee / gas_limit`, for compatibility with Ethereum.
   * For other transactions this equals to `fee`.
   */
  charged_fee: string
  /**
   * The total byte size of the transaction.
   * @format int32
   */
  size: number
  /**
   * The data relevant to the Oasis-style encrypted transaction.
   * Note: The term "envelope" in this context refers to the [Oasis-style encryption envelopes](https://github.com/oasisprotocol/oasis-sdk/blob/c36a7ee194abf4ca28fdac0edbefe3843b39bf69/runtime-sdk/src/types/callformat.rs)
   * which differ slightly from [digital envelopes](https://en.wikipedia.org/wiki/Hybrid_cryptosystem#Envelope_encryption).
   */
  oasis_encryption_envelope?: RuntimeTransactionEncryptionEnvelope
  /**
   * The method that was called. Defined by the runtime. In theory, this could be any string as the runtimes evolve.
   * In practice, Nexus currently expects only the following methods:
   *   - "accounts.Transfer"
   *   - "consensus.Deposit"
   *   - "consensus.Withdraw"
   *   - "consensus.Delegate"
   *   - "consensus.Undelegate"
   *   - "evm.Create"
   *   - "evm.Call"
   * May be null if the transaction was malformed or encrypted.
   * @example "evm.Call"
   */
  method?: string
  /**
   * The method call body. May be null if the transaction was malformed.
   * @example {"address":"t1mAPucIdVnrYBpJOcLV2nZoOFo=","data":"RBo+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\"","value":""}
   */
  body?: object
  /**
   * Whether this transaction likely represents a native token transfer.
   * This is based on a heuristic, and can change at any time without warning and possibly without updating the documentation.
   * The current heuristic sets this to `true` for:
   *  - Transactions with method "accounts.Transfer". Those are always native token transfers.
   *  - Transactions with method "evm.Call" that have no `data` field in their `body`. Those tend to be transfers, but the runtimes provides no reliable visibility into whether a transfer happened.
   * Note: Other transactions with method "evm.Call", and possibly "evm.Create", may also be (or include) native token transfers. The heuristic will be `false` for those.
   * @example true
   */
  is_likely_native_token_transfer?: boolean
  /**
   * A reasonable "to" Oasis address associated with this transaction,
   * if applicable. The meaning varies based on the transaction method. Some notable examples:
   *   - For `method = "accounts.Transfer"`, this is the paratime account receiving the funds.
   *   - For `method = "consensus.Deposit"`, this is the paratime account receiving the funds.
   *   - For `method = "consensus.Withdraw"`, this is the consensus (!) account receiving the funds.
   *   - For `method = "consensus.Delegate"`, this is the consensus (!) account receiving the funds.
   *   - For `method = "consensus.Undelegate"`, this is the consensus (!) account to which funds were previously delegated. Note that this corresponds with the `.from` field in the transaction body.
   *   - For `method = "evm.Create"`, this is the address of the newly created smart contract.
   *   - For `method = "evm.Call"`, this is the address of the called smart contract
   * @example "oasis1qq6ulxmcagnp5nr56ylva7nhmwnxtf0krumg9dkq"
   */
  to?: Address
  /**
   * A reasonable "to" Ethereum address associated with this transaction,
   * @example 1.2367698861069356e+48
   */
  to_eth?: string
  /**
   * A reasonable "amount" associated with this transaction, if
   * applicable. The meaning varies based on the transaction method.
   * Usually in native denomination, ParaTime units. As a string.
   * @example "100000001666393459"
   */
  amount?: string
  /**
   * The denomination of the "amount" associated with this transaction, if applicable.
   * @example "ROSE"
   */
  amount_symbol?: string
  /**
   * The data relevant to the EVM encrypted transaction. Only present for encrypted
   * transactions in confidential EVM runtimes like Sapphire.
   * Note: The term "envelope" in this context refers to the [Oasis-style encryption envelopes](https://github.com/oasisprotocol/oasis-sdk/blob/c36a7ee194abf4ca28fdac0edbefe3843b39bf69/runtime-sdk/src/types/callformat.rs)
   * which differ slightly from [digital envelopes](https://en.wikipedia.org/wiki/Hybrid_cryptosystem#Envelope_encryption).
   */
  encryption_envelope?: RuntimeTransactionEncryptionEnvelope
  /**
   * Whether this transaction successfully executed.
   * Can be absent (meaning "unknown") for confidential runtimes.
   */
  success?: boolean
  /**
   * The name of the smart contract function called by the transaction.
   * Only present for `evm.log` transaction calls to contracts that have been verified.
   * @example "acceptTaskResults"
   */
  evm_fn_name?: string
  /**
   * The decoded parameters with which the smart contract function was called.
   * Only present for `evm.log` transaction calls to contracts that have been verified.
   */
  evm_fn_params?: EvmAbiParam[]
  /** Error details of a failed transaction. */
  error?: TxError
}

export interface RuntimeTransactionEncryptionEnvelope {
  /** The format of the encrypted evm transaction envelope. */
  format: CallFormat
  /**
   * The base64-encoded public key used to encrypt the transaction.
   * @format byte
   */
  public_key?: string
  /**
   * The base64-encoded nonce used to encrypt the transaction data.
   * @format byte
   */
  data_nonce?: string
  /**
   * The base64-encoded encrypted transaction data.
   * @format byte
   */
  data?: string
  /**
   * The base64-encoded nonce used to encrypt the transaction results.
   * @format byte
   */
  result_nonce?: string
  /**
   * The base64-encoded encrypted result data.
   * @format byte
   */
  result?: string
}

export interface RuntimeAccount {
  /**
   * The staking address for this account.
   * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
   */
  address: string
  address_preimage?: AddressPreimage
  /**
   * The balance(s) of this account in this runtime. Most runtimes use only one denomination, and thus
   * produce only one balance here. These balances do not include "layer (n+1) tokens", i.e. tokens
   * managed by smart contracts deployed in this runtime. For example, in EVM-compatible runtimes,
   * this does not include ERC-20 tokens
   */
  balances: RuntimeSdkBalance[]
  /**
   * Data on the EVM smart contract associated with this account address. Only present for accounts
   * that represent a smart contract on EVM.
   */
  evm_contract?: RuntimeEvmContract
  /**
   * The balances of this account in each runtime, as managed by EVM smart contracts (notably, ERC-20).
   * NOTE: This field is limited to 1000 entries. If you need more, please let us know in a GitHub issue.
   */
  evm_balances: RuntimeEvmBalance[]
  stats: AccountStats
}

export interface RuntimeStatus {
  /**
   * The number of compute nodes that are registered and can run the runtime.
   * @example 42
   */
  active_nodes: number
  /**
   * The height of the most recent indexed block (also sometimes referred to as "round") for this runtime. Query a synced Oasis node for the latest block produced.
   * @format int64
   * @example 8048956
   */
  latest_block: number
  /**
   * The RFC 3339 formatted consensus time of when the latest indexed block for this runtime was produced.
   * @format date-time
   * @example "2019-04-01T00:00:00Z"
   */
  latest_block_time: string
  /**
   * The number of milliseconds since Nexus processed the latest block.
   * @format int64
   * @example 352
   */
  latest_update_age_ms: number
}

/** The type of a EVM token. */
export enum EvmTokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
}

/** A list of tokens in a runtime. */
export type EvmTokenList = List & {
  /** A list of L2 EVM tokens (ERC-20, ERC-721, ...). */
  evm_tokens: EvmToken[]
}

export interface EvmToken {
  /**
   * The Oasis address of this token's contract.
   * @example "oasis1qp2hssandc7dekjdr6ygmtzt783k3gn38uupdeys"
   */
  contract_addr: string
  /**
   * The Ethereum address of this token's contract.
   * @example 1.2367698861069356e+48
   */
  eth_contract_addr: string
  /**
   * Name of the token, as provided by token contract's `name()` method.
   * @example "Uniswap"
   */
  name?: string
  /**
   * Symbol of the token, as provided by token contract's `symbol()` method.
   * @example "USDT"
   */
  symbol?: string
  /**
   * The number of least significant digits in base units that should be displayed as
   * decimals when displaying tokens. `tokens = base_units / (10**decimals)`.
   * Affects display only. Often equals 18, to match ETH.
   * @example 18
   */
  decimals?: number
  /**
   * The heuristically determined interface that the token contract implements.
   * A less specialized variant of the token might be detected; for example, an
   * ERC-1363 token might be labeled as ERC-20 here. If the type cannot be
   * detected or is not supported, this field will be null/absent.
   */
  type: EvmTokenType
  /** The total number of base units available. */
  total_supply?: TextBigInt
  /**
   * The total number of transfers of this token.
   * @format int64
   */
  num_transfers?: number
  /**
   * The number of addresses that have a nonzero balance of this token.
   * @format int64
   * @example 123
   */
  num_holders: number
  /**
   * Information about a swap contract between this token and a
   * reference token. The relative price and relative total value of
   * this token are estimated based on this swap contract.
   */
  ref_swap?: EvmTokenSwap
  /**
   * Information about the reference token. The relative price and
   * relative total value are expressed in this reference token's base
   * unit.
   */
  ref_token?: EvmRefToken
  /**
   * The relative price and relative total value are expressed in this
   * reference token's base unit.
   */
  relative_token_address?: string
  /**
   * The relative price of one base unit of this token is this many of
   * the relative token's base unit.
   * @format double
   */
  relative_price?: number
  /**
   * The relative price of this token multiplied by this token's total
   * supply, in the relative token's base unit.
   * @format double
   */
  relative_total_value?: number
  /**
   * Whether the contract has been successfully verified by Sourcify.
   * Additional information on verified contracts is available via
   * the `/{runtime}/accounts/{address}` endpoint.
   * DEPRECATED: This field will be removed in the future in favor of verification_level
   * @deprecated
   * @example false
   */
  is_verified: boolean
  verification_level?: VerificationLevel
}

export interface EvmTokenSwap {
  /** The Oasis address of the swap pair contract. */
  pair_address: string
  /** The Ethereum-compatible address of the swap pair contract. */
  pair_address_eth?: string
  /** The Oasis address of the swap factory contract. */
  factory_address?: string
  /** The Ethereum-compatible address of the swap factory contract. */
  factory_address_eth?: string
  /** The Oasis address of the first token in this swap. */
  token0_address?: string
  /** The Ethereum-compatible address of the first token in this swap */
  token0_address_eth?: string
  /** The Oasis address of the second token in this swap. */
  token1_address?: string
  /** The Ethereum-compatible address of the second token in this swap. */
  token1_address_eth?: string
  /**
   * The round when this swap pair was created.
   * @format int64
   */
  create_round?: number
  /** The swap's liquidity pool of the first token, in that token's base units. */
  reserve0?: TextBigInt
  /** The swap's liquidity pool of the second token, in that token's base units. */
  reserve1?: TextBigInt
  /**
   * The round when this swap pair last updated its reserves.
   * @format int64
   */
  last_sync_round?: number
}

export interface EvmRefToken {
  /**
   * The heuristically determined interface that the token contract implements.
   * A less specialized variant of the token might be detected; for example, an
   * ERC-1363 token might be labeled as ERC-20 here. If the type cannot be
   * detected or is not supported, this field will be null/absent.
   */
  type: EvmTokenType
  /**
   * Name of the token, as provided by token contract's `name()` method.
   * @example "Wrapped ROSE"
   */
  name?: string
  /**
   * Symbol of the token, as provided by token contract's `symbol()` method.
   * @example "wROSE"
   */
  symbol?: string
  /**
   * The number of least significant digits in base units that should be displayed as
   * decimals when displaying tokens. `tokens = base_units / (10**decimals)`.
   * Affects display only. Often equals 18, to match ETH.
   * @example 18
   */
  decimals?: number
}

/** A list of NFT instances. */
export type EvmNftList = List & {
  /** A list of L2 EVM NFT (ERC-721, ...) instances. */
  evm_nfts: EvmNft[]
}

export interface EvmNft {
  token: EvmToken
  /** The instance ID of this NFT within the collection represented by `token`. */
  id: TextBigInt
  /**
   * The Oasis address of this NFT instance's owner.
   * @example "oasis1qpclnnm0wu44pn43mt6vv3me59kl8zk9ty7qyj03"
   */
  owner?: Address
  /**
   * The Ethereum address of this NFT instance's owner.
   * @example "0xDEF1009df2d6872C214cd9148c6883893B7c4D91"
   */
  owner_eth?: string
  /**
   * The total number of transfers of this NFT instance.
   * @format int64
   */
  num_transfers?: number
  metadata_uri?: string
  metadata_accessed?: string
  /**
   * A metadata document for this NFT instance.
   * Currently only ERC-721 is supported, where the document is an Asset Metadata from the ERC721 Metadata JSON Schema.
   */
  metadata?: any
  /** Identifies the asset which this NFT represents */
  name?: string
  /** Describes the asset which this NFT represents */
  description?: string
  /**
   * A URI pointing to a resource with mime type image/* representing
   * the asset which this NFT represents. (Additional
   * non-descriptive text from ERC-721 omitted.)
   */
  image?: string
}

export interface AccountStats {
  /**
   * The total amount of native tokens sent, in base units.
   * DEPRECATED: This field might be inaccurate. Nexus is currently not able to track
   * certain actions which subtract/add tokens.
   * @deprecated
   */
  total_sent?: TextBigInt
  /**
   * The total amount of native tokens received, in base units.
   * DEPRECATED: This field might be inaccurate. Nexus is currently not able to track
   * certain actions which subtract/add tokens.
   * @deprecated
   */
  total_received?: TextBigInt
  /**
   * The total number of transactions this account was involved with.
   * @format uint64
   * @example 4184
   */
  num_txns: number
}

/** A list of daily transaction volumes. */
export interface TxVolumeList {
  /** @format uint32 */
  window_size_seconds: number
  /** The list of daily transaction volumes. */
  windows: TxVolume[]
}

export interface TxVolume {
  /**
   * The end timestamp for this daily transaction volume measurement.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  window_end: string
  /**
   * The transaction volume for this window.
   * @format uint64
   * @example 420
   */
  tx_volume: number
}

/** A list of daily unique active account windows. */
export interface ActiveAccountsList {
  /** @format uint32 */
  window_size_seconds: number
  /** The list of daily unique active account windows. */
  windows: ActiveAccounts[]
}

export interface ActiveAccounts {
  /**
   * The date for the end of the daily active accounts measurement window.
   * @format date-time
   * @example "2022-03-01T00:00:00Z"
   */
  window_end: string
  /**
   * The number of active accounts for the 24hour window ending at window_end.
   * @format uint64
   * @example 420
   */
  active_accounts: number
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios'
import axios from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'https://nexus.oasis.io/v1',
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title Oasis Nexus API V1
 * @version 0.1.0
 * @baseUrl https://nexus.oasis.io/v1
 *
 * An API for accessing indexed data from the Oasis Network.
 *
 * <!-- Acts as a separator after search in sidebar -->
 * # Endpoints
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http
  }

  /**
   * No description
   *
   * @name GetStatus
   * @summary Returns the status of indexing.
   * @request GET:/
   */
  getStatus = (params: RequestParams = {}) =>
    this.http.request<
      Status,
      {
        /**
         * An error message.
         * @example "internal storage error"
         */
        msg: string
      }
    >({
      path: `/`,
      method: 'GET',
      format: 'json',
      ...params,
    })

  consensus = {
    /**
     * No description
     *
     * @tags Experimental
     * @name BlocksList
     * @summary Returns a list of consensus blocks, sorted from most to least recent.
     * @request GET:/consensus/blocks
     * @deprecated
     */
    blocksList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on minimum block height, inclusive.
         * @format int64
         * @example 8048956
         */
        from?: number
        /**
         * A filter on maximum block height, inclusive.
         * @format int64
         * @example 8049555
         */
        to?: number
        /**
         * A filter on minimum block time, inclusive.
         * @format date-time
         * @example "2022-03-01T00:00:00Z"
         */
        after?: string
        /**
         * A filter on maximum block time, exclusive.
         * @format date-time
         * @example "2019-04-01T00:00:00Z"
         */
        before?: string
        /**
         * A filter on the block hash.
         * @example "0a29ac21fa69bb9e43e5cb25d10826ff3946f1ce977e82f99a2614206a50765c"
         */
        hash?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        BlockList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/blocks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name BlocksDetail
     * @summary Returns a consensus block.
     * @request GET:/consensus/blocks/{height}
     * @deprecated
     */
    blocksDetail: (height: number, params: RequestParams = {}) =>
      this.http.request<
        Block,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/blocks/${height}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name TransactionsList
     * @summary Returns a list of consensus transactions.
     * @request GET:/consensus/transactions
     * @deprecated
     */
    transactionsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on block height.
         * @format int64
         * @example 8048956
         */
        block?: number
        /** A filter on transaction method. */
        method?: ConsensusTxMethod
        /** A filter on transaction sender. */
        sender?: StakingAddress
        /**
         * A filter on related accounts.
         * @example "oasis1qpg2xuz46g53737343r20yxeddhlvc2ldqsjh70p"
         */
        rel?: string
        /**
         * A filter on minimum transaction time, inclusive.
         * @format date-time
         * @example "2022-03-01T00:00:00Z"
         */
        after?: string
        /**
         * A filter on maximum transaction time, exclusive.
         * @format date-time
         * @example "2019-04-01T00:00:00Z"
         */
        before?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        TransactionList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name TransactionsDetail
     * @summary Returns consensus transactions with the given transaction hash.
     * @request GET:/consensus/transactions/{tx_hash}
     * @deprecated
     */
    transactionsDetail: (txHash: string, params: RequestParams = {}) =>
      this.http.request<
        TransactionList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/transactions/${txHash}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EventsList
     * @summary Returns a list of consensus events.
     * @request GET:/consensus/events
     * @deprecated
     */
    eventsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on block height.
         * @format int64
         * @example 8048956
         */
        block?: number
        /**
         * A filter on transaction index. The returned events all need to originate
         * from a transaction that appeared in `tx_index`-th position in the block.
         * It is invalid to specify this filter without also specifying a `block`.
         * Specifying `tx_index` and `block` is an alternative to specifying `tx_hash`;
         * either works to fetch events from a specific transaction.
         * @format int32
         * @example 3
         */
        tx_index?: number
        /**
         * A filter on the hash of the transaction that originated the events.
         * Specifying `tx_index` and `block` is an alternative to specifying `tx_hash`;
         * either works to fetch events from a specific transaction.
         * @example "0d0531d6b8a468c07440182b1cdda517f5a076d69fb2199126a83082ecfc0f41"
         */
        tx_hash?: string
        /**
         * A filter on related accounts. Every returned event will refer to
         * this account. For example, for a `Transfer` event, this will be the
         * the sender or the recipient of tokens.
         */
        rel?: StakingAddress
        /**
         * A filter on the event type.
         * @example "staking.escrow.take"
         */
        type?: ConsensusEventType
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ConsensusEventList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/events`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name RoothashMessagesList
     * @request GET:/consensus/roothash_messages
     * @deprecated
     */
    roothashMessagesList: (
      query: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        runtime: Runtime
        /** @format int64 */
        round?: number
        type?: RoothashMessageType
        rel?: StakingAddress
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        RoothashMessageList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/roothash_messages`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EntitiesList
     * @summary Returns a list of entities registered at the consensus layer.
     * @request GET:/consensus/entities
     * @deprecated
     */
    entitiesList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        EntityList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/entities`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EntitiesDetail
     * @summary Returns an entity registered at the consensus layer.
     * @request GET:/consensus/entities/{address}
     * @deprecated
     */
    entitiesDetail: (address: StakingAddress, params: RequestParams = {}) =>
      this.http.request<
        Entity,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/entities/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EntitiesNodesDetail
     * @summary Returns a list of nodes registered at the consensus layer.
     * @request GET:/consensus/entities/{address}/nodes
     * @deprecated
     */
    entitiesNodesDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        NodeList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/entities/${address}/nodes`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EntitiesNodesDetail2
     * @summary Returns a node registered at the consensus layer.
     * @request GET:/consensus/entities/{address}/nodes/{node_id}
     * @deprecated
     * @originalName entitiesNodesDetail
     * @duplicate
     */
    entitiesNodesDetail2: (address: StakingAddress, nodeId: Ed25519PubKey, params: RequestParams = {}) =>
      this.http.request<
        Node,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/entities/${address}/nodes/${nodeId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ValidatorsList
     * @summary Returns a list of validators registered at the consensus layer (the list includes all registered entities, even those without a currently active validator node).
     * @request GET:/consensus/validators
     * @deprecated
     */
    validatorsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on the validator name. Every returned validator will have
         * a name that is a superstring of the input param.
         */
        name?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ValidatorList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/validators`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ValidatorsDetail
     * @summary Returns a validator registered at the consensus layer.
     * @request GET:/consensus/validators/{address}
     * @deprecated
     */
    validatorsDetail: (address: StakingAddress, params: RequestParams = {}) =>
      this.http.request<
        ValidatorList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/validators/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ValidatorsHistoryDetail
     * @summary Returns historical information for a single validator.
     * @request GET:/consensus/validators/{address}/history
     * @deprecated
     */
    validatorsHistoryDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on minimum epoch number, inclusive.
         * @format int64
         * @example 13402
         */
        from?: number
        /**
         * A filter on maximum epoch number, inclusive.
         * @format int64
         * @example 13403
         */
        to?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ValidatorHistory,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/validators/${address}/history`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 *
 * @tags Experimental
 * @name AccountsList
 * @summary Returns a list of consensus layer accounts.
Note that for performance reasons, the info returned by this endpoint
may be slightly stale (<2 minutes). For the most up-to-date account state,
query the single-account endpoint.
 * @request GET:/consensus/accounts
 * @deprecated
 */
    accountsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        AccountList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name AccountsDetail
     * @summary Returns a consensus layer account.
     * @request GET:/consensus/accounts/{address}
     * @deprecated
     */
    accountsDetail: (address: StakingAddress, params: RequestParams = {}) =>
      this.http.request<
        Account,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name AccountsDelegationsDetail
     * @summary Returns an account's delegations.
     * @request GET:/consensus/accounts/{address}/delegations
     * @deprecated
     */
    accountsDelegationsDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        DelegationList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts/${address}/delegations`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name AccountsDelegationsToDetail
     * @summary Returns a list of delegations to an account.
     * @request GET:/consensus/accounts/{address}/delegations_to
     * @deprecated
     */
    accountsDelegationsToDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        DelegationList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts/${address}/delegations_to`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name AccountsDebondingDelegationsDetail
     * @summary Returns an account's debonding delegations.
     * @request GET:/consensus/accounts/{address}/debonding_delegations
     * @deprecated
     */
    accountsDebondingDelegationsDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        DebondingDelegationList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts/${address}/debonding_delegations`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name AccountsDebondingDelegationsToDetail
     * @summary Returns a list of debonding delegations to an account.
     * @request GET:/consensus/accounts/{address}/debonding_delegations_to
     * @deprecated
     */
    accountsDebondingDelegationsToDetail: (
      address: StakingAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        DebondingDelegationList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/accounts/${address}/debonding_delegations_to`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EpochsList
     * @summary Returns a list of consensus epochs.
     * @request GET:/consensus/epochs
     * @deprecated
     */
    epochsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        EpochList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/epochs`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name EpochsDetail
     * @summary Returns a consensus epoch.
     * @request GET:/consensus/epochs/{epoch}
     * @deprecated
     */
    epochsDetail: (epoch: number, params: RequestParams = {}) =>
      this.http.request<
        Epoch,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/epochs/${epoch}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ProposalsList
     * @summary Returns a list of governance proposals.
     * @request GET:/consensus/proposals
     * @deprecated
     */
    proposalsList: (
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /** Filter on the submitter of the proposal. */
        submitter?: StakingAddress
        /**
         * Filter on the state of the proposal.
         * @example "active"
         */
        state?: ProposalState
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ProposalList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/proposals`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ProposalsDetail
     * @summary Returns a governance proposal.
     * @request GET:/consensus/proposals/{proposal_id}
     * @deprecated
     */
    proposalsDetail: (proposalId: number, params: RequestParams = {}) =>
      this.http.request<
        Proposal,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/proposals/${proposalId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Experimental
     * @name ProposalsVotesDetail
     * @summary Returns a list of votes for a governance proposal.
     * @request GET:/consensus/proposals/{proposal_id}/votes
     * @deprecated
     */
    proposalsVotesDetail: (
      proposalId: number,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ProposalVotes,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/consensus/proposals/${proposalId}/votes`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  runtime = {
    /**
     * No description
     *
     * @name BlocksDetail
     * @summary Returns a list of Runtime blocks.
     * @request GET:/{runtime}/blocks
     */
    blocksDetail: (
      runtime: Runtime,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on minimum block height, inclusive.
         * @format int64
         * @example 8048956
         */
        from?: number
        /**
         * A filter on maximum block height, inclusive.
         * @format int64
         * @example 8049555
         */
        to?: number
        /**
         * A filter on minimum block time, inclusive.
         * @format date-time
         * @example "2022-03-01T00:00:00Z"
         */
        after?: string
        /**
         * A filter on maximum block time, exclusive.
         * @format date-time
         * @example "2019-04-01T00:00:00Z"
         */
        before?: string
        /**
         * A filter on the block hash.
         * @example "0a29ac21fa69bb9e43e5cb25d10826ff3946f1ce977e82f99a2614206a50765c"
         */
        hash?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        RuntimeBlockList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/blocks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name TransactionsDetail
     * @summary Returns a list of Runtime transactions.
     * @request GET:/{runtime}/transactions
     */
    transactionsDetail: (
      runtime: Runtime,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on block round.
         * @format int64
         * @example 3283246
         */
        block?: number
        /**
         * A filter on minimum transaction time, inclusive.
         * @format date-time
         * @example "2022-03-01T00:00:00Z"
         */
        after?: string
        /**
         * A filter on maximum transaction time, exclusive.
         * @format date-time
         * @example "2019-04-01T00:00:00Z"
         */
        before?: string
        /**
         * A filter on related accounts. Every returned transaction will refer to
         * this account in a way. For example, for an `accounts.Transfer` tx, this will be
         * the sender or the recipient of tokens.
         * Nexus detects related accounts inside EVM transactions and events on a
         * best-effort basis. For example, it inspects ERC20 methods inside `evm.Call` txs.
         */
        rel?: EthOrOasisAddress
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        RuntimeTransactionList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name TransactionsDetail2
     * @summary Returns runtime transactions with the given transaction hash.
     * @request GET:/{runtime}/transactions/{tx_hash}
     * @originalName transactionsDetail
     * @duplicate
     */
    transactionsDetail2: (runtime: Runtime, txHash: string, params: RequestParams = {}) =>
      this.http.request<
        RuntimeTransactionList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/transactions/${txHash}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name EventsDetail
     * @summary Returns a list of runtime events.
     * @request GET:/{runtime}/events
     */
    eventsDetail: (
      runtime: Runtime,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * A filter on block round.
         * @format int64
         * @example 3283246
         */
        block?: number
        /**
         * A filter on transaction index. The returned events all need to originate
         * from a transaction that appeared in `tx_index`-th position in the block.
         * It is invalid to specify this filter without also specifying a `block`.
         * Specifying `tx_index` and `round` is an alternative to specifying `tx_hash`;
         * either works to fetch events from a specific transaction.
         * @format int32
         * @example 3
         */
        tx_index?: number
        /**
         * A filter on the hash of the transaction that originated the events.
         * Specifying `tx_index` and `round` is an alternative to specifying `tx_hash`;
         * either works to fetch events from a specific transaction.
         * This can be an Ethereum transaction hash; the query will compare against
         * both a transaction's regular tx_hash and eth_tx_hash (if it exists).
         * @example "0d0531d6b8a468c07440182b1cdda517f5a076d69fb2199126a83082ecfc0f41"
         */
        tx_hash?: string
        /** A filter on the event type. */
        type?: RuntimeEventType
        /**
         * A filter on related accounts. Every returned event will refer to
         * this account. For example, for a `accounts.Transfer` event, this will be
         * the sender or the recipient of tokens.
         */
        rel?: EthOrOasisAddress
        /**
         * A filter on the evm log signatures.
         * Note: The filter will only match on parsed (verified) EVM events.
         * @example "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
         */
        evm_log_signature?: string
        /**
         * A filter on a smart contract. Every returned event will have been
         * emitted by the contract at this address.
         */
        contract_address?: EthOrOasisAddress
        /**
         * A filter on NFT events. Every returned event will be specifically
         * about this NFT instance ID. You must specify the contract_address
         * filter with this filter.
         * Currently this only supports ERC-721 Transfer events.
         * This may expand to support other event types in the future.
         * If you want only ERC-721 Transfer events, specify
         * evm_log_signature=ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
         * to avoid inadvertently getting other event types if they are
         * supported later.
         * Using an evm_log_signature filter with this set to any other value
         * will match no events.
         * @example "999"
         */
        nft_id?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        RuntimeEventList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/events`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name EvmTokensDetail
     * @summary Returns a list of EVM (ERC-20, ...) tokens on the runtime.
     * @request GET:/{runtime}/evm_tokens
     */
    evmTokensDetail: (
      runtime: Runtime,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /** A filter on the name, the name or symbol must contain this value as a substring. */
        name?: string
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        EvmTokenList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/evm_tokens`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name EvmTokensDetail2
     * @summary Returns info on an EVM (ERC-20, ...) token on the runtime.
     * @request GET:/{runtime}/evm_tokens/{address}
     * @originalName evmTokensDetail
     * @duplicate
     */
    evmTokensDetail2: (runtime: Runtime, address: EthOrOasisAddress, params: RequestParams = {}) =>
      this.http.request<
        EvmToken,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/evm_tokens/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * No description
 *
 * @name HoldersDetail
 * @summary Returns the list of holders of an EVM (ERC-20, ...) token.
This endpoint does not verify that `address` is actually an EVM token; if it is not, it will simply return an empty list.
 * @request GET:/{runtime}/evm_tokens/{address}/holders
 */
    holdersDetail: (
      runtime: Runtime,
      address: EthOrOasisAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        TokenHolderList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/evm_tokens/${address}/holders`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 *
 * @name NftsDetail
 * @summary Returns the list of non-fungible token (NFT) instances of an EVM (ERC-721, ...) token.
This endpoint does not verify that `address` is actually an EVM token; if it is not, it will simply return an empty list.
 * @request GET:/{runtime}/evm_tokens/{address}/nfts
 */
    nftsDetail: (
      runtime: Runtime,
      address: EthOrOasisAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        EvmNftList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/evm_tokens/${address}/nfts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name NftsDetail2
     * @summary Returns the non-fungible token (NFT) instance of an EVM (ERC-721, ...) token.
     * @request GET:/{runtime}/evm_tokens/{address}/nfts/{id}
     * @originalName nftsDetail
     * @duplicate
     */
    nftsDetail2: (runtime: Runtime, address: EthOrOasisAddress, id: TextBigInt, params: RequestParams = {}) =>
      this.http.request<
        EvmNft,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/evm_tokens/${address}/nfts/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AccountsDetail
     * @summary Returns a runtime account.
     * @request GET:/{runtime}/accounts/{address}
     */
    accountsDetail: (runtime: Runtime, address: EthOrOasisAddress, params: RequestParams = {}) =>
      this.http.request<
        RuntimeAccount,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/accounts/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name NftsDetail3
     * @summary Returns the list of non-fungible token (NFT) instances owned by an account.
     * @request GET:/{runtime}/accounts/{address}/nfts
     * @originalName nftsDetail
     * @duplicate
     */
    nftsDetail3: (
      runtime: Runtime,
      address: EthOrOasisAddress,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /** Only return NFT instances from the token contract at the given staking address. */
        token_address?: EthOrOasisAddress
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        EvmNftList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/accounts/${address}/nfts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name StatusDetail
     * @summary Returns the runtime status.
     * @request GET:/{runtime}/status
     */
    statusDetail: (runtime: Runtime, params: RequestParams = {}) =>
      this.http.request<
        RuntimeStatus,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${runtime}/status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  layer = {
    /**
 * No description
 *
 * @name TxVolumeDetail
 * @summary Returns a timeline of the transaction volume at the chosen granularity,
for either consensus or one of the paratimes.
 * @request GET:/{layer}/stats/tx_volume
 */
    txVolumeDetail: (
      layer: Layer,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * The size of windows into which the statistic is grouped, in seconds.
         * The backend supports a limited number of window sizes: 300 (5 minutes) and
         * 86400 (1 day). Requests with other values may be rejected.
         * @format uint32
         * @default 86400
         */
        window_size_seconds?: number
        /**
         * The size of the step between returned statistic windows, in seconds.
         * The backend supports a limited number of step sizes: 300 (5 minutes) and
         * 86400 (1 day). Requests with other values may be rejected.
         * @format uint32
         * @default 86400
         */
        window_step_seconds?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        TxVolumeList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${layer}/stats/tx_volume`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 *
 * @name ActiveAccountsDetail
 * @summary Returns a (sliding) timeline of the recorded daily unique active accounts for
either consensus or one of the paratimes.
 * @request GET:/{layer}/stats/active_accounts
 */
    activeAccountsDetail: (
      layer: Layer,
      query?: {
        /**
         * The maximum numbers of items to return.
         * @format uint64
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number
        /**
         * The number of items to skip before starting to collect the result set.
         * @format uint64
         * @default 0
         */
        offset?: number
        /**
         * The size of the step between returned statistic windows, in seconds.
         * The backend supports a limited number of step sizes: 300 (5 minutes) and
         * 86400 (1 day). Requests with other values may be rejected.
         * @format uint32
         * @default 86400
         */
        window_step_seconds?: number
      },
      params: RequestParams = {}
    ) =>
      this.http.request<
        ActiveAccountsList,
        {
          /**
           * An error message.
           * @example "internal storage error"
           */
          msg: string
        }
      >({
        path: `/${layer}/stats/active_accounts`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
}
