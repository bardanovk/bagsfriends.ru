const { Router } = require('express')
const News = require('../models/news')
const router = Router()
const Product = require('../models/product')

router.get('/', (req, res) => {
    res.render('index', { title: 'Bagsfriends.ru' })
})
router.get('/shop', async(req, res) => {
    const products = await Product.find({ visible: true }).lean()
    res.render('./pages/public/shop', { title: 'Каталог', products })
})

router.get('/info', (req, res) => {
    res.render('./pages/public/info', { title: 'Условия' })
})

router.get('/blog', async(req, res) => {
    const news = await News.find({ visible: true }).lean()
    res.render('./pages/public/blog', { title: 'Новости мастерской', news })
})

router.get('/contact', (req, res) => {
    res.render('./pages/public/contact', { title: 'Контакты' })
})

router.get('/basket', (req, res) => {
    res.render('./pages/public/basket', { title: 'Корзина' })
})

module.exports = router