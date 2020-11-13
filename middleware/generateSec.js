const speakeasy = require('speakeasy')
const fs = require('fs')
const path = require('path')


const auth = speakeasy.generateSecret({
    name: 'bagsfriends'
})



console.log(auth)
fs.writeFileSync(path.join(__dirname, '../config/tokens.js'), `module.exports = {secret: '${auth.base32}}`)