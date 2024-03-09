import { Router } from "express";
import ProductManager from "../ProductManager.js";
import idValidator from "../middlewares/idValidator.js";
import { wsServer } from "../app.js";

const router = Router();

const manager = new ProductManager('../Products.json')

router.post('/', async (req, res, next) => {
    try {
        const newProduct = await manager.addProduct(req.body)
        res.status(200).send(newProduct);
        const updatedProducts = await manager.getProducts()
        wsServer.emit('products-updated', {message: 'Un nuevo producto ha sido agregado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
    
})

router.get('/', async (req, res, next) => {
    try {
        const limit = +req.query.limit
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
        const productId = +req.params.pid
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
       const updatedProducts = await manager.getProducts()
       wsServer.emit('products-updated', {message: 'Un producto ha sido actualizado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
});

router.delete('/:pid', idValidator('pid', 'Id de producto invalido'), async(req, res, next) => {
    try {
        const productId = +req.params.pid
        const deletedProduct = await manager.deleteProduct(productId)
        res.status(200).send(deletedProduct)
        const updatedProducts = await manager.getProducts()
        wsServer.emit('products-updated', {message: 'Un producto ha sido eliminado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
})

export default router