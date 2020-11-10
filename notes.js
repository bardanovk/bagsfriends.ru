if (err.code === 'ENOENT') {
    try {
        await fs.mkdir(dirPath, { recursive: true }, (err) => {
            console.log(err)
        })

        readAndWrite(photos[0], 'Main', dirPath, tmpPath)

        for (let i = 1; i < photos.length; i++) {

            const element = photos[i]

            endFileName = i
            readAndWrite(element, endFileName, dirPath, tmpPath)

        }
    } catch (e) {
        console.log(e)
    }



} else
    console.log('Папка существует или произошла ошибка')

})