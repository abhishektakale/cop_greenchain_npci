const Joi = require('@hapi/joi');
const TokenSchema = Joi.object({
    TokenId: Joi.string().allow(null),
    ISIN: Joi.string().required(),
    Expiry: Joi.string().required(),
    SecurityType: Joi.string().required(),
    SecurityName: Joi.string().required(),
    IssuerSignature: Joi.string().allow(null),
    CreatedTime: Joi.date(),
    UpdatedTime: Joi.date(),
    Status: Joi.string(),
    OwnerAddress: Joi.string()
});

exports.TokenSchema = TokenSchema;
