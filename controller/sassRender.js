const sass = require("sass")
const fs = require('fs')


const render = async() => {

    fs.mkdirSync('./static/style/', { recursive: true })

    await sass.render({
        file: './sass/generalStyle.scss'
    }, (error, result) => {
        if (error)
            console.log('SASS ERROR', error)
        else {
            fs.writeFile('./static/style/style.css', result.css.toString(), (err) => {
                if (err) throw err;
                console.log('Sass compiled!')
            })
        }
    })
}


module.exports = render