/**
 * Database Entity Types
 * TypeScript interfaces for MongoDB documents
 */

// User Entity
export interface IUser {
  _id?: string;
  userId: string;
  walletAddress: string;
  publicKey?: string;
  email?: string;
  name?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Token Entity
export interface IToken {
  _id?: string;
  tokenId: string;
  userId: string;
  walletAddress: string;
  tokenType: TokenType;
  blockchain: string;
  contractAddress: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
  transactionHash?: string;
  status: TokenStatus;
  delegatedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Token Type Enum
export enum TokenType {
  SOULBOUND = 'SOULBOUND',
  DELEGATE_SOULBOUND = 'DELEGATE_SOULBOUND',
  VCT = 'VCT',
  WCT = 'WCT',
}

// Token Status Enum
export enum TokenStatus {
  PENDING = 'PENDING',
  MINTED = 'MINTED',
  FAILED = 'FAILED',
  VERIFIED = 'VERIFIED',
}

// Pagination Options
export interface PaginationOptions {
  page: number;
  limit: number;
  skip?: number;
}

// Query Filter
export interface TokenFilter {
  userId?: string;
  walletAddress?: string;
  tokenType?: TokenType;
  blockchain?: string;
  status?: TokenStatus;
  delegatedTo?: string;
}

// Sort Options
export interface SortOptions {
  field: keyof IToken | keyof IUser;
  direction: 'asc' | 'desc';
}
