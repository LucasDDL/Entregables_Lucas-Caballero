import { Router } from "express";
import ProductManager from "../dao/fileManager/ProductManager.js";
import { wsServer } from "../app.js";
import Product from "../dao/models/productModel.js";

const router = Router();

const manager = new ProductManager('../Products.json')

router.post('/', async (req, res, next) => {
    try {
        const newProduct = await manager.addProduct(req.body);
        const productToSave = new Product(newProduct)
        await productToSave.save();
        
        res.status(200).send(newProduct);
        
        const updatedProducts = await Product.find({})
        wsServer.emit('products-updated', {message: 'Un nuevo producto ha sido agregado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const limit = req.query.limit
        const productsFromDb = await Product.find({});
       
        if (!isNaN(limit)) {
           res.status(200).send(productsFromDb.slice(0, limit))
        } else {
            res.status(200).send(productsFromDb);
        }
    } catch (error) {
        next(error)
    }
});

router.get('/:pid', async(req, res, next) => {
    try {
        const productId = +req.params.pid
        const productById = await Product.find({id: productId})
        res.status(200).send(productById)
    } catch (error) {
        next(error);
    }
});

router.put('/:pid', async(req, res, next) => {
    try {
       const data = req.body 
       const productId = +req.params.pid
       const updatedProduct = await Product.findOneAndUpdate({id: productId}, data)
       const updatedProductInFile = await manager.updateProduct(productId, data)
       res.status(200).send(updatedProduct)
       const updatedProducts = await manager.getProducts()
       wsServer.emit('products-updated', {message: 'Un producto ha sido actualizado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
});

router.delete('/:pid', async(req, res, next) => {
    try {
        const productId = +req.params.pid
        const deletedProduct = await Product.findOneAndDelete({id: productId})
        const deletedProductInFile = await manager.deleteProduct(+productId)
        res.status(200).send(deletedProduct)
        const updatedProducts = await Product.find({})
        wsServer.emit('products-updated', {message: 'Un producto ha sido eliminado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
})

export default router