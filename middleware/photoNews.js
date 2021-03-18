const fs = require('fs')
const path = require('path')

const photoRedirect = (photo, newsTitle) => {

    try {
        newsTitle = JSON.stringify(newsTitle)
        newsTitle = newsTitle.replace(/"/g, '')

        const dirPath = path.join(__dirname, `../static/image/news/labels/`)
        const tmpPath = path.join(__dirname, '../tmp/')

        fs.mkdirSync(dirPath, { recursive: true })
        readAndWrite(photo, newsTitle, dirPath, tmpPath)

        clearTmp(tmpPath)

    } catch (err) {
        console.log('PHOTO REDIRECT ERROR', err)
    }

    async function readAndWrite(file, endFileName, dirPath, tmpPath) {
        try {
            const data = fs.readFileSync(tmpPath + file.filename)
                // console.log('data', data);
            fs.writeFileSync(dirPath + endFileName + '.jpg', data, { flag: 'a' })
        } catch (err) {
            console.log('PHOTO REDIRECT ERROR', err)
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

module.exports = photoRedirect