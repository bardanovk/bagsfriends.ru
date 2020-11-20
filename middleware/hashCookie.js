const bcrypt = require('bcrypt')
const salt = require('../config/tokens').bcryptSalt

module.exports = async req => {
    const str = 'admin' + '%%' +
        JSON.stringify(req.headers['user-agent']).replace(/"/g, '') + '%%' +
        JSON.stringify(req.headers['accept']).replace(/"/g, '') + '%%' +
        JSON.stringify(req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/"/g, '') + '%%' + JSON.stringify(salt).replace(/"/g, '')
        //console.log('str', str);
    fingerHash = await bcrypt.hash(str, 12)
        //console.log('fingerHash', fingerHash)
    return fingerHash
}