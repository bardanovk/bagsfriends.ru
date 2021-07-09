const { Router } = require('express')
const News = require('../models/news')
const Product = require('../models/product')
const cookieParser = require('cookie-parser')
const config = require('../config/tokens')
const dateParse = require('../middleware/dateParser')
const catalogTitle = require('../middleware/catalogTitleParser')
const fs = require('fs')
const Order = require('../models/order')


const router = Router()

router.use(cookieParser(config.cookie))

router.get('/', async(req, res) => {
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
    const news = await News.find({ visible: true }).lean().sort({ date: -1 })
    res.render('./pages/public/blog', { title: 'Новости мастерской', news })
})

router.get('/blog/news/:id', async(req, res) => {
    try {
        let news = await News.findById(req.params.id).lean()
        let newsViews = news.views + 1
        await News.findByIdAndUpdate(req.params.id, { views: newsViews })
        const text = JSON.parse(news.text).blocks
            //const postDate = dateParse(news.date)
        res.render('./pages/public/newsPage', { title: news.newsTitle, news, text })
    } catch (e) {
        console.log(e)
        res.redirect('../')
    }
})

router.get('/shop/catalog/:category', async(req, res) => {
    try {
        // console.log(req.params.category)
        const products = await Product.find({ visible: true, category: req.params.category }).lean()
            // console.log(products)
        res.render('./pages/public/catalog', { products, title: catalogTitle(req.params.category), category: req.params.category })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

router.get('/shop/product/:product', async(req, res) => {
    try {
        const product = await Product.findById(req.params(product)).lean()
        const prodDir = fs.r2eaddirSync(`../static/image/products/${product.prodTitle}`)
        console.log('dir ', prodDir);
        res.render('./pages/public/productPage', { product, title: product.prodTitle })
    } catch (e) {
        console.log(e);
        res.redirect('/')
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
    try {
        //console.log(req.cookies.order)
        if (req.cookies.order) {
            products = req.cookies.order.split(' ')
                //console.log('prode', products)

            var basket = [];
            var totalPrice = 0
            for (let i = 0; i < products.length; i++) {
                //console.log(`id ${i}`, products[i]);
                const product = await Product.findById(products[i]).lean()
                    //console.log('prodes', product)
                totalPrice += Number(product.price)
                basket.push(product)
            }

            res.render('./pages/public/basket', { title: 'Корзина', basket, order: req.cookies.order, totalPrice })
        } else
            res.render('./pages/public/basket', { title: 'Корзина' })
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
})

router.get('/orders/search', async(req, res) => {
    try {
        res.render('./pages/public/search', { title: 'Поиск заказа' })
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
})

router.post('/orders/search', async(req, res) => {
    try {
        // console.log(req.body)
        res.redirect(`/orders/search/${req.body.orderNum}`)
    } catch (e) {
        console.log(e);
        res.redirect('/orders/search')
    }
})

router.get('/orders/search/:id', async(req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.id }).populate('basket').lean()
            //console.log(order);
        let totalPrice = Number.parseInt(order.totalPrice)
        if (order.deliveryPrice)
            totalPrice += Number.parseInt(order.deliveryPrice)
        res.render('./pages/public/search', { title: `Заказ #${order.orderNumber}`, order, totalPrice })
    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
})



router.post('/getOrder', async(req, res) => {
    try {
        dn = new Date(Date.now())
        const orderNum = '' + dn.getFullYear() + dn.getMonth() + dn.getDate() + dn.getHours() + dn.getMinutes() + dn.getSeconds() + (Math.round(Math.random(), 2) * 100)
            //console.log(req.body)
            //console.log(orderNum);
        const date = '' + dn.getFullYear() + '-' + dn.getMonth() + '-' + dn.getDate()
        const time = '' + dn.getHours() + ':' + dn.getMinutes()
        basket = req.body.order.split(' ')
        let totalPrice = 0

        for (let index = 0; index < basket.length; index++) {
            const element = basket[index];
            tmp = await Product.findById(element)
                //console.log(element);
                //console.log(tmp.price);
            totalPrice += 0 + Number(tmp.price)
        }

        const order = new Order({
            orderNumber: orderNum,
            basket: basket,
            customer: req.body.customer,
            phone: req.body.phone,
            address: req.body.address,
            comment: req.body.comment,
            email: req.body.email,
            totalPrice: totalPrice,
            orderDate: date,
            time: time
        })

        await order.save()
        res.clearCookie('order')
        res.redirect(`/orders/search/${order.orderNumber}`)

    } catch (e) {
        console.log(e);
        res.redirect('/')
    }
})

router.get('/clearOrder', async(req, res) => {
    try {
        res.clearCookie('order')
        res.redirect('/basket')
    } catch (e) {

        console.log(e);
        res.render('./pages/public/basket')
    }
})

module.exports = router
