const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const News = require('../models/news')
const multer = require('multer')
const productPhotoRedirect = require('../middleware/photoRedirect')
const newsPhotoRedirect = require('../middleware/editorPhotoUpload')
const verifyF2B = require('../middleware/verifyF2B')
const verifyCookie = require('../middleware/verifyCookie')
const config = require('../config/tokens')
const options = require('../config/options')
const cookieParser = require('cookie-parser')
const hashCookie = require('../middleware/hashCookie')
const news = require('../models/news')

//const photoNews = require('../middleware/photoNews')

const upload = multer({ dest: './tmp' })

router.use(cookieParser(config.cookie))

router.get('/login', async(req, res, next) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.redirect('/manage')
    else
        res.render('./pages/manage/login')

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

router.get('/logout', async(req, res) => {
    res.clearCookie('sid');
    res.redirect('/login')
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
        console.log('body', req.body);
        if (req.files.length != 0)
            productPhotoRedirect(req.files, req.body.prodTitle)
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

router.post('/manage/products/edit/:id', upload.single(null), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        try {

            let product = await Product.findById(req.params.id)
            const checked = !!req.body.visible || false
            product.prodTitle = req.body.prodTitle
            product.category = req.body.category
            product.price = req.body.price
            product.visible = checked
            product.description = req.body.description

            product.save()
        } catch (e) {
            console.log('UPDATE PRODUCT ERROR', e);
        }
        res.redirect('../../../manage/products')
    } else
        res.redirect('/login')
})

router.get('/manage/news', async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        const news = await News.find({}).lean()
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

router.post('/manage/news/create', upload.single(null), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        try {

            const checked = !!req.body.visible || false
            const news = new News({
                newsTitle: req.body.newsTitle,
                category: req.body.category,
                visible: checked,
                text: req.body.data,
                author: req.body.author
            })
            news.save()
            res.redirect('/manage/news')
        } catch (e) {
            console.log(e);
        }

    } else {
        res.redirect('/login')
    }
})

router.get('/manage/news/edit/:id', async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {

        const news = await News.findById(req.params.id, (e) => {
            if (e)
                console.log(e)
        }).lean()

        const data = JSON.parse(news.text)
        console.log(typeof(data), data);
        res.render('./pages/manage/editNews', { layout: 'manage', news, data })

    } else
        res.redirect('/login')
})

router.post('/manage/news/edit/:id', upload.single(null), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        try {
            let news = await News.findById(req.params.id)
            const checked = !!req.body.visible || false

            news.newsTitle = req.body.newsTitle
            news.category = req.body.category
            news.text = req.body.data
            news.visible = checked
            news.save()
        } catch (e) {
            console.log('UPDATE NEWS ERROR', e);
        }
        res.redirect('../../../manage/news')
    } else
        res.redirect('/login')
})

router.post('/manage/news/uploadPhoto', upload.single('image'), async(req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        try {
            newsPhotoRedirect(req.file)
            res.status(201).json({
                "success": 1,
                "file": {
                    "url": `http://localhost:3000/image/news/${req.file.filename}.jpg`,
                }
            });
        } catch (err) {
            console.log(err)
        }
    } else {
        res.redirect('/login')
    }
    //console.log(req);
})

router.get('/manage/orders', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid))
        res.render('./pages/manage/orders', { layout: 'manage' })
    else
        res.redirect('/login')
})

module.exports = router