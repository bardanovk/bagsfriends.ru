const speakeasy = require('speakeasy')
const fs = require('fs')
const path = require('path')

try {
    const auth1 = speakeasy.generateSecret({
        name: 'bagsfriends1'
    })
    const auth2 = speakeasy.generateSecret({
        name: 'bagsfriends2'
    })

    const cookie = speakeasy.generateSecret()
    const bcrypt = speakeasy.generateSecret()

    console.log('auth1:', auth1)
    console.log('auth2:', auth2)
    console.log('cookie:', cookie)
    console.log('bcrypt:', bcrypt)


    fs.writeFileSync(path.join(__dirname, '../config/tokens.js'), `module.exports = {\nauth1: '${auth1.base32}', \nauth2: '${auth2.base32}', \ncookie: '${cookie.ascii}', \nbcryptSalt: '${bcrypt.ascii}'\n}`)
} catch (e) {
    console.log('GENERATE SECRET KEYS ERROR', e)
}
/*
cookie: 'GBLDAQURS6WZBG5TUGXRZGY3DOUDRGUYQCBLNNEQPTMGBHV2QLTG',
    bcryptSalt: 'nfdjab2214!199@@#!'*/