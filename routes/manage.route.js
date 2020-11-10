const { Router } = require('express')
const router = Router()
const Product = require('../models/product')
const multer = require('multer')
const photoRedirect = require('../controller/photoRedirect')

const upload = multer({ dest: './tmp' })


router.get('/manage', (req, res) => {
    res.render('./pages/manage/manage', { layout: 'manage' })
})

router.get('/manage/products', async(req, res) => {
    const products = await Product.find({}).lean()
    res.render('./pages/manage/products', {
        layout: 'manage',
        products
    })
})

router.get('/manage/products/create', (req, res) => {
    res.render('./pages/manage/createProduct', { layout: 'manage' })
})

router.get('/manage/orders', (req, res) => {
    res.render('./pages/manage/orders', { layout: 'manage' })
})

router.get('/manage/news', (req, res) => {
    res.render('./pages/manage/news', { layout: 'manage' })
})
router.get('/manage/products/edit', (req, res) => {
    prodId = req.body.prodId
    try {
        const product = new Product.findById(prodId).lean()

        console.log(product)
        res.render('./pages/manage/editProduct', { layout: 'manage' })
    } catch (e) {
        console.log(e)
    }
})

router.post('/create', upload.array('photo'), async(req, res) => {

    photoRedirect(req.files, req.body.prodTitle)
    const product = new Product({
        prodTitle: req.body.prodTitle,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description
    })

    product.save()
    res.redirect('/manage/products')
})

module.exports = router