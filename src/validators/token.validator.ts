import Joi from 'joi';

/**
 * Issue token validation schema
 */
export const issueTokenSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),

  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required',
    }),

  hid: Joi.array().items(Joi.number().integer()).length(32).required().messages({
    'array.length': 'HID must be an array of 32 bytes',
  }),

  himei: Joi.array().items(Joi.number().integer()).length(32).required().messages({
    'array.length': 'HIMEI must be an array of 32 bytes',
  }),

  mcc: Joi.string().required().messages({
    'any.required': 'MCC is required',
  }),

  mnc: Joi.string().required().messages({
    'any.required': 'MNC is required',
  }),

  distributor: Joi.string().required().messages({
    'any.required': 'Distributor is required',
  }),

  sig: Joi.array().items(Joi.number().integer()).length(65).required().messages({
    'array.length': 'Signature must be 65 bytes',
  }),

  leaf: Joi.string().required().messages({
    'any.required': 'Leaf is required',
  }),

  proof: Joi.array()
    .items(Joi.array().items(Joi.number().integer()).length(32))
    .required()
    .messages({
      'any.required': 'Merkle proof is required',
    }),

  fid: Joi.string().required().messages({
    'any.required': 'FID is required',
  }),

  bid: Joi.string().required().messages({
    'any.required': 'BID is required',
  }),

  mid: Joi.number().required().messages({
    'any.required': 'MID is required',
  }),

  blockchain: Joi.string().required().messages({
    'any.required': 'Blockchain ID is required',
  }),
}).unknown(false);

/**
 * Check token validation schema
 */
export const checkTokenSchema = Joi.object({
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required',
    }),

  blockchain: Joi.string().required().messages({
    'any.required': 'Blockchain ID is required',
  }),

  isDelegated: Joi.boolean().optional().default(false),
}).unknown(false);

/**
 * Mint reward token validation schema
 */
export const mintRewardTokenSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),

  tokenType: Joi.string().valid('VCT', 'WCT').required().messages({
    'any.only': 'Token type must be VCT or WCT',
    'any.required': 'Token type is required',
  }),

  recipients: Joi.array()
    .items(
      Joi.object({
        address: Joi.string()
          .pattern(/^0x[a-fA-F0-9]{40}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid Ethereum wallet address format',
          }),

        amount: Joi.number().positive().required().messages({
          'number.positive': 'Amount must be positive',
          'any.required': 'Amount is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one recipient is required',
      'any.required': 'Recipients array is required',
    }),

  blockchain: Joi.string().required().messages({
    'any.required': 'Blockchain ID is required',
  }),
}).unknown(false);

export const delegateTokenSchema = Joi.object({
  userId: Joi.string().required(),
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  delegateWalletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  hid: Joi.array().items(Joi.number().integer()).length(32).required(),
  himei: Joi.array().items(Joi.number().integer()).length(32).required(),
  mcc: Joi.string().required(),
  mnc: Joi.string().required(),
  distributor: Joi.string().required(),
  sig: Joi.array().items(Joi.number().integer()).length(65).required(),
  blockchain: Joi.string().required(),
}).unknown(false);
