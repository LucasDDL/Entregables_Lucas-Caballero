import { Router } from "express";
import fs from 'fs'
import idValidator from "../middlewares/idValidator.js";
import Cart from "../dao/models/cartModel.js";
import Product from "../dao/models/productModel.js";

const router = Router();
// let carts = [];
let nextId = 1;
// const cartsPath = '../Carts.json'
// const productsPath = '../Products.json'

router.post('/', async (req, res, next) => {
    try {
        // carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf8'))
        while (carts.some(cart => cart.id === nextId)) {
            nextId++
        }
        const newCartId = nextId
        const newCart = {
            id: newCartId,
            products: []
        }
        const cartToSaveOnDb = new Cart(newCart)
        await cartToSaveOnDb.save()

        carts.push(newCart)
        res.json(newCart)
        await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, '\t'))
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.get('/:cid', idValidator('cid'), async (req, res, next) => {
    try {
        const cartId = +req.params.cid
        // carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf8'))
        // const cart = carts.find(c => c.id === cartId)
        const cartFromDb = await Cart.findOne({ id: cartId }, { products: 1, _id: 0 })
        if (cartFromDb) {
            res.json(cartFromDb)
        } else {
            throw new Error('Cart not found')
        }
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.post('/:cid/products/:pid', idValidator('cid'), idValidator('pid'), async (req, res, next) => {
    try {
        const cartId = +req.params.cid
        const productId = +req.params.pid
        // const allProducts = JSON.parse(await fs.promises.readFile(productsPath, 'utf8'))    
        // carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf-8'))
        // const cart = carts.find(c => c.id === cartId)
        // const product = allProducts.find(p => p.id === productId)
        const productFromDb = await Product.findOne({id: productId}) 
        const cartFromDb = await Cart.findOne({id: cartId})
        if (cartFromDb && productFromDb) {
            const productInCart = cartFromDb.products.find(p => p.id === productId)
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cartFromDb.products.push({
                    id: productFromDb.id,
                    quantity: 1
                })
            }
            await cartFromDb.save()
            // await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, '\t'))
            res.status(200).send({ message: 'Producto agregado con exito al carrito' })
        } else if (!cartFromDb) {
            throw new Error('Carrito no encontrado')
        } else if (!productFromDb) {
            throw new Error('Producto no encontrado')
        }

    } catch (error) {
        console.error(error);
        next(error)
    }
})

export default router