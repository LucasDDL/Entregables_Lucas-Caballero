import { Router } from "express";
import fs from 'fs'
import idValidator from "../middlewares/idValidator.js";

const router = Router();
let carts = [];
let nextId = 1;
const cartsPath = '../Carts.json'
const productsPath = '../Products.json'

router.post('/', async(req, res, next) => {
    try {
        carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf8'))
        while (carts.some(cart => cart.id === nextId)) {
            nextId++
        }
        const newCartId = nextId
        const newCart = {
            id: newCartId,
            products: []
        }
        carts.push(newCart)
        res.json(newCart)
        await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, '\t'))
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.get('/:cid', idValidator('cid'), async(req, res, next) => {
    try {
        carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf8'))
        const cartId = +req.params.cid
        const cart = carts.find(c => c.id === cartId)
        if (cart) {
            res.json(cart.products)
        } else {
            throw new Error('Cart not found')
        }
    } catch (error) {
        console.error(error);
        next(error)
    }
}) 

router.post('/:cid/products/:pid', idValidator('cid'), idValidator('pid'), async(req, res, next) => {
    try {
    const allProducts = JSON.parse(await fs.promises.readFile(productsPath, 'utf8'))    
    carts = JSON.parse(await fs.promises.readFile(cartsPath, 'utf-8'))
    const cartId = +req.params.cid
    const productId = +req.params.pid

    const cart = carts.find(c => c.id === cartId)
    const product = allProducts.find(p => p.id === productId) 
    if (cart && product){
        const productInCart = cart.products.find(p => p.id === productId)
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({
                id: product.id,
                quantity: 1
            })
        }
       
        await fs.promises.writeFile(cartsPath, JSON.stringify(carts, null, '\t'))    
        res.status(200).send({message: 'Producto agregado con exito al carrito'})
    } else if (!cart){
        throw new Error('Carrito no encontrado')
    } else if (!product){
        throw new Error('Producto no encontrado') 
    }
   
    } catch (error) {
        console.error(error);
        next(error)
    }
})

export default router