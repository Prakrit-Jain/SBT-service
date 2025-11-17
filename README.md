# Soul-Bound Token Service

Backend service for issuing and managing soul-bound tokens (SBT) on the blockchain. This service provides APIs for user registration, token issuance, verification, delegation, and reward token minting.

## Features

- User wallet onboarding via public key
- Soul-bound token issuance
- Token verification on blockchain
- Token delegation to other wallets
- VCT/WCT reward token minting

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- (Optional) Access to Relayer API - Mock mode is available for development

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```env
NODE_ENV=development
PORT=3000
API_VERSION=v1

MONGODB_URI=mongodb://localhost:27017/soul-bound-tokens
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=2

# For mock mode (no real relayer API), use one of these:
# RELAYER_BASE_URL=http://localhost:9999
# RELAYER_BASE_URL=mock
# RELAYER_BASE_URL=
# For real relayer API, use:
# RELAYER_BASE_URL=https://your-relayer-api-url.com
RELAYER_BASE_URL=mock
RELAYER_TIMEOUT=30000
RELAYER_MAX_RETRIES=3

LOG_LEVEL=info
LOG_DIR=./logs

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CORS_ORIGIN=*
```

**Note:** The service includes a **mock mode** that automatically activates when:
- `RELAYER_BASE_URL` contains `localhost:9999` or `mock`
- `RELAYER_BASE_URL` is empty or not set

In mock mode, the service returns simulated responses without calling a real relayer API, making it perfect for development and testing.

3. **Start MongoDB:**
```bash
# Make sure MongoDB is running
mongosh
```

4. **Run the service:**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The service will be available at `http://localhost:3000`

**Important:** All endpoints are at the root level (e.g., `/registerUser`), not under `/api/v1/`. Make sure you're using the correct endpoint paths.

## API Endpoints

### 1. Register User
**POST** `/registerUser`

Register a new user and generate wallet address from public key.

**Request Body:**
```json
{
  "userId": "user123",
  "publicKey": "3ea8c7d23a5a642319d765653f4a7da0c883c16984fb14b9961eb36744d4a66270f8858c6d453ba5ee12e7b34e854cadaee8cfb0a66007cc2ccfb7e5c35f0ebd",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "walletAddress": "0x23460b772eee2f4e4216b5ea82a97feec1ec628d",
    "status": "registered"
  },
  "message": "User registered successfully"
}
```

### 2. Issue Token
**POST** `/issueToken`

Issue a soul-bound token for a verified user.

**Request Body:**
```json
{
  "userId": "user123",
  "walletAddress": "0xeEb9EBeA5E9f0f153f2dAf0e5Fda584eC45e5B11",
  "hid": [196,236,159,70,117,11,167,61,160,158,247,73,184,208,173,74,52,230,69,3,72,177,97,85,68,36,99,238,189,105,29,102],
  "himei": [128,45,74,130,117,69,124,210,222,76,181,115,211,86,118,52,34,220,137,186,15,179,125,68,84,164,58,25,8,48,119,121],
  "mcc": "886",
  "mnc": "1",
  "distributor": "Taisys",
  "sig": [219,116,210,73,156,240,43,211,120,137,199,116,45,227,177,12,123,238,171,163,253,183,34,131,168,86,246,188,79,69,67,124,66,87,229,38,201,57,231,80,82,111,131,110,213,92,206,94,126,165,132,190,104,114,111,225,229,15,201,10,248,27,136,186,0],
  "leaf": "0",
  "proof": [[200,158,253,170,84,192,242,12,122,223,97,40,130,223,9,80,245,169,81,99,126,3,7,205,203,76,103,47,41,139,139,198]],
  "fid": "3",
  "bid": "4",
  "mid": 8735355190715,
  "blockchain": "01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1234567890123",
    "walletAddress": "0xeEb9EBeA5E9f0f153f2dAf0e5Fda584eC45e5B11",
    "blockchain": "01",
    "contractAddress": "0x76EbB010DDe57D38bB0a56477dD620977bb3C43d",
    "imageUrl": "https://ipfs.io/ipfs/bafybeig3exef5s2efbrndogzzndvl6qhs5fz3zavtxcii6murg2fdcmlhq",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "Token issued successfully"
}
```

