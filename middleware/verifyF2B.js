const speakeasy = require('speakeasy')
const config = require('../config/tokens')

const verify = (token) => {
    return speakeasy.totp.verify({
        secret: config.secret,
        encoding: 'base32',
        token: token
    })
}

module.exports = verify