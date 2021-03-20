const fs = require('fs')
const path = require('path')

const newsPhotoRedirect = (file) => {

    const dirPath = path.join(__dirname, '../static/image/news/')
    const tmpPath = path.join(__dirname, '../tmp/')

    readAndWrite(file, dirPath, tmpPath)
    clearTmp(tmpPath)

    async function readAndWrite(file, dirPath, tmpPath) {
        try {
            console.log(file);
            const data = fs.readFileSync(tmpPath + file.filename)
            fs.writeFileSync(dirPath + file.filename + '.jpg', data, { flag: 'a' })
        } catch (err) {
            console.log('NEWS PHOTO REDIRECT ERROR', err)
        }
    }

    function clearTmp(directory) {
        try {
            fs.readdir(directory, (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err
                    })
                }
            })
        } catch (e) {
            console.log('PHOTO REDIRECT ERROR', e)
        }
    }
}

module.exports = newsPhotoRedirect