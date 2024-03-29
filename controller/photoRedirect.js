const fs = require('fs')
const path = require('path')



const photoRedirect = (photos, prodTitle) => {
    try {
        prodTitle = JSON.stringify(prodTitle)
        prodTitle = prodTitle.replace(/"/g, '')


        const dirPath = path.join(__dirname, `../static/image/products/${prodTitle}/`)
        const tmpPath = path.join(__dirname, '../tmp/')


        fs.mkdirSync(dirPath, { recursive: true })

        readAndWrite(photos[0], 'Main', dirPath, tmpPath)

        for (i = 1; i < photos.length; i++) {
            elemenet = photos[i]
            readAndWrite(elemenet, '' + i, dirPath, tmpPath)
        }


        clearTmp(tmpPath)


    } catch (err) {
        console.log(err)
    }


    async function readAndWrite(file, endFileName, dirPath, tmpPath) {
        try {
            const fileName = file.filename
            const data = fs.readFileSync(tmpPath + fileName)
            fs.writeFileSync(dirPath + endFileName + '.jpg', data, { flag: 'a' })
        } catch (err) {
            console.log(err)
        }
    }

    function clearTmp(directory) {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err
                })
            }
        })
    }
}

module.exports = photoRedirect