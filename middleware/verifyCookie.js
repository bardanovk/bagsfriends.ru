const bcrypt = require('bcrypt')
const salt = require('../config/tokens').bcryptSalt

module.exports = async(req, cookieHash) => {
    try {
        if (req || cookieHash)
            return false
        const str = 'admin' + '%%' +
            JSON.stringify(req.headers['user-agent']).replace(/"/g, '') + '%%' +
            JSON.stringify(req.headers['accept']).replace(/"/g, '') + '%%' +
            JSON.stringify(req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/"/g, '') + '%%' + JSON.stringify(salt).replace(/"/g, '')
            //console.log('str', str)

        return await bcrypt.compare(str, cookieHash)
    } catch (e) {
        console.log('VERIFY COOKIE ERROR', e)
        return false
    }
}