import { Router } from "express";
import ProductManager from "../dao/fileManager/ProductManager.js";
import Product from "../dao/models/productModel.js";
import Cart from "../dao/models/cartModel.js";

const router = Router()

const manager = new ProductManager('../Products.json')

router.get('/', async(req, res, next) => {
    try {
        const products = await manager.getProducts()
        res.status(200).render('home', {
            title: 'Products Home',
            products
        })
    } catch (error) {
        next(error)
    }
})

router.get('/realtimeproducts', async(req, res, next) => {
    try {
        const products = await manager.getProducts()
        res.status(200).render('realTimeProducts', {
            title: 'Products in real time',
            products,
            useWS: true,
            scripts: [
                'index.js'
            ]
        })
    } catch (error) {
        next(error)
    }
})

router.get('/products', async(req, res) => {
    try {
        let sort = req.query.sort;
        if (req.query.sort === '1' || req.query.sort === '-1') {
            sort = +req.query.sort
        }
        const options = {
            page: +req.query.page || 1,
            limit: +req.query.limit || 10,
        }
        if (sort !== undefined) {
            options.sort = {price: sort}
        }
        const query = req.query.query ? JSON.parse(req.query.query) : {};
        
        const productsPagination = await Product.paginate(query, options)
        const products = productsPagination.docs.map(prod => prod.toObject());
        res.render('products', {
            products
        })       
    } catch (error) {
        console.error(error);
    }
})

router.get('/carts/:cid', async(req, res) => {
    const cartId = req.params.cid
    const cart = await Cart.findById(cartId).populate('products.product')
    console.log(cart);
    res.json(cart.products)
})

export default router