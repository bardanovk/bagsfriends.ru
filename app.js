const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const pageRoutes = require('./routes/pages.route')
const manageRoutes = require('./routes/manage.route')
const sassCompile = require('./middleware/sassRender')
const path = require('path')
const cookieParser = require('cookie-parser')

const config = require('./config/tokens')
const options = require('./config/options')
const router = require('./routes/manage.route')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
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
        await mongoose.connect('mongodb+srv://bardanovk:qR7uSwllQKAx5WNH@claster0.tkdrl.mongodb.net/Content?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log("server started")
        })
    } catch (e) {
        console.log(e)
    }
}

start()