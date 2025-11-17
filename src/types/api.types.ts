/**
 * API Request/Response Types
 * All request and response interfaces for the REST API
 */

// User Types
export interface RegisterUserRequest {
  userId: string;
  email?: string;
  name?: string;
  publicKey: string;
}

export interface RegisterUserResponse {
  success: boolean;
  data: {
    userId: string;
    walletAddress: string;
    status: string;
  };
  message: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  metadata?: Record<string, any>;
}

// Token Types
export interface IssueTokenRequest {
  userId: string;
  walletAddress: string;
  hid: number[];
  himei: number[];
  mcc: string;
  mnc: string;
  distributor: string;
  sig: number[];
  leaf: string;
  proof: number[][];
  fid: string;
  bid: string;
  mid: number;
  blockchain: string;
}

export interface IssueTokenResponse {
  success: boolean;
  data: {
    tokenId: string;
    walletAddress: string;
    blockchain: string;
    contractAddress: string;
    imageUrl: string;
    timestamp: Date;
  };
  message: string;
}

export interface CheckTokenRequest {
  walletAddress: string;
  blockchain: string;
  isDelegated?: boolean;
}

export interface CheckTokenResponse {
  success: boolean;
  data: {
    walletAddress: string;
    blockchain: string;
    balance: number;
    verified: boolean;
  };
  message: string;
}

export interface DelegateTokenRequest {
  userId: string;
  walletAddress: string;
  delegateWalletAddress: string;
  hid: number[];
  himei: number[];
  mcc: string;
  mnc: string;
  distributor: string;
  sig: number[];
  blockchain: string;
}

export interface DelegateTokenResponse {
  success: boolean;
  data: {
    tokenId: string;
    walletAddress: string;
    delegateWalletAddress: string;
    blockchain: string;
    contractAddress: string;
    imageUrl: string;
    timestamp: Date;
  };
  message: string;
}

export interface MintRewardTokenRequest {
  userId: string;
  tokenType: 'VCT' | 'WCT';
  recipients: {
    address: string;
    amount: number;
  }[];
  blockchain: string;
}

export interface MintRewardTokenResponse {
  success: boolean;
  data: {
    blockchain: string;
    recipients: {
      address: string;
      amount: number;
      status: string;
    }[];
    transactionHash?: string;
    timestamp: Date;
  };
  message: string;
}

// Generic Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
  timestamp: Date;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
  message: string;
  timestamp: Date;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: string;
    connected: boolean;
  };
  memory: {
    used: number;
    total: number;
  };
  version: string;
}
