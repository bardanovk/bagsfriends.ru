const speakeasy = require('speakeasy')
const config = require('../config/tokens')

const verify = (token1, token2) => {
    try {
        return speakeasy.totp.verify({ secret: config.auth1, encoding: 'base32', token: token1, window: 2 }) &&
            speakeasy.totp.verify({ secret: config.auth2, encoding: 'base32', token: token2, window: 2 })
    } catch (error) {
        console.log('VERIFY COOKIE ERROR', error)
        return false
    }
}

module.exports = verify