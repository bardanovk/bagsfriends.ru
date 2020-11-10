const { Router } = require('express')
const router = Router()
const Product = require('../models/product')

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/shop', async(req, res) => {
    const products = await Product.find({ visible: true }).lean()
    res.render('./pages/public/shop', { products })
})

router.get('/info', (req, res) => {
    res.render('./pages/public/info')
})

router.get('/blog', (req, res) => {
    res.render('./pages/public/blog')
})

router.get('/contact', (req, res) => {
    res.render('./pages/public/contact')
})

module.exports = router