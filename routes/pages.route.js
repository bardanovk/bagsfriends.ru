const { Router } = require('express')
const News = require('../models/news')
const router = Router()
const Product = require('../models/product')
const cookieParser = require('cookie-parser')
const config = require('../config/tokens')


router.use(cookieParser(config.cookie))

router.get('/', (req, res) => {
    res.render('index', { title: 'Bagsfriends.ru' })
})
router.get('/shop', async(req, res) => {
    const products = await Product.find({ visible: true }).lean()
    console.log(products);
    res.render('./pages/public/shop', { title: 'Каталог', products })
})

router.get('/shop/product/:id', async(req, res) => {
    const product = await Product.findById(req.params.id).lean()
    res.render('./pages/public/productPage', { title: product.prodTitle, product })
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

router.get('/basket', async(req, res) => {
    console.log(req.cookies.order)
    if (req.cookies.order) {
        products = req.cookies.order.split(' ')
        console.log(products)

        var basket = [];


        /*for (let i = 0; i < products.lenght; i++) {
            product = Product.findById(products[i].lean())
            basket.push(product)
        }*/
        await products.forEach(element => {
            product = Product.findById(element).lean()
            basket.push(product)
        });

        console.log('basket', basket[0]);
        res.render('./pages/public/basket', { title: 'Корзина', basket })
    }
    res.render('./pages/public/basket', { title: 'Корзина' })
})

module.exports = router