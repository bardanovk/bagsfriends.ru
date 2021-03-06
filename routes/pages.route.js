const { Router } = require('express')
const News = require('../models/news')
const Product = require('../models/product')
const cookieParser = require('cookie-parser')
const config = require('../config/tokens')
const dateParse = require('../middleware/dateParser')

const router = Router()

router.use(cookieParser(config.cookie))

router.get('/', (req, res) => {
    res.render('index', { title: 'Bagsfriends.ru' })
})
router.get('/shop', async(req, res) => {
    const products = await Product.find({ visible: true }).lean()
        //console.log(products);
    res.render('./pages/public/shop', { title: 'Каталог', products })
})

router.get('/shop/product/:id', async(req, res) => {
    const product = await Product.findById(req.params.id).lean()
        //console.log('prodid', product);
    res.render('./pages/public/productPage', { title: product.prodTitle, product })
})

router.get('/info', (req, res) => {
    res.render('./pages/public/info', { title: 'Условия' })
})

router.get('/blog', async(req, res) => {
    const news = await News.find({ visible: true }).lean()
    res.render('./pages/public/blog', { title: 'Новости мастерской', news })
})

router.get('/blog/news/:id', async(req, res) => {
    try {
        const news = await News.findById(req.params.id).lean()
        const text = JSON.parse(news.text).blocks
        const postDate = dateParse(news.date)
        res.render('./pages/public/newsPage', { title: 'Новости мастерской', news, text, postDate })
    } catch (e) {
        console.log(e)
        res.redirect('../')
    }
})

router.get('/contact', (req, res) => {
    res.render('./pages/public/contact', { title: 'Контакты' })
})


///// API test

router.get('/api', (req, res) => {
    console.log('req', req.headers, req.rawHeaders);
    console.log('\n#############################################\n');

    res.status(200).json({
        "get": "ok"
    })
    console.log('res', res.headers, res.rawHeaders);
})

router.post('/api', (req, res) => {
    console.log('req', req);
    console.log('\n#############################################\n');

    res.status(200).json({
        "post": "ok"
    });
})

router.get('/basket', async(req, res) => {
    //console.log(req.cookies.order)
    if (req.cookies.order) {
        products = req.cookies.order.split(' ')
            //console.log('prode', products)

        var basket = [];

        for (let i = 0; i < products.length; i++) {
            //console.log('id', products[i]);
            product = await Product.findById(products[i]).lean()
                //console.log('prodes', product)
            basket.push(product)
        }
        /*await products.forEach(element => {
            product = Product.findById(element).lean()
            console.log('prod', product);
            basket.push(product)
        });*/

        //console.log('basket', basket);
        res.render('./pages/public/basket', { title: 'Корзина', basket })
    } else
        res.render('./pages/public/basket', { title: 'Корзина' })
})

module.exports = router