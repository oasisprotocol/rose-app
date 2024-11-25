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

/** AccountAllowance */
export interface AccountAllowance {
  address: string
  amount: string
}

/** AccountDebondingInfo */
export interface AccountDebondingInfo {
  validatorAddress: string
  validatorName: string
  icon: string
  shares: string
  /** @format int64 */
  debondEnd: number
  /** @format int64 */
  epochLeft: number
}

/** AccountDebondingRequest */
export interface AccountDebondingRequest {
  address: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** AccountDebondingResponse */
export interface AccountDebondingResponse {
  list: AccountDebondingInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** AccountDelegationsInfo */
export interface AccountDelegationsInfo {
  validatorAddress: string
  validatorName: string
  icon: string
  entityAddress: string
  shares: string
  amount: string
  /** @format boolean */
  active: boolean
}

/** AccountDelegationsRequest */
export interface AccountDelegationsRequest {
  address: string
  /**
   * @format boolean
   * @default "false"
   */
  all: boolean
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** AccountDelegationsResponse */
export interface AccountDelegationsResponse {
  list: AccountDelegationsInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** AccountInfoRequest */
export type AccountInfoRequest = object

/** AccountInfoResponse */
export interface AccountInfoResponse {
  address: string
  available: string
  escrow: string
  debonding: string
  total: string
  /** @format int64 */
  nonce: number
  allowances: AccountAllowance[]
}

/** AccountRewardExportRequest */
export interface AccountRewardExportRequest {
  account: string
}

/** AccountRewardExportResponse */
export type AccountRewardExportResponse = object

/** AccountRewardInfo */
export interface AccountRewardInfo {
  validatorAddress: string
  validatorName: string
  validatorIcon: string
  /** @format int64 */
  epoch: number
  /** @format int64 */
  timestamp: number
  reward: string
}

/** AccountRewardRequest */
export interface AccountRewardRequest {
  account: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** AccountRewardResponse */
export interface AccountRewardResponse {
  list: AccountRewardInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** AccountRewardStatsInfo */
export interface AccountRewardStatsInfo {
  validatorName: string
  rewardList: AccountRewardStatsItem[]
  total: string
}

/** AccountRewardStatsItem */
export interface AccountRewardStatsItem {
  /** @format int64 */
  dateTime: number
  reward: string
}

/** AccountRewardStatsRequest */
export interface AccountRewardStatsRequest {
  account: string
}

/** AccountRewardStatsResponse */
export interface AccountRewardStatsResponse {
  stats: Record<string, AccountRewardStatsInfo>
  time: number[]
}

/** AccountStakingEventsInfo */
export interface AccountStakingEventsInfo {
  id: string
  /** @format int64 */
  height: number
  txHash: string
  kind: string
}

/** AccountStakingEventsInfoRequest */
export interface AccountStakingEventsInfoRequest {
  id: string
}

/** AccountStakingEventsInfoResponse */
export interface AccountStakingEventsInfoResponse {
  /** @format int64 */
  height: number
  txHash: string
  kind: string
  /** @format int64 */
  timestamp: number
  transafer?: object
  burn?: object
  escrow?: object
  allowanceChange?: object
}

/** AccountStakingEventsRequest */
export interface AccountStakingEventsRequest {
  address: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** AccountStakingEventsResponse */
export interface AccountStakingEventsResponse {
  list: AccountStakingEventsInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** Bound */
export interface Bound {
  /** @format int64 */
  start: number
  /** @format double */
  min: number
  /** @format double */
  max: number
}

/** ChainBlockInfo */
export interface ChainBlockInfo {
  /** @format int64 */
  height: number
  /** @format int64 */
  epoch: number
  /** @format int64 */
  timestamp: number
  /** @format int64 */
  time: number
  hash: string
  /** @format int64 */
  txs: number
  entityAddress: string
  name: string
}

/** ChainBlockInfoRequest */
export type ChainBlockInfoRequest = object

/** ChainBlockInfoResponse */
export interface ChainBlockInfoResponse {
  /** @format int64 */
  height?: number
  /** @format int64 */
  epoch?: number
  /** @format int64 */
  timestamp?: number
  /** @format int64 */
  time?: number
  hash?: string
  /** @format int64 */
  txs?: number
  entityAddress?: string
  name?: string
}

/** ChainBlocksRequest */
export interface ChainBlocksRequest {
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "10"
   */
  size: number
}

/** ChainBlocksResponse */
export interface ChainBlocksResponse {
  list: ChainBlockInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** ChainMethodsRequest */
export type ChainMethodsRequest = object

/** ChainMethodsResponse */
export interface ChainMethodsResponse {
  list: string[]
}

/** ChainProposedBlocksRequest */
export interface ChainProposedBlocksRequest {
  address?: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** ChainProposedBlocksResponse */
export interface ChainProposedBlocksResponse {
  list: ChainBlockInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** ChainSearchRequest */
export interface ChainSearchRequest {
  key: string
}

/** ChainSearchResponse */
export interface ChainSearchResponse {
  key: string
  type: string
  result: string
}

/** ChainTransactionInfoRequest */
export type ChainTransactionInfoRequest = object

/** ChainTransactionInfoResponse */
export interface ChainTransactionInfoResponse {
  txHash: string
  /** @format int64 */
  timestamp: number
  /** @format int64 */
  time: number
  /** @format int64 */
  height: number
  fee: string
  /** @format int64 */
  nonce: number
  method: string
  from: string
  to: string
  amount: string
  raw: string
  /** @format boolean */
  status: boolean
  errorMessage: string
}

/** ChainTransactionListInfo */
export interface ChainTransactionListInfo {
  txType: string
  txHash?: string
  /** @format int64 */
  height?: number
  method?: string
  fee?: string
  amount?: string
  shares?: string
  /** @format boolean */
  add?: boolean
  /** @format int64 */
  timestamp?: number
  /** @format int64 */
  time?: number
  /** @format boolean */
  status?: boolean
  from?: string
  to?: string
  runtimeId?: string
  runtimeName?: string
  /** @format int64 */
  round?: number
  /** @format boolean */
  result?: boolean
  type?: string
}

/** ChainTransactionsRequest */
export interface ChainTransactionsRequest {
  /** @format int64 */
  height?: number
  address?: string
  method?: string
  /**
   * @format boolean
   * @default "false"
   */
  runtime: boolean
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "10"
   */
  size: number
}

/** ChainTransactionsResponse */
export interface ChainTransactionsResponse {
  list: ChainTransactionListInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** Chart */
export interface Chart {
  key: string
  value: string
}

/** DelegatorsInfo */
export interface DelegatorsInfo {
  address: string
  amount: string
  shares: string
  /** @format double */
  percent: number
  /** @format boolean */
  self: boolean
}

/** DelegatorsRequest */
export interface DelegatorsRequest {
  address: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** DelegatorsResponse */
export interface DelegatorsResponse {
  list: DelegatorsInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** EscrowStatus */
export interface EscrowStatus {
  self: string
  other: string
  total: string
}

/** GovernanceProposalInfo */
export interface GovernanceProposalInfo {
  /** @format int64 */
  id: number
  title: string
  type: string
  submitter: string
  state: string
  deposit: string
  /** @format int64 */
  created_at: number
  /** @format int64 */
  closed_at: number
  /** @format int64 */
  created_time: number
  /** @format int64 */
  closed_time: number
}

/** GovernanceProposalListRequest */
export type GovernanceProposalListRequest = object

/** GovernanceProposalListResponse */
export interface GovernanceProposalListResponse {
  list: GovernanceProposalInfo[]
}

/** GovernanceProposalWithVotesRequest */
export interface GovernanceProposalWithVotesRequest {
  /** @format int64 */
  id: number
}

/** GovernanceProposalWithVotesResponse */
export interface GovernanceProposalWithVotesResponse {
  options: ProposalOption[]
  votes: ProposalVote[]
}

/** GovernanceVotesRequest */
export interface GovernanceVotesRequest {
  /** @format int64 */
  proposalId?: number
  validator?: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "5"
   */
  size: number
}

/** GovernanceVotesResponse */
export interface GovernanceVotesResponse {
  list: ProposalVote[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** HealthRequest */
export type HealthRequest = object

/** HealthResponse */
export type HealthResponse = object

/** MarketChartRequest */
export type MarketChartRequest = object

/** MarketChartResponse */
export interface MarketChartResponse {
  price: Chart[]
  marketCap: Chart[]
  volume: Chart[]
}

/** MarketInfoRequest */
export type MarketInfoRequest = object

/** MarketInfoResponse */
export interface MarketInfoResponse {
  /** @format double */
  price: number
  /** @format double */
  priceChangePct24h: number
  /** @format int64 */
  rank: number
  /** @format int64 */
  marketCap: number
  /** @format double */
  marketCapChangePct24h: number
  /** @format int64 */
  volume: number
  /** @format double */
  volumeChangePct24h: number
}

/** NetworkStatusRequest */
export type NetworkStatusRequest = object

/** NetworkStatusResponse */
export interface NetworkStatusResponse {
  /** @format int64 */
  curHeight: number
  /** @format int64 */
  curEpoch: number
  /** @format int64 */
  totalTxs: number
  totalEscrow: string
  /** @format int64 */
  activeValidator: number
  /** @format int64 */
  totalDelegator: number
}

/** NetworkTrendRequest */
export type NetworkTrendRequest = object

/** NetworkTrendResponse */
export interface NetworkTrendResponse {
  tx: Chart[]
  escrow: Chart[]
}

/** Page */
export interface Page {
  /** @format int64 */
  page: number
  /** @format int64 */
  size: number
  /** @format int64 */
  maxPage: number
  /** @format int64 */
  totalSize: number
}

/** ProposalOption */
export interface ProposalOption {
  name: string
  amount: string
  /** @format double */
  percent: number
}

/** ProposalVote */
export interface ProposalVote {
  /** @format int64 */
  proposalId: number
  title: string
  name: string
  icon: string
  address: string
  vote: string
  amount: string
  /** @format double */
  percent: number
}

/** Rate */
export interface Rate {
  /** @format int64 */
  start: number
  /** @format double */
  rate: number
}

/** RuntimeListInfo */
export interface RuntimeListInfo {
  runtimeId: string
  name: string
}

/** RuntimeListRequest */
export type RuntimeListRequest = object

/** RuntimeListResponse */
export interface RuntimeListResponse {
  list: RuntimeListInfo[]
}

/** RuntimeRoundInfo */
export interface RuntimeRoundInfo {
  /** @format int64 */
  version: number
  runtimeId: string
  runtimeName: string
  /** @format int64 */
  round: number
  /** @format int64 */
  timestamp: number
  /** @format int64 */
  header_type: number
  previous_hash: string
  io_root: string
  state_root: string
  messages_hash: string
  /** @format boolean */
  next: boolean
}

/** RuntimeRoundInfoRequest */
export interface RuntimeRoundInfoRequest {
  id: string
  /** @format int64 */
  round: number
}

/** RuntimeRoundInfoResponse */
export interface RuntimeRoundInfoResponse {
  /** @format int64 */
  version?: number
  runtimeId?: string
  runtimeName?: string
  /** @format int64 */
  round?: number
  /** @format int64 */
  timestamp?: number
  /** @format int64 */
  header_type?: number
  previous_hash?: string
  io_root?: string
  state_root?: string
  messages_hash?: string
  /** @format boolean */
  next?: boolean
}

/** RuntimeRoundListRequest */
export interface RuntimeRoundListRequest {
  id: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "10"
   */
  size: number
}

/** RuntimeRoundListResponse */
export interface RuntimeRoundListResponse {
  list: RuntimeRoundInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** RuntimeStatsInfo */
export interface RuntimeStatsInfo {
  entityId: string
  name: string
  address: string
  /** @format boolean */
  validator: boolean
  icon: string
  /** @format boolean */
  status: boolean
  stats: RuntimeStatsItem
}

/** RuntimeStatsItem */
export interface RuntimeStatsItem {
  /** @format int64 */
  elected: number
  /** @format int64 */
  primary: number
  /** @format int64 */
  backup: number
  /** @format int64 */
  proposer: number
}

/** RuntimeStatsRequest */
export interface RuntimeStatsRequest {
  id: string
}

/** RuntimeStatsResponse */
export interface RuntimeStatsResponse {
  /** @format int64 */
  online: number
  /** @format int64 */
  offline: number
  list: RuntimeStatsInfo[]
}

/** RuntimeTransactionConsensusTx */
export interface RuntimeTransactionConsensusTx {
  method: string
  from: string
  to: string
  amount: string
  /** @format int64 */
  nonce: number
}

/** RuntimeTransactionEventError */
export interface RuntimeTransactionEventError {
  /** @format int64 */
  code: number
  module: string
}

/** RuntimeTransactionEvmTx */
export interface RuntimeTransactionEvmTx {
  hash: string
  from: string
  to: string
  /** @format int64 */
  nonce: number
  /** @format int64 */
  gasPrice: number
  /** @format int64 */
  gasLimit: number
  data: string
  value: string
}

/** RuntimeTransactionInfoRequest */
export interface RuntimeTransactionInfoRequest {
  id: string
  /** @format int64 */
  round: number
  hash: string
}

/** RuntimeTransactionInfoResponse */
export interface RuntimeTransactionInfoResponse {
  runtimeId: string
  runtimeName: string
  txHash: string
  /** @format int64 */
  round: number
  /** @format boolean */
  result: boolean
  message: string
  /** @format int64 */
  timestamp: number
  type: string
  ctx: RuntimeTransactionConsensusTx
  etx: RuntimeTransactionEvmTx
  events: object
}

/** RuntimeTransactionListInfo */
export interface RuntimeTransactionListInfo {
  runtimeId: string
  txHash: string
  /** @format int64 */
  round: number
  /** @format boolean */
  result: boolean
  /** @format int64 */
  timestamp: number
  type: string
}

/** RuntimeTransactionListRequest */
export interface RuntimeTransactionListRequest {
  id?: string
  address?: string
  /** @format int64 */
  round?: number
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "10"
   */
  size: number
}

/** RuntimeTransactionListResponse */
export interface RuntimeTransactionListResponse {
  list: RuntimeTransactionListInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** ValidatorBlocksStatsInfo */
export interface ValidatorBlocksStatsInfo {
  /** @format int64 */
  height: number
  /** @format boolean */
  block: boolean
}

/** ValidatorBlocksStatsRequest */
export interface ValidatorBlocksStatsRequest {
  address: string
}

/** ValidatorBlocksStatsResponse */
export interface ValidatorBlocksStatsResponse {
  signs: ValidatorBlocksStatsInfo[]
  proposals: ValidatorBlocksStatsInfo[]
}

/** ValidatorEscrowEventRequest */
export interface ValidatorEscrowEventRequest {
  address: string
  /**
   * @format int64
   * @default "1"
   */
  page: number
  /**
   * @format int64
   * @default "10"
   */
  size: number
}

/** ValidatorEscrowEventResponse */
export interface ValidatorEscrowEventResponse {
  list: ChainTransactionListInfo[]
  /** @format int64 */
  page?: number
  /** @format int64 */
  size?: number
  /** @format int64 */
  maxPage?: number
  /** @format int64 */
  totalSize?: number
}

/** ValidatorEscrowStatsInfo */
export interface ValidatorEscrowStatsInfo {
  /** @format int64 */
  timestamp: number
  escrow: string
}

/** ValidatorEscrowStatsRequest */
export interface ValidatorEscrowStatsRequest {
  address: string
}

/** ValidatorEscrowStatsResponse */
export interface ValidatorEscrowStatsResponse {
  list: ValidatorEscrowStatsInfo[]
}

/** ValidatorInfo */
export interface ValidatorInfo {
  /** @format int32 */
  rank: number
  entityId: string
  entityAddress: string
  nodeId: string
  nodeAddress: string
  name: string
  icon: string
  website: string
  twitter: string
  keybase: string
  email: string
  description: string
  escrow: string
  escrowChange24: string
  /** @format double */
  escrowPercent: number
  balance: string
  totalShares: string
  /** @format int64 */
  signs: number
  /** @format int64 */
  proposals: number
  /** @format int64 */
  nonce: number
  /** @format int64 */
  score: number
  /** @format int64 */
  delegators: number
  nodes?: string[]
  uptime: string
  /** @format boolean */
  active: boolean
  /** @format double */
  commission: number
  bound?: Bound
  rates: Rate[]
  bounds: Bound[]
  escrowSharesStatus?: EscrowStatus
  escrowAmountStatus?: EscrowStatus
  runtimes?: ValidatorRuntime[]
  /** @format boolean */
  status: boolean
}

/** ValidatorInfoRequest */
export interface ValidatorInfoRequest {
  address: string
}

/** ValidatorInfoResponse */
export interface ValidatorInfoResponse {
  /** @format int32 */
  rank?: number
  entityId?: string
  entityAddress?: string
  nodeId?: string
  nodeAddress?: string
  name?: string
  icon?: string
  website?: string
  twitter?: string
  keybase?: string
  email?: string
  description?: string
  escrow?: string
  escrowChange24?: string
  /** @format double */
  escrowPercent?: number
  balance?: string
  totalShares?: string
  /** @format int64 */
  signs?: number
  /** @format int64 */
  proposals?: number
  /** @format int64 */
  nonce?: number
  /** @format int64 */
  score?: number
  /** @format int64 */
  delegators?: number
  nodes?: string[]
  uptime?: string
  /** @format boolean */
  active?: boolean
  /** @format double */
  commission?: number
  bound?: Bound
  rates?: Rate[]
  bounds?: Bound[]
  escrowSharesStatus?: EscrowStatus
  escrowAmountStatus?: EscrowStatus
  runtimes?: ValidatorRuntime[]
  /** @format boolean */
  status?: boolean
}

/** ValidatorListRequest */
export interface ValidatorListRequest {
  /** @default "escrow" */
  orderBy: string
  /** @default "desc" */
  sort: string
}

/** ValidatorListResponse */
export interface ValidatorListResponse {
  list: ValidatorInfo[]
  /** @format int64 */
  active: number
  /** @format int64 */
  inactive: number
  /** @format int64 */
  delegators: number
}

/** ValidatorRuntime */
export interface ValidatorRuntime {
  name: string
  id: string
  /** @format boolean */
  online: boolean
}

/** ValidatorSignStatsInfo */
export interface ValidatorSignStatsInfo {
  /** @format int64 */
  dateTime: number
  /** @format int64 */
  expected: number
  /** @format int64 */
  actual: number
}

/** ValidatorSignStatsRequest */
export interface ValidatorSignStatsRequest {
  address: string
}

/** ValidatorSignStatsResponse */
export interface ValidatorSignStatsResponse {
  stats: ValidatorSignStatsInfo[]
  time: number[]
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D, E = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl = 'https://api.oasisscan.com/v2/mainnet'
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title No title
 * @baseUrl https://api.oasisscan.com/v2/mainnet
 *
 * This api document example is the Mainnet document, and the Testnet base URL is api.oasisscan.com/v2/testnet
 */
export class Api<SecurityDataType> extends HttpClient<SecurityDataType> {
  account = {
    /**
     * No description
     *
     * @tags account
     * @name AccountDebondingHandler
     * @request GET:/account/debonding
     */
    accountDebondingHandler: (
      query: {
        address: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountDebondingResponse, any>({
        path: `/account/debonding`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountDelegationsHandler
     * @request GET:/account/delegations
     */
    accountDelegationsHandler: (
      query: {
        address: string
        /**
         * @format boolean
         * @default "false"
         */
        all: boolean
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountDelegationsResponse, any>({
        path: `/account/delegations`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountInfoHandler
     * @request GET:/account/info/{address}
     */
    accountInfoHandler: (address: string, params: RequestParams = {}) =>
      this.request<AccountInfoResponse, any>({
        path: `/account/info/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountRewardExportHandler
     * @request GET:/account/reward/export
     */
    accountRewardExportHandler: (
      query: {
        account: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountRewardExportResponse, any>({
        path: `/account/reward/export`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountRewardHandler
     * @request GET:/account/reward/list
     */
    accountRewardHandler: (
      query: {
        account: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountRewardResponse, any>({
        path: `/account/reward/list`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountRewardStatsHandler
     * @request GET:/account/reward/stats
     */
    accountRewardStatsHandler: (
      query: {
        account: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountRewardStatsResponse, any>({
        path: `/account/reward/stats`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountStakingEventsHandler
     * @request GET:/account/staking/events
     */
    accountStakingEventsHandler: (
      query: {
        address: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountStakingEventsResponse, any>({
        path: `/account/staking/events`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags account
     * @name AccountStakingEventsInfoHandler
     * @request GET:/account/staking/events/info
     */
    accountStakingEventsInfoHandler: (
      query: {
        id: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<AccountStakingEventsInfoResponse, any>({
        path: `/account/staking/events/info`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  chain = {
    /**
     * No description
     *
     * @tags chain
     * @name ChainBlockInfoHandler
     * @request GET:/chain/block/{height}
     */
    chainBlockInfoHandler: (height: string, params: RequestParams = {}) =>
      this.request<ChainBlockInfoResponse, any>({
        path: `/chain/block/${height}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainBlocksHandler
     * @request GET:/chain/blocks
     */
    chainBlocksHandler: (
      query: {
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "10"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ChainBlocksResponse, any>({
        path: `/chain/blocks`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainMethodsHandler
     * @request GET:/chain/methods
     */
    chainMethodsHandler: (params: RequestParams = {}) =>
      this.request<ChainMethodsResponse, any>({
        path: `/chain/methods`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainProposedBlocksHandler
     * @request GET:/chain/proposedblocks
     */
    chainProposedBlocksHandler: (
      query: {
        address?: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ChainProposedBlocksResponse, any>({
        path: `/chain/proposedblocks`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainSearchHandler
     * @request GET:/chain/search
     */
    chainSearchHandler: (
      query: {
        key: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ChainSearchResponse, any>({
        path: `/chain/search`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainTransactionInfoHandler
     * @request GET:/chain/transaction/{hash}
     */
    chainTransactionInfoHandler: (hash: string, params: RequestParams = {}) =>
      this.request<ChainTransactionInfoResponse, any>({
        path: `/chain/transaction/${hash}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags chain
     * @name ChainTransactionsHandler
     * @request GET:/chain/transactions
     */
    chainTransactionsHandler: (
      query: {
        /** @format int64 */
        height?: number
        address?: string
        method?: string
        /**
         * @format boolean
         * @default "false"
         */
        runtime: boolean
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "10"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ChainTransactionsResponse, any>({
        path: `/chain/transactions`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  governance = {
    /**
     * No description
     *
     * @tags governance
     * @name GovernanceProposalListHandler
     * @request GET:/governance/proposallist
     */
    governanceProposalListHandler: (params: RequestParams = {}) =>
      this.request<GovernanceProposalListResponse, any>({
        path: `/governance/proposallist`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags governance
     * @name GovernanceProposalWithVotesHandler
     * @request GET:/governance/proposalwithvotes
     */
    governanceProposalWithVotesHandler: (
      query: {
        /** @format int64 */
        id: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<GovernanceProposalWithVotesResponse, any>({
        path: `/governance/proposalwithvotes`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags governance
     * @name GovernanceVotesHandler
     * @request GET:/governance/votes
     */
    governanceVotesHandler: (
      query: {
        /** @format int64 */
        proposalId?: number
        validator?: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<GovernanceVotesResponse, any>({
        path: `/governance/votes`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  health = {
    /**
     * No description
     *
     * @tags common
     * @name HealthHandler
     * @request GET:/health
     */
    healthHandler: (params: RequestParams = {}) =>
      this.request<HealthResponse, any>({
        path: `/health`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  market = {
    /**
     * No description
     *
     * @tags market
     * @name MarketChartHandler
     * @request GET:/market/chart
     */
    marketChartHandler: (params: RequestParams = {}) =>
      this.request<MarketChartResponse, any>({
        path: `/market/chart`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags market
     * @name MarketInfoHandler
     * @request GET:/market/info
     */
    marketInfoHandler: (params: RequestParams = {}) =>
      this.request<MarketInfoResponse, any>({
        path: `/market/info`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  network = {
    /**
     * No description
     *
     * @tags common
     * @name NetworkStatusHandler
     * @request GET:/network/status
     */
    networkStatusHandler: (params: RequestParams = {}) =>
      this.request<NetworkStatusResponse, any>({
        path: `/network/status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  runtime = {
    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeListHandler
     * @request GET:/runtime/list
     */
    runtimeListHandler: (params: RequestParams = {}) =>
      this.request<RuntimeListResponse, any>({
        path: `/runtime/list`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeRoundInfoHandler
     * @request GET:/runtime/round/info
     */
    runtimeRoundInfoHandler: (
      query: {
        id: string
        /** @format int64 */
        round: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<RuntimeRoundInfoResponse, any>({
        path: `/runtime/round/info`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeRoundListHandler
     * @request GET:/runtime/round/list
     */
    runtimeRoundListHandler: (
      query: {
        id: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "10"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<RuntimeRoundListResponse, any>({
        path: `/runtime/round/list`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeStatsHandler
     * @request GET:/runtime/stats
     */
    runtimeStatsHandler: (
      query: {
        id: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<RuntimeStatsResponse, any>({
        path: `/runtime/stats`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeTransactionInfoHandler
     * @request GET:/runtime/transaction/info
     */
    runtimeTransactionInfoHandler: (
      query: {
        id: string
        /** @format int64 */
        round: number
        hash: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<RuntimeTransactionInfoResponse, any>({
        path: `/runtime/transaction/info`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags runtime
     * @name RuntimeTransactionListHandler
     * @request GET:/runtime/transaction/list
     */
    runtimeTransactionListHandler: (
      query: {
        id?: string
        address?: string
        /** @format int64 */
        round?: number
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "10"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<RuntimeTransactionListResponse, any>({
        path: `/runtime/transaction/list`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  trend = {
    /**
     * No description
     *
     * @tags common
     * @name NetworkTrendHandler
     * @request GET:/trend
     */
    networkTrendHandler: (params: RequestParams = {}) =>
      this.request<NetworkTrendResponse, any>({
        path: `/trend`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  validator = {
    /**
     * No description
     *
     * @tags validator
     * @name ValidatorBlocksStatsHandler
     * @request GET:/validator/blocksstats
     */
    validatorBlocksStatsHandler: (
      query: {
        address: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorBlocksStatsResponse, any>({
        path: `/validator/blocksstats`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name DelegatorsHandler
     * @request GET:/validator/delegators
     */
    delegatorsHandler: (
      query: {
        address: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "5"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<DelegatorsResponse, any>({
        path: `/validator/delegators`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name ValidatorEscrowEventHandler
     * @request GET:/validator/escrowevent
     */
    validatorEscrowEventHandler: (
      query: {
        address: string
        /**
         * @format int64
         * @default "1"
         */
        page: number
        /**
         * @format int64
         * @default "10"
         */
        size: number
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorEscrowEventResponse, any>({
        path: `/validator/escrowevent`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name ValidatorEscrowStatsHandler
     * @request GET:/validator/escrowstats
     */
    validatorEscrowStatsHandler: (
      query: {
        address: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorEscrowStatsResponse, any>({
        path: `/validator/escrowstats`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name ValidatorInfoHandler
     * @request GET:/validator/info
     */
    validatorInfoHandler: (
      query: {
        address: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorInfoResponse, any>({
        path: `/validator/info`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name ValidatorListHandler
     * @request GET:/validator/list
     */
    validatorListHandler: (
      query: {
        /** @default "escrow" */
        orderBy: string
        /** @default "desc" */
        sort: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorListResponse, any>({
        path: `/validator/list`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags validator
     * @name ValidatorSignStatsHandler
     * @request GET:/validator/signstats
     */
    validatorSignStatsHandler: (
      query: {
        address: string
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<ValidatorSignStatsResponse, any>({
        path: `/validator/signstats`,
        method: 'GET',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
}
