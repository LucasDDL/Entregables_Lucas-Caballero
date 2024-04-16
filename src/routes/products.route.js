import { Router, query } from "express";
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
        
        res.status(200).json(newProduct);
        
        const updatedProducts = await Product.find({})
        wsServer.emit('products-updated', {message: 'Un nuevo producto ha sido agregado', products: updatedProducts})
    } catch (error) {
        next(error)
    }
})


router.get('/', async (req, res, next) => {
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
        const query = req.query.query ? JSON.parse(req.query.query) : {}
        
        const products = await Product.paginate(query, options)
        
        let status;
        let hasPrevPageValue = "no";
        let hasNextPageValue = "no";
        let prevLink = null;
        let nextLink = null;
        products? status="succes" : status="error"
        if(products.hasPrevPage) {
            hasPrevPageValue = "yes"
            const prevPage = products.page - 1
            prevLink = `http://localhost:8080/api/products?page=${prevPage}`
        } 
        if (products.hasNextPage) {
            hasNextPageValue = "yes"
            const nextPage = products.page + 1
            nextLink = `http://localhost:8080/api/products?page=${nextPage}`
        }
        products.hasNextPage? hasNextPageValue="yes" : hasNextPageValue="no"
        products.hasPrevPage? hasPrevPageValue="yes" : hasPrevPageValue="no"

        res.send({
            status: status,
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: hasPrevPageValue,
            hasNextPage: hasNextPageValue,
            prevLink: prevLink,
            nextLink: nextLink
        })
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