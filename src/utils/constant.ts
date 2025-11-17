export const TOKEN_TYPES = {
  SOULBOUND: 'SOULBOUND',
  DELEGATE_SOULBOUND: 'DELEGATE_SOULBOUND',
  VCT: 'VCT',
  WCT: 'WCT',
} as const;

export const TOKEN_STATUS = {
  PENDING: 'PENDING',
  MINTED: 'MINTED',
  FAILED: 'FAILED',
  VERIFIED: 'VERIFIED',
} as const;

export const RELAYER_STATUS = {
  SUCCESS: 1,
  WALLET_SUCCESS: 2,
  FAILED: -1,
} as const;

export const REWARD_TOKEN_TYPES = {
  VCT: 1,
  WCT: 2,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const BLOCKCHAIN_IDS = {
  POLYGON_AMOY: '01',
} as const;

export const VALIDATION_RULES = {
  USER_ID_MIN_LENGTH: 3,
  USER_ID_MAX_LENGTH: 50,
  WALLET_ADDRESS_LENGTH: 42,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
  HID_LENGTH: 32,
  HIMEI_LENGTH: 32,
  SIG_LENGTH: 65,
  PROOF_ITEM_LENGTH: 32,
  MIN_RECIPIENTS: 1,
  MAX_RECIPIENTS: 100,
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  TOKEN_NOT_FOUND: 'Token not found',
  INVALID_WALLET_ADDRESS: 'Invalid wallet address format',
  INVALID_PUBLIC_KEY: 'Invalid public key format',
  DUPLICATE_USER: 'User with this ID or wallet address already exists',
  DUPLICATE_TOKEN: 'Token already exists',
  RELAYER_ERROR: 'Failed to communicate with Relayer API',
  DATABASE_ERROR: 'Database operation failed',
  VALIDATION_ERROR: 'Input validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  WALLET_MISMATCH: 'Wallet address does not match user record',
  INVALID_AMOUNT: 'Invalid token amount',
  INVALID_RECIPIENT_ADDRESS: 'Invalid recipient wallet address',
} as const;

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_RETRIEVED: 'User retrieved successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  TOKEN_ISSUED: 'Token issued successfully',
  TOKEN_VERIFIED: 'Token verified successfully',
  TOKEN_MINTED: 'Reward tokens minted successfully',
  TOKENS_RETRIEVED: 'Tokens retrieved successfully',
} as const;

export const TIMEOUTS = {
  RELAYER_API: 30000,
  DATABASE: 10000,
  DEFAULT: 5000,
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 30000,
  BACKOFF_MULTIPLIER: 2,
} as const;

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  SKIP_ENDPOINTS: ['/health'],
} as const;

export const DB_CONFIG = {
  MAX_POOL_SIZE: 10,
  MIN_POOL_SIZE: 2,
  SERVER_SELECTION_TIMEOUT: 5000,
  SOCKET_TIMEOUT: 45000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const CACHE_KEYS = {
  USER: (userId: string) => `user:${userId}`,
  WALLET: (address: string) => `wallet:${address}`,
  TOKEN: (tokenId: string) => `token:${tokenId}`,
  BLOCKCHAIN_INFO: 'blockchain:info',
} as const;

export const REGEX = {
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  PUBLIC_KEY: /^[a-fA-F0-9]{128}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9_-]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

export const API_ENDPOINTS = {
  USERS: {
    REGISTER: '/users/register',
    LIST: '/users',
    GET: '/users/:userId',
    GET_BY_WALLET: '/users/wallet/:walletAddress',
    UPDATE: '/users/:userId',
    DELETE: '/users/:userId',
  },
  TOKENS: {
    ISSUE: '/tokens/issue',
    CHECK: '/tokens/check',
    MINT_REWARD: '/tokens/mint-reward',
    LIST_BY_USER: '/tokens/user/:userId',
    LIST_BY_WALLET: '/tokens/wallet/:walletAddress',
  },
  HEALTH: {
    CHECK: '/health',
  },
} as const;

export const FEATURE_FLAGS = {
  ENABLE_DELEGATION: true,
  ENABLE_REWARD_TOKENS: true,
  ENABLE_CACHING: false,
  ENABLE_RATE_LIMITING: true,
  ENABLE_DETAILED_LOGGING: true,
} as const;

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  WEBHOOK: 'webhook',
} as const;