### 3. Check Token
**GET** `/checkToken?walletAddress=0x...&blockchain=01&isDelegated=false`

Verify token balance on blockchain.

**Query Parameters:**
- `walletAddress` (required): Wallet address to check
- `blockchain` (required): Blockchain ID (e.g., "01")
- `isDelegated` (optional): Check delegated token (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "walletAddress": "0xeEb9EBeA5E9f0f153f2dAf0e5Fda584eC45e5B11",
    "blockchain": "01",
    "balance": 1,
    "verified": true
  },
  "message": "Token verified successfully"
}
```

### 4. Delegate Token
**POST** `/delegateToken`

Delegate a soul-bound token to another wallet.

**Request Body:**
```json
{
  "userId": "user123",
  "walletAddress": "0xeEb9EBeA5E9f0f153f2dAf0e5Fda584eC45e5B11",
  "delegateWalletAddress": "0xbC8255F1aA96261564d6C672f4F98C78fE9347a2",
  "hid": [196,236,159,70,117,11,167,61,160,158,247,73,184,208,173,74,52,230,69,3,72,177,97,85,68,36,99,238,189,105,29,102],
  "himei": [128,45,74,130,117,69,124,210,222,76,181,115,211,86,118,52,34,220,137,186,15,179,125,68,84,164,58,25,8,48,119,121],
  "mcc": "886",
  "mnc": "1",
  "distributor": "Taisys",
  "sig": [66,251,54,11,104,141,147,216,174,36,132,135,182,63,251,145,48,25,67,200,200,65,56,24,224,237,30,169,70,164,63,95,40,147,10,190,95,118,8,189,234,127,160,87,6,224,206,239,150,37,253,113,103,46,121,140,209,178,192,8,19,196,239,175,0],
  "blockchain": "01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": "1234567890123",
    "walletAddress": "0xeEb9EBeA5E9f0f153f2dAf0e5Fda584eC45e5B11",
    "delegateWalletAddress": "0xbC8255F1aA96261564d6C672f4F98C78fE9347a2",
    "blockchain": "01",
    "contractAddress": "0x650F77ddbD9CC00e2EE6353360BA45fe126E8e70",
    "imageUrl": "https://ipfs.io/ipfs/bafybeia4z4xztrfnpfbbbghcy44elcq3bgm4nje4zxt27tk6mq2akhlkne",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "Token delegated successfully"
}
```

### 5. Mint Reward Token
**POST** `/mintRewardToken`

Mint VCT or WCT reward tokens to multiple recipients.

**Request Body:**
```json
{
  "userId": "user123",
  "tokenType": "VCT",
  "recipients": [
    {
      "address": "0x060B9eb5dCc2af018cCfce8d4050C5e8f4d5BDc9",
      "amount": 0.1
    },
    {
      "address": "0x4Ab04f6D0890f7fd9da55b72351eCdd1884aA3C4",
      "amount": 1.1
    }
  ],
  "blockchain": "01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blockchain": "01",
    "recipients": [
      {
        "address": "0x060B9eb5dCc2af018cCfce8d4050C5e8f4d5BDc9",
        "amount": 0.1,
        "status": "minted"
      },
      {
        "address": "0x4Ab04f6D0890f7fd9da55b72351eCdd1884aA3C4",
        "amount": 1.1,
        "status": "minted"
      }
    ],
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "Reward tokens minted successfully"
}
```

### Health Check
**GET** `/health`

Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "database": {
    "status": "connected",
    "connected": true
  },
  "memory": {
    "used": 50,
    "total": 100
  },
  "version": "1.0.0"
}
```

## Architecture

The service follows a layered architecture:

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and orchestration
- **Repositories**: Database operations
- **Models**: MongoDB schemas
- **Validators**: Request validation using Joi
- **Types**: TypeScript type definitions

## Error Handling

All errors are handled by middleware and return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
