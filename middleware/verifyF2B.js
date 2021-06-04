const speakeasy = require('speakeasy')
const config = require('../config/tokens')

const verify = (token1, token2) => {
    try {
        //console.log('tokens', token1, token2);3
        console.log(speakeasy.totp.verify({ secret: config.auth1, encoding: 'base32', token: token1, window: 2 }) &&
            speakeasy.totp.verify({ secret: config.auth2, encoding: 'base32', token: token2, window: 2 }));
        return speakeasy.totp.verify({ secret: config.auth1, encoding: 'base32', token: token1, window: 2 }) &&
            speakeasy.totp.verify({ secret: config.auth2, encoding: 'base32', token: token2, window: 2 })
    } catch (e) {
        console.log('VERIFY COOKIE ERROR', e)
        return false
    }
}

module.exports = verify