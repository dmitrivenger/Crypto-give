const Joi = require('joi');

// Accept EVM tx hash (0x + 64 hex) OR BTC/TRX tx hash (64 hex, no prefix)
const txHashSchema = Joi.alternatives().try(
  Joi.string().pattern(/^0x[0-9a-fA-F]{64}$/),
  Joi.string().pattern(/^[0-9a-fA-F]{64}$/)
).required();

const blockchainSchema = Joi.string().valid('ethereum', 'polygon', 'bsc', 'bitcoin', 'tron');
const tokenSchema = Joi.string().uppercase().valid('ETH', 'USDC', 'USDT', 'POL', 'BNB', 'BTC', 'TRX');

const schemas = {
  initiateDonation: Joi.object({
    orgId: Joi.number().integer().positive().required(),
    amount: Joi.alternatives().try(Joi.number().positive(), Joi.string().pattern(/^\d+\.?\d*$/)).required(),
    token: tokenSchema.required(),
    blockchain: blockchainSchema.required(),
  }),

  confirmDonation: Joi.object({
    txHash: txHashSchema,
    orgId: Joi.number().integer().positive().required(),
    blockchain: blockchainSchema.required(),
    token: tokenSchema.required(),
    amount: Joi.alternatives().try(Joi.number().positive(), Joi.string().pattern(/^\d+\.?\d*$/)).required(),
    donationId: Joi.string().optional(),
  }),

  walletAddress: Joi.string().pattern(/^0x[0-9a-fA-F]{40}$/).required(),

  taxReportQuery: Joi.object({
    year: Joi.number().integer().min(2020).max(2100).required(),
    format: Joi.string().valid('pdf', 'csv').default('pdf'),
  }),

  donationsQuery: Joi.object({
    year: Joi.number().integer().min(2020).max(2100).optional(),
    orgId: Joi.number().integer().positive().optional(),
    blockchain: blockchainSchema.optional(),
    status: Joi.string().valid('pending', 'confirmed', 'failed').optional(),
  }),
};

function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) return next();

    const data = schemaName.endsWith('Query') ? req.query : req.body;
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

    if (error) {
      const errors = {};
      error.details.forEach(d => {
        const key = d.path.join('.');
        errors[key] = d.message;
      });
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors,
      });
    }

    if (schemaName.endsWith('Query')) {
      req.validatedQuery = value;
    } else {
      req.validatedBody = value;
    }
    next();
  };
}

module.exports = { validate };
