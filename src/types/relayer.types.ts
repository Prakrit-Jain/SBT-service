/**
 * Relayer API Request/Response Types
 * Based on official Relayer API v2.0.0 specification
 */

// Soul-Bound Token Registration Request
export interface RegisterTokenRequest {
  hid: number[];
  himei: number[];
  mcc: string;
  mnc: string;
  owner: string;
  distributor: string;
  sig: number[];
  leaf: string;
  proof: number[][];
  fid: string;
  bid: string;
  mid: number;
  blockchain: string;
}

// Delegate Soul-Bound Token Request
export interface DelegateTokenRequest {
  hid: number[];
  himei: number[];
  mcc: string;
  mnc: string;
  owner: string;
  delegateowner: string;
  distributor: string;
  sig: number[];
  blockchain: string;
}

// Mint VCT/WCT Token Request
export interface MintRewardRequest {
  token: number; // 1: VCT, 2: WCT
  toaddress: string[];
  amount: number[];
  blockchain: string;
}

// Standard Relayer Response
export interface RelayerResponse {
  status: number;
  message: string;
  tokenid: number;
  image: string;
  chain: string;
  sbtaddr: string;
}

// Address Derivation Response
export interface AddressResponse {
  status: number;
  message: string; // wallet address
  tokenid: number;
  image: string;
  chain: string;
  sbtaddr: string;
}

// Token Balance Response
export interface TokenBalanceResponse {
  status: number;
  message: string;
  balance: number;
}

// Blockchain Information
export interface BlockchainInfo {
  id: string;
  name: string;
  path: string[];
  algo: string;
  url: string;
  available: boolean;
  attestoraddr: string;
  delattestoraddr: string;
  sbtaddr: string;
  sbtdeladdr: string;
}

export interface BlockchainInfoResponse {
  status: number;
  message: string;
  data: BlockchainInfo[];
}

// Error Response
export interface RelayerErrorResponse {
  status: number;
  message: string;
  tokenid: number;
  image: string;
  chain: string;
  sbtaddr: string;
}
