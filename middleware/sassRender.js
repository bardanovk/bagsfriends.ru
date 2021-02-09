const sass = require("sass")
const fs = require('fs')


const render = async() => {

    await sass.render({
        file: './sass/generalStyle.scss'
    }, (error, result) => {
        if (error)
            console.log('SASS ERROR', error)
        else {
            fs.writeFile('./static/style/style.css', result.css.toString(), (err) => {
                if (err) throw err;
                console.log('General sass compiled!')
            })
        }
    })

    await sass.render({
        file: './sass/manageStyle.scss'
    }, (error, result) => {
        if (error)
            console.log('SASS ERROR', error)
        else {
            fs.writeFile('./static/style/manageStyle.css', result.css.toString(), (err) => {
                if (err) throw err;
                console.log('Manage sass compiled!')
            })
        }
    })
}


module.exports = render