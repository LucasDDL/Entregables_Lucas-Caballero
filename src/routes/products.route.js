import { Router } from "express";
import ProductManager from "../ProductManager.js";
import idValidator from "../middlewares/idValidator.js";

const router = Router();

const manager = new ProductManager('../Products.json')

router.post('/', async (req, res, next) => {
    try {
        const newProduct = await manager.addProduct(req.body)
        res.status(200).send(newProduct);
    } catch (error) {
        next(error)
    }
    
})

router.get('/', async (req, res, next) => {
    try {
        const limit = Number(req.query.limit)
        const products = await manager.getProducts()
        if (!isNaN(limit)) {
           res.status(200).send(products.slice(0, limit))
        } else {
            res.status(200).send(products);
        }
    } catch (error) {
        next(error)
    }
});

router.get('/:pid', idValidator('pid', 'Id de producto invalido'), async(req, res, next) => {
    try {
        const productId = Number(req.params.pid)
        const productById = await manager.getProductById(productId)
        res.status(200).send(productById)
    } catch (error) {
        next(error);
    }
});

router.put('/:pid', idValidator('pid', 'Id de producto invalido'), async(req, res, next) => {
    try {
       const data = req.body 
       const productId = +req.params.pid
       const updatedProduct = await manager.updateProduct(productId, data)
       res.status(200).send(updatedProduct)
    } catch (error) {
        next(error)
    }
});

router.delete('/:pid', idValidator('pid', 'Id de producto invalido'), async(req, res, next) => {
    try {
        const productId = +req.params.pid
        const deletedProduct = await manager.deleteProduct(productId)
        res.status(200).send(deletedProduct)
    } catch (error) {
        next(error)
    }
})

export default router