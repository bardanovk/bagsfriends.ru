const bcrypt = require('bcrypt')
const salt = require('../config/tokens').bcryptSalt
const hashCookie = require('../middleware/hashCookie')
const options = require('../config/options')

// module.exports = async(req, cookieHash) => {
//     try {
//         if (req || cookieHash)
//             return false
//         const str = 'admin' + '%%' +
//             JSON.stringify(req.headers['user-agent']).replace(/"/g, '') + '%%' +
//             JSON.stringify(req.headers['accept']).replace(/"/g, '') + '%%' +
//             JSON.stringify(req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/"/g, '') + '%%' + JSON.stringify(salt).replace(/"/g, '')
//             //console.log('str', str)

//         return await bcrypt.compare(str, cookieHash)
//     } catch (e) {
//         console.log('VERIFY COOKIE ERROR', e)
//         return false
//     }
// }

module.exports = async (req, res) => {
    try {
        console.log(req.signedCookies.sid);
        if (req.signedCookies.sid === undefined)
            return false
        // console.log(typeof(req.signedCookies.sid))
        const str = 'admin' + '%%' +
            JSON.stringify(req.headers['user-agent']).replace(/"/g, '') + '%%' +
            JSON.stringify(req.headers['accept']).replace(/"/g, '') + '%%' +
            JSON.stringify(req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/"/g, '') + '%%' + JSON.stringify(salt).replace(/"/g, '')
        if (await bcrypt.compare(str, req.signedCookies.sid)) {
            res.cookie('sid', await hashCookie(req), options.admCookieOptions)
            return true
        } else {
            res.clearCookie('sid')
            return false
        }
    } catch (e) {
        console.log('VERIFY COOKIE ERROR:', e)
        return false
    }
}