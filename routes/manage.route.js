const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const News = require('../models/news')
const multer = require('multer')
const productPhotoRedirect = require('../middleware/photoRedirect')
const newsPhotoRedirect = require('../middleware/editorPhotoUpload')
const newsLabelUpload = require('../middleware/photoNews')
const verifyF2B = require('../middleware/verifyF2B')
const verifyCookie = require('../middleware/verifyCookie')
const config = require('../config/tokens')
const options = require('../config/options')
const cookieParser = require('cookie-parser')
const hashCookie = require('../middleware/hashCookie')

const productValidar = require('../middleware/prodValidator')

//const photoNews = require('../middleware/photoNews')

const upload = multer({ dest: './tmp' })

router.use(cookieParser(config.cookie))

router.get('/login', async (req, res, next) => {

    if ((await verifyCookie(req, res)).valueOf())
        res.redirect('/manage')
    else
        res.render('./pages/manage/login')

})

router.post('/login', async (req, res) => {
    //console.log(req.body, req.body.pass1, req.aborted.pass2, verifyF2B(req.body.pass1, req.body.pass2))

    if (verifyF2B(req.body.pass1, req.body.pass2)) {
        res.cookie('sid', await hashCookie(req), options.admCookieOptions)
        res.redirect('/manage')
    } else {
        res.redirect('/login')
    }
})
// router.get('/test', (req, res) => {
//     let test = ''
//     try {
//         console.log(dateParser(Date.now(ч)));
//     } catch (e) {
//         test = 'test failed'
//         console.log(e);
//     }
//     res.render('./pages/manage/test', { layout: 'test', test })
// })

router.get('/logout', async (req, res) => {
    res.clearCookie('sid');
    res.redirect('/')
})

router.get('/manage', async (req, res) => {
    // console.log('enter point', verifyCookie(req, res));
    if ((await verifyCookie(req, res)).valueOf())
        res.render('./pages/manage/manage', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.get('/manage/products', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        const products = await Product.find({}).lean()
        res.render('./pages/manage/products', {
            layout: 'manage',
            products
        })
    } else
        res.redirect('/login')

})

router.get('/manage/products/create', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf())
        res.render('./pages/manage/createProduct', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.post('/manage/product/create', upload.array('photo'), async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        // console.log('body', req.body);
        try {
            // if (productValidar(req.body)) {
            console.log(req.body);
            console.log(typeof (req.body.category));
            let catArray = req.body.category.split(' # ')
            console.log(catArray);
            if (req.files.length != 0)
                productPhotoRedirect(req.files, req.body.prodTitle)
            const checked = !!req.body.visible || false
            const product = new Product({
                prodTitle: req.body.prodTitle,
                category: catArray,
                visible: checked,
                price: req.body.price,
                description: req.body.description
            })
            await product.save()

            // }
            res.redirect('/manage/products')
        } catch (error) {
            console.log(error);
            res.redirect('/manage/products')
        }

    } else
        res.redirect('/login')
})


/*
router.get('/manage/products/edit', (req, res) => {
    if (req.signedCookies.sid && verifyCookie(req, req.signedCookies.sid)) {
        prodId = req.body.prodId
        try {
            const product = new Product.findById(prodId).lean()

            console.log(product)
            res.render('./pages/manage/editProduct', { layout: 'manage' })
        } catch (e) {
            console.log(e)
            res.redirect('../')
        }
    } else
        res.redirect('/login')
})
*/
router.get('/manage/products/edit/:id', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {

        const product = await Product.findById(req.params.id, (e) => {
            if (e)
                console.log(e)
        }).lean()
        //console.log(typeof product.visible, product.visible)
        res.render('./pages/manage/editProduct', { layout: 'manage', product })

    } else
        res.redirect('/login')
})

router.post('/manage/products/edit/:id', upload.single(null), async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        try {
            let catArray = req.body.category.split(' # ')
            let product = await Product.findById(req.params.id)
            const checked = !!req.body.visible || false
            product.prodTitle = req.body.prodTitle
            product.category = catArray
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

router.get('/manage/news', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        const news = await News.find({}).lean()
        res.render('./pages/manage/news', { layout: 'manage', news })
    } else
        res.redirect('/login')
})

router.get('/manage/news/create', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf())
        res.render('./pages/manage/createNews', { layout: 'manage' })
    else
        res.redirect('/login')
})

router.post('/manage/news/create', upload.single('photo'), async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        try {
            newsLabelUpload(req.file, req.body.newsTitle)

            const checked = !!req.body.visible || false
            let description
            try {
                const editorJsData = JSON.parse(req.body.data).blocks
                console.log(editorJsData)
                for (let i = 0; i < editorJsData.length; i++) {
                    if (editorJsData[i].type == 'paragraph') {
                        description = String(editorJsData[i].data.text).substr(0, 150) + '...'
                        break
                    }
                }
            } catch (e) {
                console.log(e);
            }
            // console.log(description, typeof(description))
            const news = new News({
                newsTitle: req.body.newsTitle,
                category: req.body.category,
                visible: checked,
                text: req.body.data,
                discription: description
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

router.get('/manage/news/edit/:id', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {

        const news = await News.findById(req.params.id, (e) => {
            if (e)
                console.log(e)
        }).lean()

        const data = JSON.parse(news.text)
        res.render('./pages/manage/editNews', { layout: 'manage', news, data })

    } else
        res.redirect('/login')
})

router.post('/manage/news/edit/:id', upload.single(null), async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
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
router.post('/manage/news/delete/:id', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        try {
            console.log(req.params.id);
            News.findByIdAndDelete(req.params.id, (e, docs) => {
                if (e)
                    console.log(e);
                else
                    console.log('deleted', docs);
            })
            res.redirect('../../../manage/news/')
        } catch (e) {
            console.log(e)
            res.redirect('../../../manage/news')
        }
    } else
        res.redirect('/login')
})

router.post('/manage/news/uploadPhoto', upload.single('image'), async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf()) {
        try {
            newsPhotoRedirect(req.file)
            res.status(201).json({
                "success": 1,
                "file": {
                    "url": `../../../../image/news/${req.file.filename}.jpg`,
                }
            });
        } catch (err) {
            console.log(err)
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/manage/orders', async (req, res) => {
    if ((await verifyCookie(req, res)).valueOf())
        res.render('./pages/manage/orders', { layout: 'manage' })
    else
        res.redirect('/login')
})

module.exports = router