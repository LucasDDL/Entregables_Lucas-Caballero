import { Router } from "express";
import ProductManager from "../dao/fileManager/ProductManager.js";
import Product from "../dao/models/productModel.js";
import Cart from "../dao/models/cartModel.js";
import User from "../dao/models/userModel.js";

const router = Router()

const manager = new ProductManager('../Products.json')

router.get('/', (req, res, next) => {
        const isLogged = req.session && req.session.user
        res.status(200).render('home', {
            title: 'Home',
            isLogged,
        })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.get('/profile', async(req, res) => {
    try {
        if (req.session && req.session.user && req.session.user.id) {
            const user = await User.findById(req.session.user.id)
            if (user) {
                res.render('profile', {
                    title: 'Profile',
                    user: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        age: user.age,
                        email: user.email
                    }
                }) 
            } else {
                res.status(404).send('Usiario no encontrado')
            }
        } else {
            res.status(400).send('No has iniciado sesión')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error cargando perfil')
    }
})

router.get('/restore-password', (req, res) => {
    res.render('restore-password', {
        title: 'Restore Pasword',
    })
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
        if (!req.user) {
           return res.redirect('/login') 
        }

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
            products,
            user: {
                first_name: req.user.first_name,
                last_name: req.user.last_name
            }
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