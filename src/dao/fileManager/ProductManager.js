import fs from 'fs';
import Product from '../models/productModel.js';

class ProductManager {
    static id = 1;
    
    constructor(path) {
        this.products = [];
        this.path = path
        this.readFile()
    }

    async addProduct(product) {
        await this.readFile()
        // Define los campos requeridos
        const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];

        // Verifica si todos los campos requeridos están presentes
        for (const field of requiredFields) {
            if (!product.hasOwnProperty(field) || !product[field]) {
                throw new Error(`Falta el campo requerido: ${field}`);
            }
        }

        // Verifica si ya existe un producto con el mismo código
        for (const existingProduct of this.products) {
            if (existingProduct.code === product.code) {
                throw new Error('Código de producto duplicado');
            }
        }

         // Asigna un ID único al producto
         let newId = ProductManager.id;
         while (this.products.some(p => p.id === newId)) {
             newId++;
         }
         product.id = newId
        
        // agrega el campo status si no esta definido en true por defecto
        product.status = product.status || true;
        // Si todas las comprobaciones son exitosas, añade el producto
        this.products.push(product);

        await this.writeFile()
        return product
    }
    async getProducts() {
        await this.readFile()
        return this.products
    }

    async getProductById(id) {
        await this.readFile()
        const product = this.products.find(prod => prod.id === id)
        if (!product) {
            throw new Error('Not Found');
        }
        return product
    }

    async updateProduct(id, data) {
        await this.readFile()
        const productIndex = this.products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            throw new Error('Not found')
        }
        const updatedProduct = Object.assign(this.products[productIndex], data);
        await this.writeFile();
        return updatedProduct
    }

    async deleteProduct(id) {
        await this.readFile();
        const productIndex = this.products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            throw new Error('Not found');
        }

        this.products.splice(productIndex, 1);
        await this.writeFile();
        return {succses: `El producto con id: ${id} fue borrado con éxito`}
    }

    async writeFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        } catch (error) {
            console.error(error);
        }
    }

    async readFile() {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.path, 'utf8'));
        } catch (error) {
            console.error(error);
        }
    }
}

export default ProductManager

// const manager = new ProductManager('../Products.json');

// (async () => {
//     try {
//         await manager.addProduct({
//             "title": "guitarra",
//             "description": "Este es una guitarra",
//             "price": 2500,
//             "thumbnail": "Sin imagen",
//             "code": "gfd353",
//             "stock": 25    
//         })
//         await manager.addProduct({
//             title: 'bateria',
//             description: 'sdfsd',
//             price: 50360,
//             thumbnail: 'no hay imagen',
//             code: 'ghqa96786',
//             stock: 4
//         })

    
//     // console.log(await manager.getProductById(2));
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();

// // console.log(await manager.deleteProduct(1))

// // console.log(manager.getProducts());



