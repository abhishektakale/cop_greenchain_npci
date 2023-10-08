const Joi = require('@hapi/joi');

const TokenSchema = Joi.object({
    TokenId: Joi.string(),
    ISIN: Joi.string(),
    Expiry: Joi.string(),
    SecurityType: Joi.string(),
    SecurityName: Joi.string(),
    IssuerSignature: Joi.string(),
    CreatedTime: Joi.number(),
    UpdatedTime: Joi.number(),
    Status: Joi.string(),
    OwnerAddress: Joi.string()
});

const CreateTokenSchema = Joi.object({
    ISIN: Joi.string().required(),
    Expiry: Joi.number().required(),
    SecurityType: Joi.string().required(),
    SecurityName: Joi.string().required()
}).required();

const IssueTokenSchema = Joi.object({
    TokenId: Joi.string().required(),
    OwnerAddress: Joi.string().required()
}).required();

const TransferTokenSchema = Joi.object({
    TokenId: Joi.string().required(),
    OwnerAddress: Joi.string().required()
}).required();

export { TokenSchema, CreateTokenSchema, IssueTokenSchema, TransferTokenSchema };
