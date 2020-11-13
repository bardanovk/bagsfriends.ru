const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const multer = require('multer')
const photoRedirect = require('../middleware/photoRedirect')
const verifyF2B = require('../middleware/verifyF2B')
const verifyCookie = require('../middleware/verifyCookie')
const config = require('../config/tokens')
const options = require('../config/options')
const cookieParser = require('cookie-parser')


const hashCookie = require('../middleware/hashCookie')



const upload = multer({ dest: './tmp' })

router.use(cookieParser(config.cookie))

router.get('/manage', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/manage', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.get('/manage/products', async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        const products = await Product.find({}).lean()
        res.render('./pages/manage/products', {
            layout: 'manage',
            products
        })
    } else
        res.redirect('/login')

})

router.get('/manage/products/create', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/createProduct', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.get('/manage/orders', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/orders', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.get('/manage/news', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/news', { layout: 'manage' })
    else
        res.redirect('/login')
})
router.get('/manage/products/edit', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        prodId = req.body.prodId
        try {
            const product = new Product.findById(prodId).lean()

            console.log(product)
            res.render('./pages/manage/editProduct', { layout: 'manage' })
        } catch (e) {
            console.log(e)
        }
    } else
        res.redirect('/login')
})

router.get('/login', async(req, res, next) => {
    /*console.log(Object.keys(req.signedCookies))
    console.log(req.headers['user-agent']);
    console.log(req.headers['accept']);
    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)*/
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.redirect('/manage')
    else
        res.render('./pages/manage/login', { layout: 'manage' })

})

router.post('/login', async(req, res) => {
    console.log(verifyF2B(req.body.pass))

    if (verifyF2B(req.body.pass)) {
        res.cookie('sid', await hashCookie(req), options.admCookieOptions)
        res.redirect('/manage')
    } else {
        res.redirect('/login')
    }
})

router.post('/create', upload.array('photo'), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        photoRedirect(req.files, req.body.prodTitle)
        const product = new Product({
            prodTitle: req.body.prodTitle,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description
        })

        product.save()
        res.redirect('/manage/products')
    } else
        res.redirect('/login')
})

module.exports = router