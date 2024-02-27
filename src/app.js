import  express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

const manager = new ProductManager('../Products.json')

app.get('/products', async (req, res) => {
    try {
        const limit = Number(req.query.limit)
        const products = await manager.getProducts()
        if (!isNaN(limit)) {
           res.send(products.slice(0, limit))
        } else {
            res.send(products);
        }
    } catch (error) {
        throw error
    }
});

app.get('/products/:pid', async(req, res) => {
    try {
        const productId = Number(req.params.pid)
        if (isNaN(productId)) {
            return res.status(400).send({error: 'Id de producto invalido'})
        }
        const productById = await manager.getProductById(productId)
        res.send(productById)
    } catch (error) {
        if (error.message === 'Not Found') {
            return res.status(404).send({error: 'El producto no existe'})
        }
        console.error(error);
        res.status(500).send({error: 'Error interno del servidor'})
    }
   
});

app.listen(8080, ()=>console.log('servidor escuchando en el puerto 8080'))