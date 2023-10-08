const winston = require('../utils/logger');

const SampleToken = {
    TokenId: '1',
    ISIN: '123',
    Expiry: 0,
    AssetType: 'A',
    SecurityType: 'A',
    SecurityName: 'A',
    IssuerSignature: 'A',
    CreatedTime: 0,
    UpdatedTime: 0,
    Status: 'A'
};
class Validator {
    async tokenValidation(tokenDetails = SampleToken) {
        try {
            if (tokenDetails.Expiry < 1) {
                throw new Error('Token Expired');
            }
            if (tokenDetails.TokenId < 1) {
                throw new Error('Token not Valid');
            }
        } catch (error) {
            winston.error(error);
        }
    }
}
