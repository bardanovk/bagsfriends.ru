const express = require('express')
const hbsHelpers = require('handlebars-helpers')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const pageRoutes = require('./routes/pages.route')
const manageRoutes = require('./routes/manage.route')
const sassCompile = require('./middleware/sassRender')
const path = require('path')


const PORT = process.env.PORT || 8080

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelpers()
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))

app.use(pageRoutes)
app.use(manageRoutes)
app.use(express.static(path.join(__dirname, 'static')))

async function start() {
    try {
        sassCompile()
        console.log('Conecting database...');
        try {
            await mongoose.connect('mongodb+srv://bardanovk:gHbvEOjJq5pvQwAP@claster0.tkdrl.mongodb.net/Content?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            })
            console.log('Successful connection to database');
        } catch (e) {
            console.log('Conection database error');
            console.log(e);
        }

        app.listen(PORT, () => {
            console.log("Server started")
        })
    } catch (e) {
        console.log(e)
    }
}

start()