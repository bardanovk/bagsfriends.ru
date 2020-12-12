const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const News = require('../models/news')
const multer = require('multer')
const photoRedirect = require('../middleware/photoRedirect')
const photoNews = require('../middleware/photoNews')
const verifyF2B = require('../middleware/verifyF2B')
const verifyCookie = require('../middleware/verifyCookie')
const config = require('../config/tokens')
const options = require('../config/options')
const cookieParser = require('cookie-parser')
const hashCookie = require('../middleware/hashCookie')

const upload = multer({ dest: './tmp' })

router.use(cookieParser(config.cookie))

router.get('/login', async(req, res, next) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.redirect('/manage')
    else
        res.render('./pages/manage/login', { layout: 'manage' })

})

router.post('/login', async(req, res) => {
    //console.log(req.body, req.body.pass1, req.aborted.pass2, verifyF2B(req.body.pass1, req.body.pass2))

    if (verifyF2B(req.body.pass1, req.body.pass2)) {
        res.cookie('sid', await hashCookie(req), options.admCookieOptions)
        res.redirect('/manage')
    } else {
        res.redirect('/login')
    }
})

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

router.post('/manage/product/create', upload.array('photo'), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        if (req.files.length != 0)
            photoRedirect(req.files, req.body.prodTitle)
        const checked = !!req.body.visible || false
        const product = new Product({
            prodTitle: req.body.prodTitle,
            category: req.body.category,
            visible: checked,
            price: req.body.price,
            description: req.body.description
        })

        // console.log('body', req.body)
        // console.log('product', product)

        product.save()
        res.redirect('/manage/products')
    } else
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

router.get('/manage/products/edit/:id', async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {

        const product = await Product.findById(req.params.id, (e) => {
                if (e)
                    console.log(e)
            }).lean()
            //console.log(typeof product.visible, product.visible)
        res.render('./pages/manage/editProduct', { layout: 'manage', product })

    } else
        res.redirect('/login')
})

router.post('/manage/products/edit/:id', async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        try {
            //console.log('body', req.body)
            let product = await Product.findById(req.params.id)
                //console.log(product);
            const checked = !!req.body.visible || false
                //console.log(checked);
            product.prodTitle = req.body.prodTitle
            product.category = req.body.category
            product.price = req.body.price
            product.visible = checked
            product.description = req.body.description
                //console.log(product)
            product.save()
        } catch (e) {
            console.log('UPDATE PRODUCT ERROR', e);
        }
        res.redirect('../../../manage/products')
    } else
        res.redirect('/login')
})

router.get('/manage/news', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        const news = News.find({})
        res.render('./pages/manage/news', { layout: 'manage', news })
    } else
        res.redirect('/login')
})

router.get('/manage/news/create', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/createNews', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.post('/manage/news/create', upload.array('photo'), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        if (req.files.length != 0)
            photoNews(req.files, req.body.newsTitle)
        const checked = !!req.body.visible || false
        const news = new News({
            newsTitle: req.body.newsTitle,
            category: req.body.category,
            visible: checked,
            text: req.body.text,
            author: req.body.author
        })

        // console.log('body', req.body)
        //console.log('product', product)

        news.save()
        res.redirect('/manage/products')
    } else
        res.redirect('/login')
})

router.get('/manage/orders', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/orders', { layout: 'manage' })
    else
        res.redirect('/login')
})

module.exports = router