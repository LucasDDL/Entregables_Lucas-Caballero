import { Router } from "express";
import ProductManager from "../dao/fileManager/ProductManager.js";

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

export default router